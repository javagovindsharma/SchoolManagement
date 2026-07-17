package com.sms.school.api.controller;

import com.sms.school.api.dto.*;
import com.sms.school.api.service.AuthService;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.common.entity.Permission;
import com.sms.school.common.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long branchId) {

        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.searchUsers(search, pageable);
        } else if (branchId != null) {
            users = userRepository.findByBranchId(branchId, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        // Map to DTOs to avoid lazy loading issues
        Page<UserDto> userDtos = users.map(this::toDto);
        return ResponseEntity.ok(ApiResponse.success(userDtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> create(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDto user = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("User created", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", null));
    }

    private UserDto toDto(User user) {
        RoleDto roleDto = null;
        if (user.getRole() != null) {
            roleDto = RoleDto.builder()
                    .id(user.getRole().getId())
                    .name(user.getRole().getName())
                    .displayName(user.getRole().getDisplayName())
                    .build();
        }

        BranchDto branchDto = null;
        if (user.getBranch() != null) {
            branchDto = BranchDto.builder()
                    .id(user.getBranch().getId())
                    .name(user.getBranch().getName())
                    .code(user.getBranch().getCode())
                    .build();
        }

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .role(roleDto)
                .branch(branchDto)
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
