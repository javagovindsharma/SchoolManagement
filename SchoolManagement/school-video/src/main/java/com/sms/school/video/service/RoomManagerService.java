package com.sms.school.video.service;

import com.sms.school.video.dto.ParticipantInfo;
import com.sms.school.video.dto.RoomInfo;
import com.sms.school.video.model.VideoRoom;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RoomManagerService {

    private final Map<String, VideoRoom> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> userRoomMapping = new ConcurrentHashMap<>();
    private final Map<String, WebSocketSession> onlineUsers = new ConcurrentHashMap<>();

    public void registerUser(String userId, WebSocketSession session) {
        onlineUsers.put(userId, session);
        log.info("User registered: {}", userId);
    }

    public void unregisterUser(String userId) {
        onlineUsers.remove(userId);
        String roomId = userRoomMapping.get(userId);
        if (roomId != null) {
            leaveRoom(userId, roomId);
        }
        log.info("User unregistered: {}", userId);
    }

    public VideoRoom createRoom(String roomName, String creatorId, String creatorName,
                                String callType, int maxParticipants) {
        String roomId = UUID.randomUUID().toString().substring(0, 8);

        VideoRoom room = VideoRoom.builder()
                .roomId(roomId)
                .roomName(roomName != null ? roomName : "Room-" + roomId)
                .createdBy(creatorId)
                .creatorName(creatorName)
                .callType(callType != null ? callType : "GROUP")
                .maxParticipants(maxParticipants > 0 ? maxParticipants : 10)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        rooms.put(roomId, room);
        log.info("Room created: {} by {} ({})", roomId, creatorName, callType);
        return room;
    }

    public VideoRoom joinRoom(String roomId, String userId, String userName, String role,
                              WebSocketSession session) {
        VideoRoom room = rooms.get(roomId);
        if (room == null || !room.isActive() || room.isFull()) {
            return null;
        }

        room.addParticipant(userId, userName, role, session);
        userRoomMapping.put(userId, roomId);
        log.info("User {} joined room {}", userName, roomId);
        return room;
    }

    public VideoRoom leaveRoom(String userId, String roomId) {
        VideoRoom room = rooms.get(roomId);
        if (room == null) return null;

        room.removeParticipant(userId);
        userRoomMapping.remove(userId);

        if (room.getParticipantCount() == 0) {
            room.setActive(false);
            rooms.remove(roomId);
            log.info("Room {} removed (empty)", roomId);
        }
        return room;
    }

    public VideoRoom getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public String getUserRoom(String userId) {
        return userRoomMapping.get(userId);
    }

    public WebSocketSession getUserSession(String userId) {
        return onlineUsers.get(userId);
    }

    public boolean isUserOnline(String userId) {
        return onlineUsers.containsKey(userId);
    }

    public List<RoomInfo> getActiveRooms() {
        return rooms.values().stream()
                .filter(VideoRoom::isActive)
                .map(this::toRoomInfo)
                .toList();
    }

    public Set<String> getOnlineUsers() {
        return onlineUsers.keySet();
    }

    public RoomInfo toRoomInfo(VideoRoom room) {
        return RoomInfo.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .createdBy(room.getCreatedBy())
                .creatorName(room.getCreatorName())
                .callType(room.getCallType())
                .maxParticipants(room.getMaxParticipants())
                .currentParticipants(room.getParticipantCount())
                .participants(new ArrayList<>(room.getParticipants().values()))
                .active(room.isActive())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
