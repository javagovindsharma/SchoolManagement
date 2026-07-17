package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_type", nullable = false)
    private AchievementType achievementType;

    @Column(length = 100)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "student_name", length = 200)
    private String studentName;

    @Column(name = "class_name", length = 50)
    private String className;

    @Column(name = "competition_name", length = 300)
    private String competitionName;

    @Column(length = 50)
    private String position;

    @Enumerated(EnumType.STRING)
    private Medal medal;

    @Column(name = "awarded_by", length = 200)
    private String awardedBy;

    @Column(name = "achievement_date")
    private LocalDate achievementDate;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    public enum AchievementType {
        ACADEMIC, SPORTS, OLYMPIAD, COMPETITIVE_EXAM, CULTURAL, AWARD, CERTIFICATION, FACULTY
    }

    public enum Medal { GOLD, SILVER, BRONZE, MERIT, PARTICIPATION }
}
