package com.sms.school.controller;

import com.sms.school.entity.Role;
import com.sms.school.entity.Teacher;
import com.sms.school.entity.User;
import com.sms.school.model.TeacherUpdateDto;
import com.sms.school.model.TeacherWithAccountDto;
import com.sms.school.repository.TeacherRepository;
import com.sms.school.repository.UserRepository;
import com.sms.school.dto.ResponseDto;
import com.sms.school.dto.ResponseObjectDto;
import com.sms.school.dto.ResponseWithMapDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeachersController {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // GET /api/teachers
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String search,@RequestParam(required = false) String status,@RequestParam(required = false) String subject) {

        List<Teacher> teachers = teacherRepository.findAll();

        if (search != null && !search.isBlank()) {
            String keyword = search.toLowerCase();

            teachers = teachers.stream()
                    .filter(t ->
                            t.getName().toLowerCase().contains(keyword)
                                    || t.getEmail().toLowerCase().contains(keyword)
                                    || (t.getSubject() != null &&
                                    t.getSubject().toLowerCase().contains(keyword)))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.isBlank() && !status.equals("All")) {
            teachers = teachers.stream()
                    .filter(t -> status.equals(t.getStatus()))
                    .collect(Collectors.toList());
        }

        if (subject != null && !subject.isBlank()) {
            teachers = teachers.stream()
                    .filter(t -> subject.equals(t.getSubject()))
                    .collect(Collectors.toList());
        }

        teachers.sort(Comparator.comparing(Teacher::getName));

        return ResponseEntity.ok(teachers);
    }

    // GET /api/teachers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {

        return teacherRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/teachers/count
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(teacherRepository.count());
    }

    // GET /api/teachers/subjects
    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects() {

        List<String> subjects = teacherRepository.findAll()
                .stream()
                .map(Teacher::getSubject)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return ResponseEntity.ok(subjects);
    }

    // POST /api/teachers/with-account
    @PostMapping("/with-account")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createWithAccount(
            @RequestBody TeacherWithAccountDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(
                    new ResponseDto(false, "Email already exists")
            );
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.TEACHER);

        userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setName(dto.getName());
        teacher.setEmail(dto.getEmail());
        teacher.setMobile(dto.getPhone());
        teacher.setGender(dto.getGender());
        teacher.setSubject(dto.getSubject());
        teacher.setAddress(dto.getAddress());
        teacher.setStatus(dto.getStatus());
        teacher.setUser(user);

        teacherRepository.save(teacher);

        Map<String, Object> data = new HashMap<>();
        data.put("id", teacher.getId());
        data.put("fullName", teacher.getName());
        data.put("email", teacher.getEmail());
        data.put("userId", user.getId());

        return ResponseEntity.ok(
                new ResponseWithMapDto(
                        true,
                        "Teacher account created successfully",
                        data
                )
        );
    }

    // PUT /api/teachers/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody TeacherUpdateDto dto) {

        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);

        if (optionalTeacher.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Teacher teacher = optionalTeacher.get();

        teacher.setName(dto.getName());
        teacher.setEmail(dto.getEmail());
        teacher.setMobile(dto.getMobile());
        teacher.setGender(dto.getGender());
        teacher.setSubject(dto.getSubject());
        teacher.setAddress(dto.getAddress());
        teacher.setStatus(dto.getStatus());

        if (teacher.getUser() != null) {

            userRepository.findById(teacher.getUser().getId())
                    .ifPresent(user -> {
                        user.setName(dto.getName());
                        user.setEmail(dto.getEmail());
                        userRepository.save(user);
                    });
        }

        teacherRepository.save(teacher);

        return ResponseEntity.ok(
                new ResponseObjectDto(true, "Updated", teacher)
        );
    }

    // DELETE /api/teachers/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);

        if (optionalTeacher.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Teacher teacher = optionalTeacher.get();

        if (teacher.getUser() != null) {
            userRepository.findById(teacher.getUser().getId())
                    .ifPresent(userRepository::delete);
        }

        teacherRepository.delete(teacher);

        return ResponseEntity.ok(
                new ResponseDto(true, "Deleted")
        );
    }
}