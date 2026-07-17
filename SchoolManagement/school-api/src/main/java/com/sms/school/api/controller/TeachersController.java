package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.dto.CreateUserRequest;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.RoleRepository;
import com.sms.school.api.repository.StaffRepository;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.api.service.AuthService;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.Staff;
import com.sms.school.common.entity.User;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeachersController {

    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Staff>>> getAll(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        var pageable = PageRequest.of(page, size, Sort.by("user.firstName").ascending());
        Long branchId = currentUser.getBranch() != null ? currentUser.getBranch().getId() : null;

        Page<Staff> teachers;
        if (search != null && !search.isBlank() && branchId != null) {
            teachers = staffRepository.searchByBranch(branchId, search, pageable);
        } else if (branchId != null) {
            teachers = staffRepository.findByBranchIdAndStaffType(branchId, Staff.StaffType.TEACHING, pageable);
        } else {
            teachers = staffRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(teachers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> getById(@PathVariable Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getCount(@AuthenticationPrincipal User currentUser) {
        Long branchId = currentUser.getBranch() != null ? currentUser.getBranch().getId() : null;
        long count = branchId != null ? staffRepository.countByBranchIdAndIsActiveTrue(branchId) : staffRepository.count();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String email = (String) dto.get("email");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already exists"));
        }

        // Resolve branch
        Branch branch = currentUser.getBranch();
        if (branch == null) {
            Object branchIdObj = dto.get("branchId");
            if (branchIdObj != null) {
                Long brId = Long.valueOf(branchIdObj.toString());
                branch = branchRepository.findById(brId)
                        .orElseThrow(() -> new RuntimeException("Branch not found"));
            } else {
                var branches = branchRepository.findByIsActiveTrue();
                if (branches.isEmpty()) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available. Create a branch first."));
                }
                branch = branches.get(0);
            }
        }

        // Create user account
        var role = roleRepository.findByName("TEACHER")
                .orElseThrow(() -> new RuntimeException("TEACHER role not found"));

        String firstName = (String) dto.get("firstName");
        String lastName = (String) dto.get("lastName");
        String password = (String) dto.getOrDefault("password", "Teacher@123");
        String phone = (String) dto.get("phone");

        String username = email.split("@")[0];
        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .role(role)
                .branch(branch)
                .isActive(true)
                .build();
        userRepository.save(user);

        // Create staff record
        String employeeId = "EMP" + String.format("%05d", staffRepository.count() + 1);

        Staff staff = Staff.builder()
                .user(user)
                .branch(branch)
                .employeeId(employeeId)
                .designation((String) dto.getOrDefault("designation", "Teacher"))
                .department((String) dto.get("department"))
                .qualification((String) dto.get("qualification"))
                .specialization((String) dto.get("specialization"))
                .staffType(Staff.StaffType.TEACHING)
                .contractType(Staff.ContractType.PERMANENT)
                .isActive(true)
                .build();
        staffRepository.save(staff);

        Map<String, Object> data = new HashMap<>();
        data.put("id", staff.getId());
        data.put("employeeId", staff.getEmployeeId());
        data.put("name", firstName + (lastName != null ? " " + lastName : ""));
        data.put("email", email);
        data.put("userId", user.getId());

        return ResponseEntity.ok(ApiResponse.success("Teacher created successfully", data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<Staff>> update(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dto) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (dto.containsKey("designation")) staff.setDesignation((String) dto.get("designation"));
        if (dto.containsKey("department")) staff.setDepartment((String) dto.get("department"));
        if (dto.containsKey("qualification")) staff.setQualification((String) dto.get("qualification"));
        if (dto.containsKey("specialization")) staff.setSpecialization((String) dto.get("specialization"));

        // Update linked user info
        if (staff.getUser() != null) {
            User user = staff.getUser();
            if (dto.containsKey("firstName")) user.setFirstName((String) dto.get("firstName"));
            if (dto.containsKey("lastName")) user.setLastName((String) dto.get("lastName"));
            if (dto.containsKey("email")) user.setEmail((String) dto.get("email"));
            if (dto.containsKey("phone")) user.setPhone((String) dto.get("phone"));
            userRepository.save(user);
        }

        staffRepository.save(staff);
        return ResponseEntity.ok(ApiResponse.success("Teacher updated", staff));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'BRANCH_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        staff.setIsActive(false);
        staffRepository.save(staff);

        if (staff.getUser() != null) {
            staff.getUser().setIsActive(false);
            userRepository.save(staff.getUser());
        }

        return ResponseEntity.ok(ApiResponse.success("Teacher deactivated", null));
    }
}
