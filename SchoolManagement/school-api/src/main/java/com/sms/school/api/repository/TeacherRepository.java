package com.sms.school.api.repository;

import com.sms.school.common.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository
        extends JpaRepository<Teacher, Long> {

}