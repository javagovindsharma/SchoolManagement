package com.sms.school.api.repository;

import com.sms.school.common.entity.FeePayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {

    List<FeePayment> findByStudentId(Long studentId);

    Page<FeePayment> findByBranchId(Long branchId, Pageable pageable);

    List<FeePayment> findByBranchIdAndPaymentDateBetween(Long branchId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(fp.amountPaid), 0) FROM FeePayment fp WHERE fp.branch.id = :branchId AND fp.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal totalCollectionByBranch(Long branchId, LocalDate startDate, LocalDate endDate);
}
