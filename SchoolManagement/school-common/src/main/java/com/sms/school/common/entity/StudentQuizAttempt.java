package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Student_quiz_attempt")
@Getter
@Setter
public class StudentQuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long studentId;
    private Long quizId;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer score;
    private LocalDateTime submittedAt=LocalDateTime.now();
}
