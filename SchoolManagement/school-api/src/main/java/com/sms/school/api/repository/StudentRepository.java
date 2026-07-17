package com.sms.school.api.repository;

import com.sms.school.common.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByAdmissionNo(String admissionNo);

    Optional<Student> findByUserId(Long userId);

    Page<Student> findByBranchId(Long branchId, Pageable pageable);

    Page<Student> findByBranchIdAndSchoolClassId(Long branchId, Long classId, Pageable pageable);

    Page<Student> findByBranchIdAndSectionId(Long branchId, Long sectionId, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.branch.id = :branchId AND " +
           "(LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.admissionNo) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchByBranch(Long branchId, String search, Pageable pageable);

    long countByBranchIdAndIsActiveTrue(Long branchId);

    long countByBranchIdAndSchoolClassIdAndIsActiveTrue(Long branchId, Long classId);

    boolean existsByAdmissionNo(String admissionNo);
}
