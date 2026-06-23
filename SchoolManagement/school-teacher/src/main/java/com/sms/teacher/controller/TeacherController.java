package com.sms.teacher.controller;

import com.sms.teacher.entity.Teacher;
import com.sms.teacher.service.TeacherService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService service;

    public TeacherController(
            TeacherService service) {
        this.service = service;
    }

    @PostMapping
    public Teacher create(
            @RequestBody Teacher dto) {

        return service.save(dto);
    }

    @GetMapping
    public List<Teacher> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Teacher getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        service.delete(id);

        return "Teacher Deleted";
    }
}
