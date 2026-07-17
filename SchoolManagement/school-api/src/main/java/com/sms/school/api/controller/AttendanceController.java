package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.AttendanceRepository;
import com.sms.school.common.entity.Attendance;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate)));
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<ApiResponse<List<Attendance>>> getBySection(
            @PathVariable Long sectionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceRepository.findBySectionIdAndDate(sectionId, date)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'BRANCH_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ApiResponse<String>> markAttendance(@RequestBody List<Attendance> records) {
        for (Attendance record : records) {
            var existing = attendanceRepository.findByStudentIdAndDate(
                record.getStudent().getId(), record.getDate());
            if (existing.isPresent()) {
                existing.get().setStatus(record.getStatus());
                existing.get().setRemarks(record.getRemarks());
                attendanceRepository.save(existing.get());
            } else {
                attendanceRepository.save(record);
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", null));
    }

    @GetMapping("/percentage/{studentId}")
    public ResponseEntity<ApiResponse<?>> getPercentage(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        long present = attendanceRepository.countPresentDays(studentId, startDate, endDate);
        long total = attendanceRepository.countTotalDays(studentId, startDate, endDate);
        double percentage = total > 0 ? (present * 100.0 / total) : 0;
        return ResponseEntity.ok(ApiResponse.success(
            java.util.Map.of("present", present, "total", total, "percentage", Math.round(percentage * 100.0) / 100.0)));
    }
}
