package com.sms.school.api.repository;

import com.sms.school.common.entity.StudentQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentQuizAttemptRepository extends JpaRepository<StudentQuizAttempt, Long> {
    List<StudentQuizAttempt> findByStudentId(Long studentId);
    Optional<StudentQuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);
}
