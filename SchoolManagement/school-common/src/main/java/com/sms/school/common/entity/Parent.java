package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "father_name", length = 200)
    private String fatherName;

    @Column(name = "father_phone", length = 20)
    private String fatherPhone;

    @Column(name = "father_email", length = 200)
    private String fatherEmail;

    @Column(name = "father_occupation", length = 200)
    private String fatherOccupation;

    @Column(name = "father_qualification", length = 200)
    private String fatherQualification;

    @Column(name = "father_aadhar", length = 20)
    private String fatherAadhar;

    @Column(name = "father_photo_url", length = 500)
    private String fatherPhotoUrl;

    @Column(name = "mother_name", length = 200)
    private String motherName;

    @Column(name = "mother_phone", length = 20)
    private String motherPhone;

    @Column(name = "mother_email", length = 200)
    private String motherEmail;

    @Column(name = "mother_occupation", length = 200)
    private String motherOccupation;

    @Column(name = "mother_qualification", length = 200)
    private String motherQualification;

    @Column(name = "mother_aadhar", length = 20)
    private String motherAadhar;

    @Column(name = "mother_photo_url", length = 500)
    private String motherPhotoUrl;

    @Column(name = "guardian_name", length = 200)
    private String guardianName;

    @Column(name = "guardian_relation", length = 50)
    private String guardianRelation;

    @Column(name = "guardian_phone", length = 20)
    private String guardianPhone;

    @Column(name = "guardian_email", length = 200)
    private String guardianEmail;

    @Column(name = "guardian_occupation", length = 200)
    private String guardianOccupation;

    @Column(name = "guardian_address", columnDefinition = "TEXT")
    private String guardianAddress;

    @Column(name = "annual_income", precision = 12, scale = 2)
    private BigDecimal annualIncome;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
