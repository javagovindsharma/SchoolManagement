package com.sms.school.api.controller;

import com.sms.school.common.entity.Role;
import com.sms.school.common.entity.User;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.common.dto.ResponseDto;
import com.sms.school.common.dto.ResponseWithMapDto;
import com.sms.school.common.dto.StudentUpdateDto;
import com.sms.school.common.dto.StudentWithAccountDto;
import com.sms.school.common.dto.ResponseWithStudentDto;
import com.sms.school.common.entity.ClassEntity;
import com.sms.school.common.entity.Student;
import com.sms.school.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;


    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer classId,
            @RequestParam(required = false) Integer academicYear
    ) {

        List<Student> students = studentRepository.findAll();

        students = students.stream()
                .filter(s -> search == null || search.isBlank()
                        || s.getFullName().toLowerCase().contains(search.toLowerCase())
                        || s.getEmail().toLowerCase().contains(search.toLowerCase())
                        || s.getAdmissionNo().toLowerCase().contains(search.toLowerCase()))
                .filter(s -> status == null
                        || status.equals("All")
                        || status.equalsIgnoreCase(s.getStatus()))
                .filter(s -> classId == null
                        || (s.getClassEntity() != null
                        && Objects.equals(s.getClassEntity().getId(), classId)))
                .filter(s -> academicYear == null
                        || Objects.equals(s.getAcademicYear(), academicYear))
                .sorted(Comparator.comparing(Student::getFullName))
                .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(student);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(studentRepository.count());
    }

    @GetMapping("/academic-years")
    public ResponseEntity<?> getAcademicYears() {

        List<Integer> years = studentRepository.findAll()
                .stream()
                .map(Student::getAcademicYear)
                .filter(Objects::nonNull)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();

        return ResponseEntity.ok(years);
    }

    @PostMapping("/with-account")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createWithAccount(
            @RequestBody StudentWithAccountDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(
                    new ResponseDto(false, "Email already exists")
            );
        }

        User user = new User();
        user.setName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        Student student = new Student();
        student.setAdmissionNo(generateAdmissionNo());
        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setGender(dto.getGender());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setAddress(dto.getAddress());
        student.setParentName(dto.getParentName());
        student.setParentContact(dto.getParentContact());
        student.setAcademicYear(dto.getAcademicYear());
        student.setStatus("Active");
        student.setUser(user);

        ClassEntity classEntity = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        student.setClassEntity(classEntity);

        studentRepository.save(student);

        Map<String, Object> data = new HashMap<>();
        data.put("id", student.getId());
        data.put("admissionNo", student.getAdmissionNo());
        data.put("fullName", student.getFullName());
        data.put("email", student.getEmail());
        data.put("userId", user.getId());

        return ResponseEntity.ok(
                new ResponseWithMapDto(true,
                        "Student account created successfully",
                        data)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody StudentUpdateDto dto) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setGender(dto.getGender());
        student.setAddress(dto.getAddress());
        student.setParentName(dto.getParentName());
        student.setParentContact(dto.getParentContact());
        student.setStatus(dto.getStatus());
        student.setAcademicYear(dto.getAcademicYear());

        if (dto.getClassId() != null) {
            ClassEntity cls = classRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));

            student.setClassEntity(cls);
        }

        if (student.getUser() != null) {
            User user = student.getUser();
            user.setName(dto.getFullName());
            user.setEmail(dto.getEmail());
            userRepository.save(user);
        }

        studentRepository.save(student);

        return ResponseEntity.ok(
                new ResponseWithStudentDto(true, "Updated", student)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        Student student = studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        User user = student.getUser();

        studentRepository.delete(student);

        if (user != null) {
            userRepository.delete(user);
        }

        return ResponseEntity.ok(
                new ResponseDto(true, "Deleted")
        );
    }

    private String generateAdmissionNo() {

        long nextId = studentRepository.count() + 1;

        return String.format(
                "ADM%d%04d",
                Year.now().getValue(),
                nextId
        );
    }
}