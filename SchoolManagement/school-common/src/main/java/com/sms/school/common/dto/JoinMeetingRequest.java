package com.sms.school.common.dto;

import lombok.Data;

@Data
public class JoinMeetingRequest {

    private String meetingCode;

    private Long userId;

    private String role;   // STUDENT, TEACHER, PARENT
}