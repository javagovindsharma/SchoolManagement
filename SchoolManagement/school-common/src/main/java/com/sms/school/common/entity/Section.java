package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    @Column(nullable = false, length = 20)
    private String name;

    @Column
    @Builder.Default
    private Integer capacity = 40;

    @Column(name = "class_teacher_id")
    private Long classTeacherId;

    @Column(name = "room_number", length = 20)
    private String roomNumber;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
