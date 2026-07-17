package com.sms.school.rag.controller;

import com.sms.school.rag.service.AdminQaService;
import com.sms.school.rag.service.BookIngestionService;
import com.sms.school.rag.service.BookQaService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@AllArgsConstructor
public class RagController {

    private final BookQaService bookQaService;
    private final BookIngestionService bookIngestionService;
    private final AdminQaService adminQaService;

    @PostMapping(value = "/ask", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> ask(@RequestBody Map<String, String> req) {
        return bookQaService.askStream(req.get("question"), req.get("subject"));
    }

    @PostMapping(value = "/admin/ask", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> adminAsk(@RequestBody Map<String, String> req) {
        return adminQaService.askStream(req.get("question"));
    }

    @PostMapping("/books/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file, @RequestParam String bookName, @RequestParam String subject) {
        bookIngestionService.ingestBook(file.getResource(), bookName, subject);
        return Map.of("status", bookName + " ingested");
    }
}
