package com.sms.school.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {

        return "School Management API Running";
    }

    @GetMapping("/health")
    public String health() {

        return "UP";
    }
}