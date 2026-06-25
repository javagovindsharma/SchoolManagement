package com.sms.school.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentWithAccountDto {

    private String fullName;

    private String email;

    private String password;

    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

    private String address;

    private String parentName;

    private String parentContact;

    private Integer classId;

    private Integer academicYear;
}