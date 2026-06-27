package com.sms.school.rag.controller;

import com.sms.school.rag.service.AdminQaService;
import com.sms.school.rag.service.BookIngestionService;
import com.sms.school.rag.service.BookQaService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/rag")
@AllArgsConstructor
public class RagController {

    private final BookQaService bookQaService;
    private final BookIngestionService bookIngestionService;
    private final AdminQaService adminQaService;

    @PostMapping("/ask")
    public Map<String,String> ask(@RequestBody Map<String,String> req){
        return Map.of("answer",bookQaService.ask(req.get("question"),req.get("subject")));
    }

    @PostMapping("/admin/ask")
    public Map<String,String> adminAsk(@RequestBody Map<String,String> req){
        return Map.of("answer",adminQaService.ask(req.get("question")));
    }

    @PostMapping("/books/upload")
    public Map<String,String> upload(@RequestParam("file") MultipartFile file, @RequestParam String bookName, @RequestParam String subject){
        bookIngestionService.ingestBook(file.getResource(),bookName,subject);
        return Map.of("status",bookName+" ingested");
    }
}
