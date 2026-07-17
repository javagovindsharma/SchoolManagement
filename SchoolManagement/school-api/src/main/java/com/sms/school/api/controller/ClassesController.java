package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.SchoolClass;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassesController {

    private final EntityManager entityManager;
    private final BranchRepository branchRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<SchoolClass>>> getAll(@AuthenticationPrincipal User user) {
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;

        List<SchoolClass> classes;
        if (branchId != null) {
            classes = entityManager.createQuery(
                "SELECT c FROM SchoolClass c WHERE c.branch.id = :branchId AND c.isActive = true ORDER BY c.displayOrder, c.name",
                SchoolClass.class
            ).setParameter("branchId", branchId).getResultList();
        } else {
            classes = entityManager.createQuery(
                "SELECT c FROM SchoolClass c WHERE c.isActive = true ORDER BY c.displayOrder, c.name",
                SchoolClass.class
            ).getResultList();
        }

        return ResponseEntity.ok(ApiResponse.success(classes));
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<SchoolClass>> getById(@PathVariable Long id) {
        SchoolClass cls = entityManager.find(SchoolClass.class, id);
        if (cls == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ApiResponse.success(cls));
    }

    @GetMapping("/count")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Long>> getCount(@AuthenticationPrincipal User user) {
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        Long count;
        if (branchId != null) {
            count = entityManager.createQuery(
                "SELECT COUNT(c) FROM SchoolClass c WHERE c.branch.id = :branchId AND c.isActive = true", Long.class
            ).setParameter("branchId", branchId).getSingleResult();
        } else {
            count = entityManager.createQuery(
                "SELECT COUNT(c) FROM SchoolClass c WHERE c.isActive = true", Long.class
            ).getSingleResult();
        }
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<SchoolClass>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String name = (String) dto.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Class name is required"));
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

        Integer numericName = dto.get("numericName") != null ? Integer.valueOf(dto.get("numericName").toString()) : null;
        String description = (String) dto.get("description");
        String section = (String) dto.getOrDefault("section", "A");
        Integer displayOrder = dto.get("displayOrder") != null ? Integer.valueOf(dto.get("displayOrder").toString()) : numericName;

        SchoolClass cls = SchoolClass.builder()
                .branch(branch)
                .name(name)
                .className(name)
                .section(section)
                .numericName(numericName)
                .description(description)
                .displayOrder(displayOrder)
                .isActive(true)
                .build();

        entityManager.persist(cls);
        return ResponseEntity.ok(ApiResponse.success("Class created", cls));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<SchoolClass>> update(@PathVariable Long id, @RequestBody Map<String, Object> dto) {
        SchoolClass cls = entityManager.find(SchoolClass.class, id);
        if (cls == null) return ResponseEntity.notFound().build();

        if (dto.containsKey("name")) cls.setName((String) dto.get("name"));
        if (dto.containsKey("numericName")) cls.setNumericName(Integer.valueOf(dto.get("numericName").toString()));
        if (dto.containsKey("description")) cls.setDescription((String) dto.get("description"));

        entityManager.merge(cls);
        return ResponseEntity.ok(ApiResponse.success("Class updated", cls));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN')")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        SchoolClass cls = entityManager.find(SchoolClass.class, id);
        if (cls == null) return ResponseEntity.notFound().build();

        cls.setIsActive(false);
        entityManager.merge(cls);
        return ResponseEntity.ok(ApiResponse.success("Class deleted", null));
    }
}
