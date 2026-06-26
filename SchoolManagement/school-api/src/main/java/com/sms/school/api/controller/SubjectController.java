package com.sms.school.api.controller;

import com.sms.school.common.dto.ResponseDto;
import com.sms.school.common.dto.ResponseObjectDto;
import com.sms.school.common.entity.Subject;
import com.sms.school.api.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {

            List<Map<String, Object>> subjects = subjectRepository.findAll()
                    .stream()
                    .map(s -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", s.getId());
                        map.put("subjectName", s.getSubjectName());
                        map.put("subjectCode", s.getSubjectCode());
                        map.put("type", s.getType());
                        map.put("teacherId",
                                s.getTeacher() != null ? s.getTeacher().getId() : null);
                        map.put("teacherName",
                                s.getTeacher() != null ? s.getTeacher().getName() : "");
                        return map;
                    })
                    .toList();

            return ResponseEntity.ok(subjects);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody Subject subject) {
        try {

            Subject saved = subjectRepository.save(subject);

            return ResponseEntity.ok(
                    new ResponseObjectDto(true, "Subject added", saved)
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {

            Subject subject = subjectRepository.findById(id).orElse(null);

            if (subject == null) {
                return ResponseEntity.notFound().build();
            }

            subjectRepository.delete(subject);

            return ResponseEntity.ok(
                    new ResponseDto(true, "Deleted")
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }
}