package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.*;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(@AuthenticationPrincipal User user) {
        Map<String, Object> stats = new HashMap<>();

        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;

        if (branchId != null) {
            stats.put("totalStudents", studentRepository.countByBranchIdAndIsActiveTrue(branchId));
            stats.put("totalStaff", staffRepository.countByBranchIdAndIsActiveTrue(branchId));
        } else {
            stats.put("totalStudents", studentRepository.count());
            stats.put("totalStaff", staffRepository.count());
        }

        stats.put("totalBranches", branchRepository.findByIsActiveTrue().size());
        stats.put("totalUsers", userRepository.count());

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
