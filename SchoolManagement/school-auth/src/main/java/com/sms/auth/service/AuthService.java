package com.sms.auth.service;

import com.sms.auth.dto.*;
import com.sms.auth.entity.User;
import com.sms.auth.repository.UserRepository;
import com.sms.auth.security.JwtService;
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

        String token =
                jwtService.generateToken(
                        user.getEmail());

        return new AuthResponse(token);
    }
}