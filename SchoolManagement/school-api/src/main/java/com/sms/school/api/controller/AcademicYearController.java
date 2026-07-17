package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.AcademicYearRepository;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.common.entity.AcademicYear;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

    private final AcademicYearRepository academicYearRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<AcademicYear>>> getAll(@AuthenticationPrincipal User user) {
        List<AcademicYear> years = academicYearRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(years));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<AcademicYear>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String name = (String) dto.get("name");
        String startDateStr = (String) dto.get("startDate");
        String endDateStr = (String) dto.get("endDate");
        Boolean isCurrent = dto.get("isCurrent") != null ? Boolean.valueOf(dto.get("isCurrent").toString()) : true;

        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Name is required"));
        }
        if (startDateStr == null || endDateStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Start and end dates are required"));
        }

        // Resolve branch
        Branch branch = currentUser.getBranch();
        if (branch == null) {
            Object branchIdObj = dto.get("branchId");
            if (branchIdObj != null) {
                branch = branchRepository.findById(Long.valueOf(branchIdObj.toString())).orElse(null);
            }
            if (branch == null) {
                var branches = branchRepository.findByIsActiveTrue();
                if (branches.isEmpty()) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available."));
                }
                branch = branches.get(0);
            }
        }

        AcademicYear ay = AcademicYear.builder()
                .branch(branch)
                .name(name)
                .startDate(LocalDate.parse(startDateStr))
                .endDate(LocalDate.parse(endDateStr))
                .isCurrent(isCurrent)
                .build();

        academicYearRepository.save(ay);
        return ResponseEntity.ok(ApiResponse.success("Academic year created", ay));
    }
}
