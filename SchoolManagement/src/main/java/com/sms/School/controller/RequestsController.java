package com.sms.school.controller;

import com.sms.school.dto.ResponseDto;
import com.sms.school.dto.ResponseObjectDto;
import com.sms.school.entity.Request;
import com.sms.school.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestsController {

    private final RequestRepository requestRepository;

    @GetMapping
    public ResponseEntity<List<Request>> getAll() {
        List<Request> requests = requestRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Request>> getByStudent(@PathVariable Long studentId) {
        List<Request> requests =
                requestRepository.findByStudentIdOrderByCreatedAtDesc(studentId);

        return ResponseEntity.ok(requests);
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ResponseObjectDto> create(@RequestBody Request request) {

        Request savedRequest = requestRepository.save(request);

        return ResponseEntity.ok(
                new ResponseObjectDto(
                        true,
                        "Submitted",
                        savedRequest
                )
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<ResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        requestRepository.save(request);

        return ResponseEntity.ok( new ResponseDto(true,"Status updated"));
    }
}