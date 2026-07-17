package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.*;
import com.sms.school.common.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Year;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<Student>>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long classId) {

        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        var pageable = PageRequest.of(page, size, Sort.by("firstName").ascending());

        Page<Student> students;
        if (search != null && !search.isBlank() && branchId != null) {
            students = studentRepository.searchByBranch(branchId, search, pageable);
        } else if (branchId != null) {
            students = studentRepository.findByBranchId(branchId, pageable);
        } else {
            students = studentRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> count(@AuthenticationPrincipal User user) {
        Long branchId = user.getBranch() != null ? user.getBranch().getId() : null;
        long count = branchId != null ? studentRepository.countByBranchIdAndIsActiveTrue(branchId) : studentRepository.count();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String email = (String) dto.get("email");
        String firstName = (String) dto.get("firstName");
        String lastName = (String) dto.get("lastName");
        String phone = (String) dto.get("phone");
        String gender = (String) dto.getOrDefault("gender", "MALE");
        String dateOfBirthStr = (String) dto.get("dateOfBirth");
        String address = (String) dto.get("address");
        String city = (String) dto.get("city");
        String state = (String) dto.get("state");
        String pincode = (String) dto.get("pincode");

        // Validations
        if (firstName == null || firstName.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("First name is required"));
        }
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already exists"));
        }

        // Phone validation (10 digits)
        if (phone != null && !phone.isBlank()) {
            String cleanPhone = phone.replaceAll("[^0-9]", "");
            if (cleanPhone.length() < 10 || cleanPhone.length() > 13) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Phone number must be 10-13 digits"));
            }
        }

        // DOB validation (minimum 3 years old)
        LocalDate dob = null;
        if (dateOfBirthStr != null && !dateOfBirthStr.isBlank()) {
            dob = LocalDate.parse(dateOfBirthStr);
            LocalDate minDate = LocalDate.now().minusYears(3);
            if (dob.isAfter(minDate)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Student must be at least 3 years old"));
            }
        }

        // Determine branch - use user's branch or accept from request
        Branch branch = currentUser.getBranch();
        if (branch == null) {
            // Super Admin or Org Admin without branch - must provide branchId
            Object branchIdObj = dto.get("branchId");
            if (branchIdObj != null) {
                Long branchId = Long.valueOf(branchIdObj.toString());
                branch = branchRepository.findById(branchId)
                        .orElseThrow(() -> new RuntimeException("Branch not found"));
            } else {
                // Default to first active branch
                var branches = branchRepository.findByIsActiveTrue();
                if (branches.isEmpty()) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available. Please create a branch first."));
                }
                branch = branches.get(0);
            }
        }

        // Create user account
        var role = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("STUDENT role not found"));

        String username = email.split("@")[0];
        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode("Student@123"))
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .role(role)
                .branch(branch)
                .isActive(true)
                .build();
        userRepository.save(user);

        // Generate admission number
        String admissionNo = "ADM" + Year.now().getValue() + String.format("%05d", studentRepository.count() + 1);

        // Create student record
        Student student = Student.builder()
                .user(user)
                .branch(branch)
                .admissionNo(admissionNo)
                .firstName(firstName)
                .lastName(lastName)
                .gender(Student.Gender.valueOf(gender))
                .dateOfBirth(dob)
                .address(address)
                .city(city)
                .state(state)
                .pincode(pincode)
                .admissionDate(LocalDate.now())
                .admissionType(Student.AdmissionType.NEW)
                .status(Student.StudentStatus.ACTIVE)
                .isActive(true)
                .build();
        studentRepository.save(student);

        Map<String, Object> data = new HashMap<>();
        data.put("id", student.getId());
        data.put("admissionNo", student.getAdmissionNo());
        data.put("name", firstName + (lastName != null ? " " + lastName : ""));
        data.put("email", email);
        data.put("userId", user.getId());

        return ResponseEntity.ok(ApiResponse.success("Student added successfully", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Student>> update(@PathVariable Long id, @RequestBody Map<String, Object> dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (dto.containsKey("firstName")) student.setFirstName((String) dto.get("firstName"));
        if (dto.containsKey("lastName")) student.setLastName((String) dto.get("lastName"));
        if (dto.containsKey("address")) student.setAddress((String) dto.get("address"));
        if (dto.containsKey("city")) student.setCity((String) dto.get("city"));
        if (dto.containsKey("state")) student.setState((String) dto.get("state"));
        if (dto.containsKey("pincode")) student.setPincode((String) dto.get("pincode"));

        // Update linked user info
        if (student.getUser() != null) {
            User user = student.getUser();
            if (dto.containsKey("firstName")) user.setFirstName((String) dto.get("firstName"));
            if (dto.containsKey("lastName")) user.setLastName((String) dto.get("lastName"));
            if (dto.containsKey("phone")) user.setPhone((String) dto.get("phone"));
            userRepository.save(user);
        }

        studentRepository.save(student);
        return ResponseEntity.ok(ApiResponse.success("Student updated", student));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setIsActive(false);
        student.setStatus(Student.StudentStatus.INACTIVE);
        studentRepository.save(student);

        if (student.getUser() != null) {
            student.getUser().setIsActive(false);
            userRepository.save(student.getUser());
        }

        return ResponseEntity.ok(ApiResponse.success("Student deactivated", null));
    }
}
