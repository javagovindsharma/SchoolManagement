package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "admission_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "application_number", unique = true, nullable = false, length = 50)
    private String applicationNumber;

    @Column(name = "student_name", nullable = false, length = 200)
    private String studentName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Student.Gender gender;

    @Column(name = "applying_for_class", nullable = false, length = 50)
    private String applyingForClass;

    @Column(length = 50)
    private String nationality;

    @Column(length = 50)
    private String religion;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(name = "father_name", length = 200)
    private String fatherName;

    @Column(name = "father_phone", length = 20)
    private String fatherPhone;

    @Column(name = "father_email", length = 200)
    private String fatherEmail;

    @Column(name = "mother_name", length = 200)
    private String motherName;

    @Column(name = "mother_phone", length = 20)
    private String motherPhone;

    @Column(name = "previous_school", length = 300)
    private String previousSchool;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "application_fee_paid")
    @Builder.Default
    private Boolean applicationFeePaid = false;

    @Column(name = "payment_transaction_id", length = 100)
    private String paymentTransactionId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "entrance_test_marks", precision = 6, scale = 2)
    private BigDecimal entranceTestMarks;

    @Column(name = "interview_remarks", columnDefinition = "TEXT")
    private String interviewRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public enum ApplicationStatus {
        SUBMITTED, UNDER_REVIEW, SHORTLISTED, TEST_SCHEDULED,
        INTERVIEW_SCHEDULED, SELECTED, WAITLISTED, REJECTED, ENROLLED, CANCELLED
    }
}
