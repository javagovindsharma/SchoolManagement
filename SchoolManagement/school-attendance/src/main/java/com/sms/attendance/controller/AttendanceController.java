package com.sms.attendance.controller;

import com.sms.attendance.entity.Attendance;
import com.sms.attendance.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(
            AttendanceService service) {
        this.service = service;
    }

    @PostMapping
    public Attendance create(@RequestBody Attendance dto) {

        return service.save(dto);
    }

    @GetMapping
    public List<Attendance> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Attendance getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        service.delete(id);

        return "Attendance Deleted";
    }
}