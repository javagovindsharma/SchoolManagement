package com.sms.school.repository;

import com.sms.school.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository
        extends JpaRepository<Teacher, Long> {

}