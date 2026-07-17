package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.SubjectRepository;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.Subject;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final BranchRepository branchRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Subject>>> getAll(@AuthenticationPrincipal User user) {
        try {
            Long branchId = (user != null && user.getBranch() != null) ? user.getBranch().getId() : null;
            List<Subject> subjects;
            if (branchId != null) {
                subjects = subjectRepository.findByBranchIdAndIsActiveTrue(branchId);
            } else {
                subjects = subjectRepository.findByIsActiveTrue();
            }
            return ResponseEntity.ok(ApiResponse.success(subjects));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.success(subjectRepository.findAll()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Subject>> getById(@PathVariable Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return ResponseEntity.ok(ApiResponse.success(subject));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Subject>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String name = (String) dto.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Subject name is required"));
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
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available. Create a branch first."));
                }
                branch = branches.get(0);
            }
        }

        String code = (String) dto.get("code");
        String subjectType = (String) dto.getOrDefault("subjectType", "THEORY");
        String category = (String) dto.getOrDefault("category", "CORE");
        Integer maxMarksTheory = dto.get("maxMarksTheory") != null ? Integer.valueOf(dto.get("maxMarksTheory").toString()) : 100;
        Integer passingMarks = dto.get("passingMarks") != null ? Integer.valueOf(dto.get("passingMarks").toString()) : 33;

        Subject subject = Subject.builder()
                .branch(branch)
                .name(name)
                .code(code)
                .subjectType(Subject.SubjectType.valueOf(subjectType))
                .category(Subject.SubjectCategory.valueOf(category))
                .maxMarksTheory(maxMarksTheory)
                .passingMarks(passingMarks)
                .isActive(true)
                .build();

        subjectRepository.save(subject);
        return ResponseEntity.ok(ApiResponse.success("Subject created", subject));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Subject>> update(@PathVariable Long id, @RequestBody Map<String, Object> dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (dto.containsKey("name")) subject.setName((String) dto.get("name"));
        if (dto.containsKey("code")) subject.setCode((String) dto.get("code"));
        if (dto.containsKey("subjectType")) subject.setSubjectType(Subject.SubjectType.valueOf((String) dto.get("subjectType")));
        if (dto.containsKey("category")) subject.setCategory(Subject.SubjectCategory.valueOf((String) dto.get("category")));
        if (dto.containsKey("maxMarksTheory")) subject.setMaxMarksTheory(Integer.valueOf(dto.get("maxMarksTheory").toString()));
        if (dto.containsKey("passingMarks")) subject.setPassingMarks(Integer.valueOf(dto.get("passingMarks").toString()));

        subjectRepository.save(subject);
        return ResponseEntity.ok(ApiResponse.success("Subject updated", subject));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subject.setIsActive(false);
        subjectRepository.save(subject);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted", null));
    }
}
