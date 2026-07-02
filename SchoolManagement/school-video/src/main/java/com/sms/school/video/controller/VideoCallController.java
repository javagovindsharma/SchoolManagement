package com.sms.school.video.controller;

import com.sms.school.video.dto.CreateRoomRequest;
import com.sms.school.video.dto.RoomInfo;
import com.sms.school.video.model.VideoRoom;
import com.sms.school.video.service.RoomManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoCallController {

    private final RoomManagerService roomManager;

    @PostMapping("/rooms")
    public ResponseEntity<RoomInfo> createRoom(
            @RequestBody CreateRoomRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String userName) {

        VideoRoom room = roomManager.createRoom(
                request.getRoomName(),
                userId,
                userName,
                request.getCallType(),
                request.getMaxParticipants()
        );

        return ResponseEntity.ok(roomManager.toRoomInfo(room));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomInfo>> getActiveRooms() {
        return ResponseEntity.ok(roomManager.getActiveRooms());
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<RoomInfo> getRoomDetails(
            @PathVariable String roomId) {

        VideoRoom room = roomManager.getRoom(roomId);

        if (room == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(roomManager.toRoomInfo(room));
    }

    @GetMapping("/online")
    public ResponseEntity<Set<String>> getOnlineUsers() {
        return ResponseEntity.ok(roomManager.getOnlineUsers());
    }

    @GetMapping("/online/{userId}")
    public ResponseEntity<Map<String, Boolean>> isUserOnline(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                Map.of("online", roomManager.isUserOnline(userId))
        );
    }
}