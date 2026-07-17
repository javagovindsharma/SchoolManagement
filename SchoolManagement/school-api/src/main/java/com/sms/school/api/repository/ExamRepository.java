package com.sms.school.api.repository;

import com.sms.school.common.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByBranchIdAndAcademicYearId(Long branchId, Long academicYearId);

    List<Exam> findByBranchIdOrderByStartDateDesc(Long branchId);
}
