package com.sms.school.api.repository;

import com.sms.school.common.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {

    List<ClassEntity> findAllByOrderByClassNameAscSectionAsc();
}