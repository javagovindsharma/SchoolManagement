package com.sms.school.dto;

import com.sms.school.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@Data
public class AuthResponse {
    private String token;
    private User user;
}