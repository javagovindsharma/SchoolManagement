package com.sms.school.video.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.school.video.dto.SignalingMessage;
import com.sms.school.video.dto.SignalingMessage.MessageType;
import com.sms.school.video.model.VideoRoom;
import com.sms.school.video.service.RoomManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class VideoCallSignalingHandler extends TextWebSocketHandler {

    private final RoomManagerService roomManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getAttribute(session, "userId");
        String userName = getAttribute(session, "userName");
        roomManager.registerUser(userId, session);
        log.info("WebSocket connected: {} ({})", userName, userId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String userId = getAttribute(session, "userId");
        String userName = getAttribute(session, "userName");
        String role = getAttribute(session, "role");

        SignalingMessage msg;
        try {
            msg = objectMapper.readValue(message.getPayload(), SignalingMessage.class);
        } catch (Exception e) {
            sendError(session, "Invalid message format");
            return;
        }

        msg.setSenderId(userId);
        msg.setSenderName(userName);
        msg.setRole(role);

        switch (msg.getType()) {
            case CREATE_ROOM -> handleCreateRoom(session, msg);
            case JOIN_ROOM -> handleJoinRoom(session, msg);
            case LEAVE_ROOM -> handleLeaveRoom(session, msg);
            case CALL_USER -> handleCallUser(session, msg);
            case CALL_ACCEPTED -> handleCallAccepted(session, msg);
            case CALL_REJECTED -> handleCallRejected(session, msg);
            case OFFER, ANSWER, ICE_CANDIDATE -> forwardToTarget(msg);
            default -> sendError(session, "Unknown message type");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = getAttribute(session, "userId");
        String userName = getAttribute(session, "userName");

        String roomId = roomManager.getUserRoom(userId);
        if (roomId != null) {
            VideoRoom room = roomManager.getRoom(roomId);
            if (room != null) {
                notifyRoom(room, userId, SignalingMessage.builder()
                        .type(MessageType.USER_LEFT)
                        .roomId(roomId)
                        .senderId(userId)
                        .senderName(userName)
                        .build());
            }
        }

        roomManager.unregisterUser(userId);
        log.info("WebSocket disconnected: {} ({})", userName, userId);
    }

    private void handleCreateRoom(WebSocketSession session, SignalingMessage msg) throws IOException {
        VideoRoom room = roomManager.createRoom(
                msg.getRoomId(), msg.getSenderId(), msg.getSenderName(),
                msg.getCallType(), msg.getCallType() != null && msg.getCallType().equals("ONE_TO_ONE") ? 2 : 30
        );
        roomManager.joinRoom(room.getRoomId(), msg.getSenderId(), msg.getSenderName(), msg.getRole(), session);

        sendMessage(session, SignalingMessage.builder()
                .type(MessageType.ROOM_CREATED)
                .roomId(room.getRoomId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .callType(msg.getCallType())
                .build());
    }

    private void handleJoinRoom(WebSocketSession session, SignalingMessage msg) throws IOException {
        VideoRoom room = roomManager.joinRoom(msg.getRoomId(), msg.getSenderId(), msg.getSenderName(), msg.getRole(), session);
        if (room == null) {
            sendError(session, "Room not found or full: " + msg.getRoomId());
            return;
        }

        notifyRoom(room, msg.getSenderId(), SignalingMessage.builder()
                .type(MessageType.USER_JOINED)
                .roomId(msg.getRoomId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .role(msg.getRole())
                .build());

        sendMessage(session, SignalingMessage.builder()
                .type(MessageType.JOIN_ROOM)
                .roomId(msg.getRoomId())
                .senderId(msg.getSenderId())
                .payload(roomManager.toRoomInfo(room))
                .build());
    }

    private void handleLeaveRoom(WebSocketSession session, SignalingMessage msg) throws IOException {
        VideoRoom room = roomManager.leaveRoom(msg.getSenderId(), msg.getRoomId());
        if (room != null && room.isActive()) {
            notifyRoom(room, msg.getSenderId(), SignalingMessage.builder()
                    .type(MessageType.USER_LEFT)
                    .roomId(msg.getRoomId())
                    .senderId(msg.getSenderId())
                    .senderName(msg.getSenderName())
                    .build());
        }
    }

    private void handleCallUser(WebSocketSession session, SignalingMessage msg) throws IOException {
        String targetUserId = msg.getTargetUserId();
        if (targetUserId == null || !roomManager.isUserOnline(targetUserId)) {
            sendError(session, "User not online: " + targetUserId);
            return;
        }
        VideoRoom room = roomManager.createRoom(null, msg.getSenderId(), msg.getSenderName(), "ONE_TO_ONE", 2);
        roomManager.joinRoom(room.getRoomId(), msg.getSenderId(), msg.getSenderName(), msg.getRole(), session);
        WebSocketSession targetSession = roomManager.getUserSession(targetUserId);
        if (targetSession != null && targetSession.isOpen()) {
            sendMessage(targetSession, SignalingMessage.builder()
                    .type(MessageType.INCOMING_CALL)
                    .roomId(room.getRoomId())
                    .senderId(msg.getSenderId())
                    .senderName(msg.getSenderName())
                    .role(msg.getRole())
                    .callType("ONE_TO_ONE")
                    .build());
        }

        sendMessage(session, SignalingMessage.builder()
                .type(MessageType.ROOM_CREATED)
                .roomId(room.getRoomId())
                .callType("ONE_TO_ONE")
                .targetUserId(targetUserId)
                .build());
    }

    private void handleCallAccepted(WebSocketSession session, SignalingMessage msg) throws IOException {
        VideoRoom room = roomManager.joinRoom(msg.getRoomId(), msg.getSenderId(), msg.getSenderName(), msg.getRole(), session);
        if (room == null) {
            sendError(session, "Room not found: " + msg.getRoomId());
            return;
        }

        notifyRoom(room, msg.getSenderId(), SignalingMessage.builder()
                .type(MessageType.CALL_ACCEPTED)
                .roomId(msg.getRoomId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .build());

        sendMessage(session, SignalingMessage.builder()
                .type(MessageType.JOIN_ROOM)
                .roomId(msg.getRoomId())
                .senderId(msg.getSenderId())
                .payload(roomManager.toRoomInfo(room))
                .build());
    }

    private void handleCallRejected(WebSocketSession session, SignalingMessage msg) throws IOException {
        VideoRoom room = roomManager.getRoom(msg.getRoomId());
        if (room != null) {
            notifyRoom(room, msg.getSenderId(), SignalingMessage.builder()
                    .type(MessageType.CALL_REJECTED)
                    .roomId(msg.getRoomId())
                    .senderId(msg.getSenderId())
                    .senderName(msg.getSenderName())
                    .build());
            room.setActive(false);
        }
    }
    private void forwardToTarget(SignalingMessage msg) throws IOException {
        String targetUserId = msg.getTargetUserId();
        if (targetUserId != null && !targetUserId.isBlank()) {
            WebSocketSession targetSession = roomManager.getUserSession(targetUserId);
            if (targetSession != null && targetSession.isOpen()) {
                sendMessage(targetSession, msg);
            }
        } else {
            VideoRoom room = roomManager.getRoom(msg.getRoomId());
            if (room != null) {
                notifyRoom(room, msg.getSenderId(), msg);
            }
        }
    }

    private void notifyRoom(VideoRoom room, String excludeUserId, SignalingMessage message) {
        room.getSessions().forEach((id, s) -> {
            if (!id.equals(excludeUserId) && s.isOpen()) {
                try { sendMessage(s, message); } catch (IOException e) {
                    log.error("Failed to send to {}: {}", id, e.getMessage());
                }
            }
        });
    }

    private void sendMessage(WebSocketSession session, SignalingMessage message) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        }
    }

    private void sendError(WebSocketSession session, String error) throws IOException {
        sendMessage(session, SignalingMessage.builder().type(MessageType.ERROR).payload(error).build());
    }

    private String getAttribute(WebSocketSession session, String key) {
        Object val = session.getAttributes().get(key);
        return val != null ? val.toString() : "";
    }
}
