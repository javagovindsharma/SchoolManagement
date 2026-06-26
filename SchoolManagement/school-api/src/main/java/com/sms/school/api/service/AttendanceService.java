package com.sms.school.api.service;

import com.sms.school.common.entity.Attendance;
import com.sms.school.api.repository.AttendanceRepository;
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
        attendance.setStudent(dto.getStudent());
        attendance.setDate(dto.getDate());
        attendance.setStudentClassId(dto.getStudentClassId());
        attendance.setSchoolClass(dto.getSchoolClass());
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