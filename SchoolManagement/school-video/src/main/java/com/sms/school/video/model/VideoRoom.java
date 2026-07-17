package com.sms.school.video.model;

import com.sms.school.video.dto.ParticipantInfo;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
@Builder
public class VideoRoom {

    private String roomId;
    private String roomName;
    private String createdBy;
    private String creatorName;
    private String callType;
    private int maxParticipants;
    private boolean active;
    private LocalDateTime createdAt;

    @Builder.Default
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Builder.Default
    private Map<String, ParticipantInfo> participants = new ConcurrentHashMap<>();

    public boolean isFull() {
        return participants.size() >= maxParticipants;
    }

    public void addParticipant(String userId, String userName, String role, WebSocketSession session) {
        participants.put(userId, ParticipantInfo.builder()
                .userId(userId)
                .userName(userName)
                .role(role)
                .joinedAt(LocalDateTime.now())
                .build());
        sessions.put(userId, session);
    }

    public void removeParticipant(String userId) {
        participants.remove(userId);
        sessions.remove(userId);
    }

    public int getParticipantCount() {
        return participants.size();
    }
}
