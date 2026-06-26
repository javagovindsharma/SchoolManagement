package com.sms.school.api.repository;

import com.sms.school.common.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    Optional<Attendance> findByStudentIdAndDateAndStudentClassId(
            Long studentId,
            LocalDate date,
            Long studentClassId
    );
}