package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.StaffRepository;
import com.sms.school.common.entity.Staff;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffRepository staffRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Staff>>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        var pageable = PageRequest.of(page, size, Sort.by("user.firstName").ascending());
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;

        Page<Staff> staff;
        if (search != null && !search.isBlank() && branchId != null) {
            staff = staffRepository.searchByBranch(branchId, search, pageable);
        } else if (branchId != null) {
            staff = staffRepository.findByBranchId(branchId, pageable);
        } else {
            staff = staffRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> getById(@PathVariable Long id) {
        Staff s = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        return ResponseEntity.ok(ApiResponse.success(s));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> count(@AuthenticationPrincipal User user) {
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        long count = branchId != null ? staffRepository.countByBranchIdAndIsActiveTrue(branchId) : staffRepository.count();
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}
