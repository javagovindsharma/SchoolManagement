package com.sms.school.api.service;

import com.sms.school.api.config.JwtService;
import com.sms.school.api.dto.*;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.RoleRepository;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.common.entity.Permission;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
            }
            userRepository.save(user);
            throw new RuntimeException("Invalid email or password");
        }

        if (user.isLocked()) {
            throw new RuntimeException("Account is locked. Try again after 30 minutes.");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated. Contact administrator.");
        }

        // Reset failed attempts
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().getName());
        claims.put("userId", user.getId());
        if (user.getBranch() != null) {
            claims.put("branchId", user.getBranch().getId());
        }

        String token = jwtService.generateToken(user.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(mapToUserDto(user))
                .build();
    }

    public UserDto register(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        String username = request.getEmail().split("@")[0];
        if (userRepository.existsByUsername(username)) {
            username = username + System.currentTimeMillis() % 1000;
        }

        User user = User.builder()
                .username(username)
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(role)
                .isActive(true)
                .build();

        if (request.getBranchId() != null) {
            var branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
            user.setBranch(branch);
        }

        userRepository.save(user);
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        var roleDto = RoleDto.builder()
                .id(user.getRole().getId())
                .name(user.getRole().getName())
                .displayName(user.getRole().getDisplayName())
                .build();

        BranchDto branchDto = null;
        if (user.getBranch() != null) {
            branchDto = BranchDto.builder()
                    .id(user.getBranch().getId())
                    .name(user.getBranch().getName())
                    .code(user.getBranch().getCode())
                    .build();
        }

        Set<String> permissions = new HashSet<>();
        try {
            if (user.getRole().getPermissions() != null) {
                permissions = user.getRole().getPermissions().stream()
                        .map(Permission::getName)
                        .collect(Collectors.toSet());
            }
        } catch (Exception e) {
            // Permissions might not be loaded (lazy) - that's OK
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
                .permissions(permissions)
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
