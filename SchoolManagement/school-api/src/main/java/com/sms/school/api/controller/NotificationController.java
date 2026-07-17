package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.NotificationRepository;
import com.sms.school.common.entity.Notification;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll(@AuthenticationPrincipal User user) {
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        List<Notification> notifications = branchId != null
                ? notificationRepository.findByBranchIdOrderByCreatedAtDesc(branchId)
                : notificationRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Notification>> send(@RequestBody Notification notification, @AuthenticationPrincipal User user) {
        notification.setSentBy(user);
        notificationRepository.save(notification);
        return ResponseEntity.ok(ApiResponse.success("Notification sent", notification));
    }
}
