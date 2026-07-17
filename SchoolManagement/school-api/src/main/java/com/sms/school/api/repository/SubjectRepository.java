package com.sms.school.api.repository;

import com.sms.school.common.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByBranchIdAndIsActiveTrue(Long branchId);

    List<Subject> findByIsActiveTrue();

    List<Subject> findByBranchIdAndCategoryAndIsActiveTrue(Long branchId, Subject.SubjectCategory category);
}
