package com.sms.school.api.repository;


import com.sms.school.common.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarkRepository extends JpaRepository<Mark, Long> {

    List<Mark> findByStudentId(Long studentId);

    Optional<Mark> findByStudentIdAndSubjectIdAndExamType(
            Long studentId,
            Long subjectId,
            String examType
    );
}