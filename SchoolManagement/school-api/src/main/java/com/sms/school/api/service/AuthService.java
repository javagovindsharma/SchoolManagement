package com.sms.school.api.service;

import com.sms.school.common.dto.*;
import com.sms.school.common.entity.User;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.api.config.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;
    private final JwtService jwtService;

    public AuthService(
            UserRepository repository,
            JwtService jwtService) {

        this.repository = repository;
        this.jwtService = jwtService;
    }

    public String register(
            RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                request.getPassword());

        user.setRole(request.getRole());

        repository.save(user);

        return "User Registered";
    }

    public AuthResponse login(
            LoginRequest request) {

        User user =
                repository.findByEmail(
                                request.getEmail())
                        .orElseThrow();

        if (!user.getPassword()
                .equals(
                        request.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password");
        }

        String token =jwtService.generateToken(user.getEmail());

        return new AuthResponse(token,user);
    }
}