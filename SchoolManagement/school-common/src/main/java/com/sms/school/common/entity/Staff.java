package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff extends BaseEntity {

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "role", "branch"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(length = 500)
    private String qualification;

    @Column(length = 200)
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Student.Gender gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status")
    private MaritalStatus maritalStatus;

    @Column(name = "father_name", length = 200)
    private String fatherName;

    @Column(name = "mother_name", length = 200)
    private String motherName;

    @Column(name = "spouse_name", length = 200)
    private String spouseName;

    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "current_address", columnDefinition = "TEXT")
    private String currentAddress;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;

    @Column(name = "emergency_person", length = 200)
    private String emergencyPerson;

    @Column(name = "aadhar_number", length = 20)
    private String aadharNumber;

    @Column(name = "pan_number", length = 20)
    private String panNumber;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "bank_account_no", length = 50)
    private String bankAccountNo;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "salary_grade", length = 50)
    private String salaryGrade;

    @Column(name = "basic_salary", precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "staff_type")
    @Builder.Default
    private StaffType staffType = StaffType.TEACHING;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type")
    @Builder.Default
    private ContractType contractType = ContractType.PERMANENT;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "is_class_teacher")
    @Builder.Default
    private Boolean isClassTeacher = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public enum MaritalStatus { SINGLE, MARRIED, DIVORCED, WIDOWED }
    public enum StaffType { TEACHING, NON_TEACHING, ADMIN, MANAGEMENT }
    public enum ContractType { PERMANENT, CONTRACTUAL, PROBATION, VISITING }
}
