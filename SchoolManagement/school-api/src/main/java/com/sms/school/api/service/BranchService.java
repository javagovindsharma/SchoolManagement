package com.sms.school.api.service;

import com.sms.school.api.dto.BranchDto;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.OrganizationRepository;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final OrganizationRepository organizationRepository;

    public List<BranchDto> getAllBranches() {
        return branchRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BranchDto getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        return mapToDto(branch);
    }

    @Transactional
    public BranchDto createBranch(BranchDto dto) {
        if (branchRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Branch code already exists");
        }

        // Get or create organization first
        Organization org = organizationRepository.findFirstByIsActiveTrue()
                .orElseGet(() -> {
                    Organization newOrg = Organization.builder()
                            .name("DPS School")
                            .code("DPS")
                            .boardType(Organization.BoardType.CBSE)
                            .isActive(true)
                            .build();
                    return organizationRepository.save(newOrg);
                });

        Branch branch = Branch.builder()
                .organization(org)
                .name(dto.getName())
                .code(dto.getCode())
                .branchType(dto.getBranchType() != null ?
                    Branch.BranchType.valueOf(dto.getBranchType()) : Branch.BranchType.BRANCH)
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .principalName(dto.getPrincipalName())
                .establishedYear(dto.getEstablishedYear())
                .studentCapacity(dto.getStudentCapacity())
                .isActive(true)
                .build();

        branchRepository.save(branch);
        return mapToDto(branch);
    }

    public BranchDto updateBranch(Long id, BranchDto dto) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        branch.setName(dto.getName());
        branch.setEmail(dto.getEmail());
        branch.setPhone(dto.getPhone());
        branch.setAddress(dto.getAddress());
        branch.setCity(dto.getCity());
        branch.setState(dto.getState());
        branch.setPincode(dto.getPincode());
        branch.setPrincipalName(dto.getPrincipalName());
        branch.setStudentCapacity(dto.getStudentCapacity());

        branchRepository.save(branch);
        return mapToDto(branch);
    }

    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        branch.setIsActive(false);
        branchRepository.save(branch);
    }

    private BranchDto mapToDto(Branch b) {
        return BranchDto.builder()
                .id(b.getId())
                .name(b.getName())
                .code(b.getCode())
                .branchType(b.getBranchType() != null ? b.getBranchType().name() : null)
                .email(b.getEmail())
                .phone(b.getPhone())
                .address(b.getAddress())
                .city(b.getCity())
                .state(b.getState())
                .pincode(b.getPincode())
                .principalName(b.getPrincipalName())
                .establishedYear(b.getEstablishedYear())
                .studentCapacity(b.getStudentCapacity())
                .isActive(b.getIsActive())
                .build();
    }
}
