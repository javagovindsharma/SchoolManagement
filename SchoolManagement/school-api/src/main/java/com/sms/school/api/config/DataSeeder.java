package com.sms.school.api.config;

import com.sms.school.api.repository.RoleRepository;
import com.sms.school.api.repository.UserRepository;
import com.sms.school.api.repository.OrganizationRepository;
import com.sms.school.api.repository.AcademicYearRepository;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.common.entity.AcademicYear;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.Organization;
import com.sms.school.common.entity.Role;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final AcademicYearRepository academicYearRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedOrganization();
        seedRoles();
        seedUsers();
        seedAcademicYear();
    }

    private void seedOrganization() {
        if (organizationRepository.count() == 0) {
            Organization org = Organization.builder()
                    .name("DPS School")
                    .code("DPS")
                    .boardType(Organization.BoardType.CBSE)
                    .email("info@dps.edu.in")
                    .phone("+91-11-12345678")
                    .city("New Delhi")
                    .state("Delhi")
                    .country("India")
                    .isActive(true)
                    .build();
            organizationRepository.save(org);
            log.info("✅ Organization seeded");
        }
    }

    private void seedRoles() {
        createRoleIfNotExists("SUPER_ADMIN", "Super Administrator");
        createRoleIfNotExists("ORG_ADMIN", "Organization Admin");
        createRoleIfNotExists("BRANCH_ADMIN", "Branch Admin");
        createRoleIfNotExists("PRINCIPAL", "Principal");
        createRoleIfNotExists("TEACHER", "Teacher");
        createRoleIfNotExists("STUDENT", "Student");
        createRoleIfNotExists("PARENT", "Parent");
        createRoleIfNotExists("ACCOUNTANT", "Accountant");
        createRoleIfNotExists("LIBRARIAN", "Librarian");
        createRoleIfNotExists("HR_MANAGER", "HR Manager");
        createRoleIfNotExists("TRANSPORT_MANAGER", "Transport Manager");
        log.info("✅ Roles seeded successfully");
    }

    private void seedUsers() {
        String encodedPassword = passwordEncoder.encode("Admin@123");

        Role superAdmin = roleRepository.findByName("SUPER_ADMIN").orElseThrow();
        Role orgAdmin = roleRepository.findByName("ORG_ADMIN").orElseThrow();
        Role branchAdmin = roleRepository.findByName("BRANCH_ADMIN").orElseThrow();
        Role principal = roleRepository.findByName("PRINCIPAL").orElseThrow();
        Role teacher = roleRepository.findByName("TEACHER").orElseThrow();
        Role student = roleRepository.findByName("STUDENT").orElseThrow();
        Role parent = roleRepository.findByName("PARENT").orElseThrow();
        Role accountant = roleRepository.findByName("ACCOUNTANT").orElseThrow();
        Role librarian = roleRepository.findByName("LIBRARIAN").orElseThrow();
        Role hrManager = roleRepository.findByName("HR_MANAGER").orElseThrow();
        Role transportManager = roleRepository.findByName("TRANSPORT_MANAGER").orElseThrow();

        createUser("superadmin", "superadmin@dps.edu.in", encodedPassword, "Super", "Admin", superAdmin);
        createUser("orgadmin", "orgadmin@dps.edu.in", encodedPassword, "Org", "Admin", orgAdmin);
        createUser("branchadmin", "branchadmin@dps.edu.in", encodedPassword, "Branch", "Admin", branchAdmin);
        createUser("principal", "principal@dps.edu.in", encodedPassword, "Dr. Rajesh", "Kumar", principal);
        createUser("teacher1", "teacher1@dps.edu.in", encodedPassword, "Anita", "Gupta", teacher);
        createUser("student1", "student1@dps.edu.in", encodedPassword, "Rahul", "Sharma", student);
        createUser("parent1", "parent1@dps.edu.in", encodedPassword, "Vikram", "Sharma", parent);
        createUser("accountant", "accountant@dps.edu.in", encodedPassword, "Ravi", "Accountant", accountant);
        createUser("librarian", "librarian@dps.edu.in", encodedPassword, "Sunita", "Librarian", librarian);
        createUser("hr", "hr@dps.edu.in", encodedPassword, "Deepak", "HR Manager", hrManager);
        createUser("transport", "transport@dps.edu.in", encodedPassword, "Manoj", "Transport", transportManager);

        log.info("✅ Default users seeded (password: Admin@123)");
    }

    private void createRoleIfNotExists(String name, String displayName) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name);
            role.setDisplayName(displayName);
            role.setIsSystemRole(true);
            roleRepository.save(role);
        }
    }

    private void createUser(String username, String email, String passwordHash,
                            String firstName, String lastName, Role role) {
        if (userRepository.existsByEmail(email)) return;

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordHash)
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .isActive(true)
                .isEmailVerified(true)
                .isMfaEnabled(false)
                .failedLoginAttempts(0)
                .build();
        userRepository.save(user);
    }

    private void seedAcademicYear() {
        if (academicYearRepository.count() > 0) {
            log.info("ℹ️ Academic year already exists, skipping");
            return;
        }

        var branches = branchRepository.findByIsActiveTrue();
        if (branches.isEmpty()) {
            log.info("ℹ️ No branches found, skipping academic year seeding");
            return;
        }

        int currentYear = java.time.LocalDate.now().getYear();
        for (Branch branch : branches) {
            AcademicYear ay = AcademicYear.builder()
                    .branch(branch)
                    .name(currentYear + "-" + (currentYear + 1))
                    .startDate(java.time.LocalDate.of(currentYear, 4, 1))
                    .endDate(java.time.LocalDate.of(currentYear + 1, 3, 31))
                    .isCurrent(true)
                    .build();
            academicYearRepository.save(ay);
        }
        log.info("✅ Academic year seeded: {}-{}", currentYear, currentYear + 1);
    }
}
