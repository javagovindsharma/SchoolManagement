package com.sms.school.common.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ParticipantResponse {

    private Long participantId;

    private Long userId;

    private String role;

    private LocalDateTime joinedAt;
}