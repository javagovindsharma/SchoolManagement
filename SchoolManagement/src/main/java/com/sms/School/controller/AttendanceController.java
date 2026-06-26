package com.sms.school.controller;

import com.sms.school.dto.ResponseDto;
import com.sms.school.entity.Attendance;
import com.sms.school.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAll() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceRepository.findByStudentId(studentId)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ResponseDto> saveAttendance(
            @RequestBody List<Attendance> records) {

        for (Attendance record : records) {

            Attendance existing = attendanceRepository
                    .findByStudentIdAndDateAndStudentClassId(
                            record.getStudentId(),
                            record.getDate(),
                            record.getStudentClassId()
                    )
                    .orElse(null);

            if (existing != null) {
                existing.setStatus(record.getStatus());
                attendanceRepository.save(existing);
            } else {
                attendanceRepository.save(record);
            }
        }

        return ResponseEntity.ok(
                new ResponseDto(true, "Attendance saved")
        );
    }
}