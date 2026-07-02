package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String subject;
    private String description;
    private Integer durationMinutes;
    private Long createdBy; // teacher id
    private LocalDateTime createdAt = LocalDateTime.now();
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("quiz")
    private List<Question> questions;
    @ElementCollection
    @CollectionTable(name = "quiz_assigned_students", joinColumns = @JoinColumn(name = "quiz_id"))
    @Column(name = "student_id")
    private List<Long> assignedStudentIds;
}
