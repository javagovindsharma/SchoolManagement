package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.AcademicYearRepository;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.FeePaymentRepository;
import com.sms.school.api.repository.FeeStructureRepository;
import com.sms.school.api.repository.StudentRepository;
import com.sms.school.common.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeePaymentRepository feePaymentRepository;
    private final BranchRepository branchRepository;
    private final StudentRepository studentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FeeStructureRepository feeStructureRepository;

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<Page<FeePayment>>> getPayments(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        Page<FeePayment> payments;
        if (branchId != null) {
            payments = feePaymentRepository.findByBranchId(branchId, pageable);
        } else {
            payments = feePaymentRepository.findAll(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'PARENT', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<FeePayment>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(feePaymentRepository.findByStudentId(studentId)));
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<FeePayment>> collectFee(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

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

        // Resolve student
        Student student = null;
        Object studentIdObj = dto.get("studentId");
        if (studentIdObj != null) {
            student = studentRepository.findById(Long.valueOf(studentIdObj.toString())).orElse(null);
        }

        // Generate receipt number
        String receiptNo = "RCP" + System.currentTimeMillis() % 100000000;

        // Get current academic year
        AcademicYear academicYear = null;
        if (branch != null) {
            academicYear = academicYearRepository.findFirstByBranchIdAndIsCurrentTrue(branch.getId()).orElse(null);
        }
        if (academicYear == null) {
            academicYear = academicYearRepository.findFirstByIsCurrentTrue().orElse(null);
        }
        // If no academic year exists, create one
        if (academicYear == null) {
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

        FeePayment payment = FeePayment.builder()
                .branch(branch)
                .student(student)
                .academicYear(academicYear)
                .amountPaid(new java.math.BigDecimal(dto.get("amountPaid").toString()))
                .totalAmount(new java.math.BigDecimal(dto.getOrDefault("totalAmount", dto.get("amountPaid")).toString()))
                .paymentMethod(FeePayment.PaymentMethod.valueOf((String) dto.getOrDefault("paymentMethod", "CASH")))
                .paymentDate(LocalDate.now())
                .paymentStatus(FeePayment.PaymentStatus.COMPLETED)
                .receiptNumber(receiptNo)
                .remarks((String) dto.get("remarks"))
                .collectedBy(currentUser)
                .build();

        feePaymentRepository.save(payment);
        return ResponseEntity.ok(ApiResponse.success("Fee collected successfully", payment));
    }

    private FeeStructure getOrCreateDefaultFeeStructure(Branch branch, AcademicYear academicYear) {
        return feeStructureRepository.findFirstByBranchId(branch.getId())
                .orElseGet(() -> {
                    FeeStructure fs = FeeStructure.builder()
                            .branch(branch)
                            .academicYear(academicYear)
                            .amount(java.math.BigDecimal.ZERO)
                            .isActive(true)
                            .build();
                    return feeStructureRepository.save(fs);
                });
    }
}
