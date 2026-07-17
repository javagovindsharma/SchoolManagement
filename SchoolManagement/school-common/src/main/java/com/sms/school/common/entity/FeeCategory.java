package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fee_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeCategory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "is_recurring")
    @Builder.Default
    private Boolean isRecurring = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeeFrequency frequency = FeeFrequency.MONTHLY;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public enum FeeFrequency { MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY, ONE_TIME }
}
