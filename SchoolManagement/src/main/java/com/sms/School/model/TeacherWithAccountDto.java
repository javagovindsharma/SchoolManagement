package com.sms.school.model;

import lombok.Data;

@Data
public class TeacherWithAccountDto {

    private String name;
    private String email;
    private String mobile;
    private String subject;
    private String phone;
    private String gender;
    private String address;
    private String status;
    // login account
    private String password;
}