package com.sms.school.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherUpdateDto {

    private String name;
    private String email;
    private String mobile;
    private String subject;
    private String gender;
    private String address;
    private String status;
}