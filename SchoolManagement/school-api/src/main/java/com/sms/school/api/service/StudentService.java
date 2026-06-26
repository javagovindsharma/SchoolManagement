package com.sms.school.api.service;

import com.sms.school.common.entity.Student;
import com.sms.school.api.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(
            StudentRepository repository) {
        this.repository = repository;
    }

    public Student save(Student dto) {

        Student student = new Student();

        student.setId(dto.getId());
        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setAddress(dto.getAddress());

        return repository.save(student);
    }

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Student getById(Long id) {
        return repository.findById(id)
                .orElseThrow();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}