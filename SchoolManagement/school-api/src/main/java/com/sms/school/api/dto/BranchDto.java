package com.sms.school.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {
    private Long id;
    private String name;
    private String code;
    private String branchType;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String principalName;
    private Integer establishedYear;
    private Integer studentCapacity;
    private Boolean isActive;
}
