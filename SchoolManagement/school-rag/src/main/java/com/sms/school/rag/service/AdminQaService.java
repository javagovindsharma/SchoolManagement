package com.sms.school.rag.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class AdminQaService {

    private final ChatClient chatClient;
    private final JdbcTemplate jdbcTemplate;

    public AdminQaService(ChatClient.Builder builder, JdbcTemplate jdbcTemplate) {
        this.chatClient = builder.build();
        this.jdbcTemplate = jdbcTemplate;
    }

    public Flux<String> askStream(String question) {
        Long totalStudents = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students", Long.class);
        Long totalTeachers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM teachers", Long.class);
        Long activeTeachers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM teachers WHERE status='Active'", Long.class);

        String context = """
                School Database Summary:
                - Total Students: %d
                - Total Teachers: %d
                - Active Teachers: %d
                """.formatted(totalStudents, totalTeachers, activeTeachers);

        return chatClient.prompt().user("""
                You are a school management assistant. Answer the admin's question using the data below.
                Be concise and helpful. If data is not available, say so.
                
                %s
                
                Question: %s
                """.formatted(context, question)).stream().content();
    }
}
