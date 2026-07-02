package com.sms.school.common.dto;

import com.sms.school.common.enums.MeetingType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateMeetingRequest {

    private String title;

    private Long hostId;

    private MeetingType meetingType;

    private LocalDateTime scheduledTime;

    private Integer duration;

}