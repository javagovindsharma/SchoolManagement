package com.sms.school.dto;

import com.sms.school.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseWithStudentDto {

    private boolean success;
    private String message;
    private Student data;
}