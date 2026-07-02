package com.sms.school.api.controller;

import com.sms.school.common.dto.CreateMeetingRequest;
import com.sms.school.common.dto.JoinMeetingRequest;
import com.sms.school.common.dto.MeetingResponse;
import com.sms.school.api.service.MeetingService;
import com.sms.school.common.dto.ParticipantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    public ResponseEntity<MeetingResponse> createMeeting(
            @RequestBody CreateMeetingRequest request) {

        return new ResponseEntity<>(
                meetingService.createMeeting(request),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/join")
    public ResponseEntity<MeetingResponse> joinMeeting(
            @RequestBody JoinMeetingRequest request){

        return ResponseEntity.ok(
                meetingService.joinMeeting(request));

    }

    @GetMapping("/{meetingId}/participants")
    public ResponseEntity<List<ParticipantResponse>> participants(
            @PathVariable Long meetingId){

        return ResponseEntity.ok(
                meetingService.getParticipants(meetingId));

    }

    @PutMapping("/participants/{participantId}/leave")
    public ResponseEntity<Void> leaveMeeting(
            @PathVariable Long participantId){

        meetingService.leaveMeeting(participantId);

        return ResponseEntity.ok().build();

    }
    @GetMapping("/{meetingCode}")
    public ResponseEntity<MeetingResponse> getMeeting(
            @PathVariable String meetingCode) {

        return ResponseEntity.ok(
                meetingService.getMeeting(meetingCode));
    }
    @PutMapping("/{meetingId}/start")
    public ResponseEntity<Void> startMeeting(
            @PathVariable Long meetingId) {

        meetingService.startMeeting(meetingId);

        return ResponseEntity.ok().build();
    }
    @PutMapping("/{meetingId}/end")
    public ResponseEntity<Void> endMeeting(
            @PathVariable Long meetingId) {

        meetingService.endMeeting(meetingId);

        return ResponseEntity.ok().build();
    }
}