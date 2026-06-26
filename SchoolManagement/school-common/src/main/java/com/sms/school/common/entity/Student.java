package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String admissionNo;

    private String fullName;

    private String email;

    private String phone;

    private String gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String parentName;

    private String parentContact;

    private String status;

    private Integer academicYear;

    private LocalDate dateOfBirth;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}