package com.sms.school.api.repository;

import com.sms.school.common.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCreatedBy(Long teacherId);
    List<Quiz> findByAssignedStudentIdsContaining(Long studentId);
}
