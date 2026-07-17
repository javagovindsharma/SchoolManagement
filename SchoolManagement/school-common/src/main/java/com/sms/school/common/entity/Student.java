package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "role", "branch"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(name = "admission_no", unique = true, nullable = false, length = 50)
    private String admissionNo;

    @Column(name = "roll_number", length = 20)
    private String rollNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(length = 50)
    private String nationality;

    @Column(length = 50)
    private String religion;

    @Column(length = 50)
    private String caste;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name = "aadhar_number", length = 20)
    private String aadharNumber;

    @Column(name = "mother_tongue", length = 50)
    private String motherTongue;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "previous_school", length = 300)
    private String previousSchool;

    @Column(name = "previous_class", length = 50)
    private String previousClass;

    @Column(name = "tc_number", length = 50)
    private String tcNumber;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "admission_type")
    private AdmissionType admissionType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StudentStatus status = StudentStatus.ACTIVE;

    @Column(length = 50)
    private String house;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public String getFullName() {
        return firstName + (lastName != null ? " " + lastName : "");
    }

    public enum Gender { MALE, FEMALE, OTHER }
    public enum Category { GENERAL, OBC, SC, ST, EWS }
    public enum AdmissionType { NEW, TRANSFER, RE_ADMISSION }
    public enum StudentStatus { ACTIVE, INACTIVE, GRADUATED, TRANSFERRED, EXPELLED, DROPOUT }
}
