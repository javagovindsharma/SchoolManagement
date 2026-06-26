package com.sms.school.controller;

import com.sms.school.dto.ResponseDto;
import com.sms.school.entity.Mark;
import com.sms.school.repository.MarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarksController {

    private final MarkRepository markRepository;

    @GetMapping
    public ResponseEntity<List<Mark>> getAll() {
        return ResponseEntity.ok(markRepository.findAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Mark>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(
                markRepository.findByStudentId(studentId)
        );
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount() {
        try {
            return ResponseEntity.ok(markRepository.count());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseDto> saveMarks(@RequestBody List<Mark> marks) {

        for (Mark mark : marks) {

            Mark existing = markRepository
                    .findByStudentIdAndSubjectIdAndExamType(
                            mark.getStudent().getId(),
                            mark.getSubject().getId(),
                            mark.getExamType()
                    )
                    .orElse(null);

            if (existing != null) {
                existing.setMarks(mark.getMarks());
                existing.setGrade(mark.getGrade());
                markRepository.save(existing);
            } else {
                markRepository.save(mark);
            }
        }

        return ResponseEntity.ok(
                new ResponseDto(true, "Marks saved")
        );
    }
}