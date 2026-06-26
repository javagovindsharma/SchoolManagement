package com.sms.school.common.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;



@Entity
@Table(name = "attendance")
@Getter
@Setter
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long studentClassId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private String status; // PRESENT, ABSENT, LATE

    // Optional relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", insertable = false, updatable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classId", insertable = false, updatable = false)
    private ClassEntity schoolClass;
}