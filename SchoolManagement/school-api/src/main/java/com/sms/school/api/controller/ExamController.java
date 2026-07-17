package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.AcademicYearRepository;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.ExamRepository;
import com.sms.school.common.entity.*;
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
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamRepository examRepository;
    private final BranchRepository branchRepository;
    private final AcademicYearRepository academicYearRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Exam>>> getAll(@AuthenticationPrincipal User user) {
        Long branchId = (user != null && user.getBranch() != null) ? user.getBranch().getId() : null;
        List<Exam> exams;
        if (branchId != null) {
            exams = examRepository.findByBranchIdOrderByStartDateDesc(branchId);
        } else {
            exams = examRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.success(exams));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<Exam>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String name = (String) dto.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Exam name is required"));
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

        // Resolve academic year
        AcademicYear academicYear = academicYearRepository.findFirstByBranchIdAndIsCurrentTrue(branch.getId()).orElse(null);
        if (academicYear == null) {
            academicYear = academicYearRepository.findFirstByIsCurrentTrue().orElse(null);
        }
        if (academicYear == null) {
            // Auto-create one
            int currentYear = LocalDate.now().getYear();
            academicYear = AcademicYear.builder()
                    .branch(branch)
                    .name(currentYear + "-" + (currentYear + 1))
                    .startDate(LocalDate.of(currentYear, 4, 1))
                    .endDate(LocalDate.of(currentYear + 1, 3, 31))
                    .isCurrent(true)
                    .build();
            academicYearRepository.save(academicYear);
        }

        String description = (String) dto.get("description");
        String startDateStr = (String) dto.get("startDate");
        String endDateStr = (String) dto.get("endDate");

        Exam exam = Exam.builder()
                .branch(branch)
                .academicYear(academicYear)
                .name(name)
                .description(description)
                .startDate(startDateStr != null ? LocalDate.parse(startDateStr) : null)
                .endDate(endDateStr != null ? LocalDate.parse(endDateStr) : null)
                .status(Exam.ExamStatus.SCHEDULED)
                .createdBy(currentUser)
                .build();

        examRepository.save(exam);
        return ResponseEntity.ok(ApiResponse.success("Exam created", exam));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<Exam>> update(@PathVariable Long id, @RequestBody Map<String, Object> dto) {
        var existing = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        if (dto.containsKey("name")) existing.setName((String) dto.get("name"));
        if (dto.containsKey("description")) existing.setDescription((String) dto.get("description"));
        if (dto.containsKey("startDate")) existing.setStartDate(LocalDate.parse((String) dto.get("startDate")));
        if (dto.containsKey("endDate")) existing.setEndDate(LocalDate.parse((String) dto.get("endDate")));
        if (dto.containsKey("status")) existing.setStatus(Exam.ExamStatus.valueOf((String) dto.get("status")));
        examRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Exam updated", existing));
    }
}
