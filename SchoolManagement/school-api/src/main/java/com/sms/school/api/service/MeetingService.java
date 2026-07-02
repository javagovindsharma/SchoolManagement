package com.sms.school.api.service;

import com.sms.school.common.dto.CreateMeetingRequest;
import com.sms.school.common.dto.JoinMeetingRequest;
import com.sms.school.common.dto.MeetingResponse;
import com.sms.school.common.dto.ParticipantResponse;

import java.util.List;

public interface MeetingService {

    MeetingResponse createMeeting(CreateMeetingRequest request);
    MeetingResponse joinMeeting(JoinMeetingRequest request);

    List<ParticipantResponse> getParticipants(Long meetingId);

    void leaveMeeting(Long participantId);

    MeetingResponse getMeeting(String meetingCode);

    void startMeeting(Long meetingId);

    void endMeeting(Long meetingId);

}