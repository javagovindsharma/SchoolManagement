package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "class_name", nullable = false, length = 50)
    private String className;

    @Column(name = "section", nullable = false, length = 20)
    @Builder.Default
    private String section = "A";

    @Column(name = "numeric_name")
    private Integer numericName;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @PrePersist
    @PreUpdate
    private void syncFields() {
        // Keep both columns in sync
        if (this.className == null || this.className.isBlank()) {
            this.className = this.name;
        }
        if (this.name == null || this.name.isBlank()) {
            this.name = this.className;
        }
    }
}
