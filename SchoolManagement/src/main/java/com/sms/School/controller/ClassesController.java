package com.sms.school.controller;


import com.sms.school.dto.ResponseDto;
import com.sms.school.dto.ResponseObjectDto;
import com.sms.school.entity.ClassEntity;
import com.sms.school.repository.ClassRepository;
import com.sms.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassesController {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {

            List<ClassEntity> classes = classRepository
                    .findAllByOrderByClassNameAscSectionAsc();

            List<Map<String, Object>> result = new ArrayList<>();

            for (ClassEntity c : classes) {

                Map<String, Object> data = new HashMap<>();

                data.put("id", c.getId());
                data.put("className", c.getClassName());
                data.put("section", c.getSection());
                data.put("displayName",
                        c.getClassName() + " " + c.getSection());

                data.put("teacherId",
                        c.getTeacher() != null ?
                                c.getTeacher().getId() : null);

                data.put("teacherName",
                        c.getTeacher() != null ?
                                c.getTeacher().getName() : null);

                Long studentCount =
                        studentRepository.countByIdAndStatus(
                                c.getId(), "Active");

                data.put("studentCount", studentCount);

                result.add(data);
            }

            return ResponseEntity.ok(result);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {

        Optional<ClassEntity> optionalClass =
                classRepository.findById(id);

        if (optionalClass.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto(false,
                            "Not found"));
        }

        ClassEntity c = optionalClass.get();

        Map<String, Object> data = new HashMap<>();
        data.put("id", c.getId());
        data.put("className", c.getClassName());
        data.put("section", c.getSection());
        data.put("displayName",
                c.getClassName() + " " + c.getSection());

        data.put("teacherId",
                c.getTeacher() != null ?
                        c.getTeacher().getId() : null);

        data.put("teacherName",
                c.getTeacher() != null ?
                        c.getTeacher().getName() : null);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount() {
        try {
            return ResponseEntity.ok(classRepository.count());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody ClassEntity dto) {

        try {

            ClassEntity cls = new ClassEntity();

            cls.setClassName(dto.getClassName());
            cls.setSection(dto.getSection());

            if (dto.getTeacherId() != null) {
                cls.setTeacherId(dto.getTeacherId());
            }

            classRepository.save(cls);

            return ResponseEntity.ok(
                    new ResponseObjectDto(true,
                            "Created",
                            cls));

        } catch (Exception ex) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody ClassEntity dto) {

        Optional<ClassEntity> optionalClass =
                classRepository.findById(id);

        if (optionalClass.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto(false, "Not found"));
        }

        ClassEntity cls = optionalClass.get();

        cls.setClassName(dto.getClassName());
        cls.setSection(dto.getSection());
        cls.setTeacherId(dto.getTeacherId());

        classRepository.save(cls);

        return ResponseEntity.ok(
                new ResponseDto(true,"Updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        Optional<ClassEntity> optionalClass =
                classRepository.findById(id);

        if (optionalClass.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto(false,"Not found"));
        }

        classRepository.delete(optionalClass.get());

        return ResponseEntity.ok(  new ResponseDto(true,"Deleted"));
    }
}