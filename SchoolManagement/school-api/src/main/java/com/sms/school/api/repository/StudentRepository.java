package com.sms.school.api.repository;


import com.sms.school.common.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Long countByIdAndStatus(Integer id, String active);
}