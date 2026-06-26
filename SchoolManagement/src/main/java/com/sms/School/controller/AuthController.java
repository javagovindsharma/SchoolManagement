package com.sms.school.controller;

import com.sms.school.dto.*;
import com.sms.school.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(
            AuthService service) {

        this.service = service;
    }

    @PostMapping("/register")
    public String register(
            @RequestBody
            RegisterRequest request) {

        return service.register(
                request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody
            LoginRequest request) {

        return service.login(request);
    }
}