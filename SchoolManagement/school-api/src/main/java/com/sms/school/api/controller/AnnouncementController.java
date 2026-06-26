package com.sms.school.api.controller;

import com.sms.school.common.dto.ResponseDto;
import com.sms.school.common.dto.ResponseObjectDto;
import com.sms.school.common.entity.Announcement;
import com.sms.school.api.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    // GET /api/announcements
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Announcement> announcements = announcementRepository.findAll()
                    .stream()
                    .sorted(Comparator.comparing(Announcement::getCreatedAt).reversed())
                    .toList();

            return ResponseEntity.ok(announcements);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    // GET /api/announcements/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<Announcement> announcement =
                    announcementRepository.findById(id);

            if (announcement.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(false, "Not found"));
            }

            return ResponseEntity.ok(announcement.get());

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    // GET /api/announcements/count
    @GetMapping("/count")
    public ResponseEntity<?> getCount() {
        try {
            return ResponseEntity.ok(announcementRepository.count());

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    // POST /api/announcements
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Announcement announcement) {

        try {
            Announcement saved =
                    announcementRepository.save(announcement);

            return ResponseEntity.ok(
                    new ResponseObjectDto(
                            true,
                            "Announcement created",
                            saved
                    )
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    // PUT /api/announcements/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Announcement dto) {

        try {

            Optional<Announcement> optional =
                    announcementRepository.findById(id);

            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(false, "Not found"));
            }

            Announcement announcement = optional.get();

            announcement.setTitle(dto.getTitle());
            announcement.setMessage(dto.getMessage());
            announcement.setTarget(dto.getTarget());
            announcement.setPriority(dto.getPriority());

            announcementRepository.save(announcement);

            return ResponseEntity.ok(
                    new ResponseDto(true, "Updated")
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }

    // DELETE /api/announcements/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        try {

            Optional<Announcement> optional =
                    announcementRepository.findById(id);

            if (optional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(false, "Not found"));
            }

            announcementRepository.delete(optional.get());

            return ResponseEntity.ok(
                    new ResponseDto(true, "Deleted")
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, ex.getMessage()));
        }
    }
}