package com.sms.school.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomInfo {

    private String roomId;
    private String roomName;
    private String createdBy;
    private String creatorName;
    private String callType;
    private int maxParticipants;
    private int currentParticipants;
    private List<ParticipantInfo> participants;
    private boolean active;
    private LocalDateTime createdAt;
}
