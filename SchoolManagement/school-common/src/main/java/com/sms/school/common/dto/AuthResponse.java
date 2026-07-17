package com.sms.school.common.dto;

import com.sms.school.common.entity.User;
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