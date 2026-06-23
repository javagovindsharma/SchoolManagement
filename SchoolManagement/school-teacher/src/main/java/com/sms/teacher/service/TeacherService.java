package com.sms.teacher.service;

import org.springframework.stereotype.Service;
import com.sms.teacher.entity.Teacher;
import com.sms.teacher.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository repository;

    public TeacherService(
            TeacherRepository repository) {
        this.repository = repository;
    }

    public Teacher save(Teacher dto) {

        Teacher teacher = new Teacher();

        teacher.setName(dto.getName());
        teacher.setEmail(dto.getEmail());
        teacher.setMobile(dto.getMobile());
        teacher.setSubject(dto.getSubject());

        return repository.save(teacher);
    }

    public List<Teacher> getAll() {
        return repository.findAll();
    }

    public Teacher getById(Long id) {
        return repository.findById(id)
                .orElseThrow();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}