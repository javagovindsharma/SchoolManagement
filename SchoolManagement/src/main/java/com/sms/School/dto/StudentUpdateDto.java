package com.sms.school.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentUpdateDto {

    private String fullName;
    private String email;
    private String phone;
    private Integer classId;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String parentName;
    private String parentContact;
    private String status;
    private Integer academicYear;
}