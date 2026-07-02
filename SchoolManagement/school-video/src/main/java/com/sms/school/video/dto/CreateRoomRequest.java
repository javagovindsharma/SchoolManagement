package com.sms.school.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomRequest {

    private String roomName;
    private String callType;
    private int maxParticipants;
    private String targetUserId;
}
