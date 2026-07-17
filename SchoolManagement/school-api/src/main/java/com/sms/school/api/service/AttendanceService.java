package com.sms.school.api.service;

import com.sms.school.common.entity.Attendance;
import com.sms.school.api.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repository;

    public List<Attendance> getAll() {
        return repository.findAll();
    }

    public Attendance getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
    }

    public List<Attendance> getByStudentAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return repository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
    }

    public List<Attendance> getBySectionAndDate(Long sectionId, LocalDate date) {
        return repository.findBySectionIdAndDate(sectionId, date);
    }

    public Attendance markAttendance(Attendance attendance) {
        // Check if attendance already marked for this student on this date
        var existing = repository.findByStudentIdAndDate(
                attendance.getStudent().getId(), attendance.getDate());

        if (existing.isPresent()) {
            // Update existing record
            Attendance record = existing.get();
            record.setStatus(attendance.getStatus());
            record.setRemarks(attendance.getRemarks());
            record.setMarkedBy(attendance.getMarkedBy());
            return repository.save(record);
        }

        return repository.save(attendance);
    }

    public void markBulkAttendance(List<Attendance> records) {
        for (Attendance record : records) {
            markAttendance(record);
        }
    }

    public Map<String, Object> getAttendancePercentage(Long studentId, LocalDate startDate, LocalDate endDate) {
        long present = repository.countPresentDays(studentId, startDate, endDate);
        long total = repository.countTotalDays(studentId, startDate, endDate);
        double percentage = total > 0 ? (present * 100.0 / total) : 0;

        return Map.of(
                "studentId", studentId,
                "present", present,
                "total", total,
                "percentage", Math.round(percentage * 100.0) / 100.0
        );
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
