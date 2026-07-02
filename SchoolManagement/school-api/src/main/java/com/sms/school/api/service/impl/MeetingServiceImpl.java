package com.sms.school.api.service.impl;

import com.sms.school.api.repository.MeetingParticipantRepository;
import com.sms.school.common.dto.CreateMeetingRequest;
import com.sms.school.common.dto.JoinMeetingRequest;
import com.sms.school.common.dto.MeetingResponse;
import com.sms.school.common.dto.ParticipantResponse;
import com.sms.school.common.entity.Meeting;
import com.sms.school.common.entity.MeetingParticipant;
import com.sms.school.common.enums.MeetingStatus;
import com.sms.school.api.service.MeetingService;
import com.sms.school.api.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingParticipantRepository participantRepository;

    @Override
    public MeetingResponse createMeeting(CreateMeetingRequest request) {
        Meeting meeting = Meeting.builder()
                .meetingCode(UUID.randomUUID().toString())
                .title(request.getTitle())
                .hostId(request.getHostId())
                .meetingType(request.getMeetingType())
                .scheduledTime(request.getScheduledTime())
                .duration(request.getDuration())
                .status(MeetingStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .build();

        Meeting savedMeeting = meetingRepository.save(meeting);
        return MeetingResponse.builder()
                .id(savedMeeting.getId())
                .meetingCode(savedMeeting.getMeetingCode())
                .title(savedMeeting.getTitle())
                .status(savedMeeting.getStatus().name())
                .build();
    }

    @Override
    public MeetingResponse joinMeeting(JoinMeetingRequest request) {
        Meeting meeting = meetingRepository.findByMeetingCode(request.getMeetingCode())
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        MeetingParticipant participant = MeetingParticipant.builder()
                .meetingId(meeting.getId())
                .userId(request.getUserId())
                .role(request.getRole())
                .joinedAt(LocalDateTime.now())
                .build();
        participantRepository.save(participant);
        return MeetingResponse.builder()
                .id(meeting.getId())
                .meetingCode(meeting.getMeetingCode())
                .title(meeting.getTitle())
                .status(meeting.getStatus().name())
                .build();
    }

    @Override
    public List<ParticipantResponse> getParticipants(Long meetingId) {
        return participantRepository.findByMeetingId(meetingId)
                .stream()
                .map(p -> ParticipantResponse.builder()
                        .participantId(p.getId())
                        .userId(p.getUserId())
                        .role(p.getRole())
                        .joinedAt(p.getJoinedAt())
                        .build())
                .toList();
    }

    @Override
    public void leaveMeeting(Long participantId) {
        MeetingParticipant participant =
                participantRepository.findById(participantId)
                        .orElseThrow();
        participant.setLeftAt(LocalDateTime.now());
        participantRepository.save(participant);

    }

    @Override
    public MeetingResponse getMeeting(String meetingCode) {
        Meeting meeting = meetingRepository.findByMeetingCode(meetingCode)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        return MeetingResponse.builder()
                .id(meeting.getId())
                .meetingCode(meeting.getMeetingCode())
                .title(meeting.getTitle())
                .status(meeting.getStatus().name())
                .build();
    }

    @Override
    public void startMeeting(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        meeting.setStatus(MeetingStatus.LIVE);
        meetingRepository.save(meeting);
    }

    @Override
    public void endMeeting(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        meeting.setStatus(MeetingStatus.ENDED);
        meetingRepository.save(meeting);
    }
}