package com.sms.school.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalingMessage {

    private MessageType type;
    private String roomId;
    private String senderId;
    private String senderName;
    private String targetUserId;
    private String role;
    private String callType;
    private Object payload;

    public enum MessageType {
        CREATE_ROOM,
        JOIN_ROOM,
        LEAVE_ROOM,
        ROOM_CREATED,
        CALL_USER,
        CALL_ACCEPTED,
        CALL_REJECTED,
        INCOMING_CALL,
        OFFER,
        ANSWER,
        ICE_CANDIDATE,
        USER_JOINED,
        USER_LEFT,
        ROOM_FULL,
        ERROR
    }
}