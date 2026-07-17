package com.sms.school.api.service;

import com.sms.school.api.repository.StudentRepository;
import com.sms.school.common.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Page<Student> getStudents(Long branchId, Long classId, String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return studentRepository.searchByBranch(branchId, search, pageable);
        }
        if (classId != null) {
            return studentRepository.findByBranchIdAndSchoolClassId(branchId, classId, pageable);
        }
        return studentRepository.findByBranchId(branchId, pageable);
    }

    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public long countByBranch(Long branchId) {
        return studentRepository.countByBranchIdAndIsActiveTrue(branchId);
    }
}
