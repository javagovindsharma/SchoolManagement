package com.sms.school.api.repository;

import com.sms.school.common.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmployeeId(String employeeId);

    Optional<Staff> findByUserId(Long userId);

    Page<Staff> findByBranchId(Long branchId, Pageable pageable);

    Page<Staff> findByBranchIdAndStaffType(Long branchId, Staff.StaffType staffType, Pageable pageable);

    @Query("SELECT s FROM Staff s WHERE s.branch.id = :branchId AND " +
           "(LOWER(s.user.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.user.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.employeeId) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Staff> searchByBranch(Long branchId, String search, Pageable pageable);

    long countByBranchIdAndIsActiveTrue(Long branchId);

    boolean existsByEmployeeId(String employeeId);
}
