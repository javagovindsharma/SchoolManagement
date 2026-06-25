package com.sms.school.repository;

import com.sms.school.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Request> findAllByOrderByCreatedAtDesc();
}