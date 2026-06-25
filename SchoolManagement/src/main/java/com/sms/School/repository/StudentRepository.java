package com.sms.school.repository;


import com.sms.school.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Long countByIdAndStatus(Integer id, String active);
}