package com.sms.school.api.repository;

import com.sms.school.common.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findFirstByBranchIdAndIsCurrentTrue(Long branchId);

    Optional<AcademicYear> findFirstByIsCurrentTrue();
}
