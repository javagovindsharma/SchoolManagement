package com.sms.school.repository;

import com.sms.school.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {

    List<ClassEntity> findAllByOrderByClassNameAscSectionAsc();
}