package com.sms.attendance.service;

import com.sms.attendance.entity.Attendance;
import com.sms.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository repository;

    public AttendanceService(
            AttendanceRepository repository) {
        this.repository = repository;
    }

    public Attendance save(Attendance dto) {

        Attendance attendance = new Attendance();

        attendance.setStudentId(dto.getStudentId());
        attendance.setStudentName(dto.getStudentName());
        attendance.setAttendanceDate(dto.getAttendanceDate());
        attendance.setStatus(dto.getStatus());

        return repository.save(attendance);
    }

    public List<Attendance> getAll() {
        return repository.findAll();
    }

    public Attendance getById(Long id) {
        return repository.findById(id)
                .orElseThrow();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}