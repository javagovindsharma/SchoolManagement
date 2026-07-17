package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type")
    @Builder.Default
    private SubjectType subjectType = SubjectType.THEORY;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubjectCategory category = SubjectCategory.CORE;

    @Column(name = "max_marks_theory")
    @Builder.Default
    private Integer maxMarksTheory = 100;

    @Column(name = "max_marks_practical")
    @Builder.Default
    private Integer maxMarksPractical = 0;

    @Column(name = "passing_marks")
    @Builder.Default
    private Integer passingMarks = 33;

    @Column(name = "credit_hours")
    @Builder.Default
    private Integer creditHours = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public enum SubjectType { THEORY, PRACTICAL, BOTH }
    public enum SubjectCategory { CORE, ELECTIVE, OPTIONAL, EXTRA_CURRICULAR }
}
