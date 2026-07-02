package com.sms.school.common.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MeetingResponse {

    private Long id;

    private String meetingCode;

    private String title;

    private String status;

}