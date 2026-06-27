package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "classes")
@Data
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String className;

    @Column(nullable = false)
    private String section;

    @Column(name = "teacher_id")
    private Long teacherId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "teacher_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private Teacher teacher;
}