package com.sms.school.rag.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AdminQaService {

    private final ChatClient chatClient;
    private final JdbcTemplate jdbcTemplate;


    public AdminQaService(ChatClient.Builder builder, JdbcTemplate jdbcTemplate) {
        this.chatClient = builder.build();
        this.jdbcTemplate = jdbcTemplate;
    }

    public String ask(String question) {
        Long totalStudent = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students", Long.class);
        Long totalTeacher = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM teachers", Long.class);
        Long activeTeacher = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM teachers WHERE status='Active'", Long.class);

        String context = """
                School Database Summary:
                - Total Students: %d
                - Total Teachers: %d
                - Active Teachers: %d
                """.formatted(totalStudent,totalTeacher,activeTeacher);

        return chatClient.prompt().user("""
                You are a school managemnet assistant, Answer the admin's question using the data below.
                Be concise and helpful. If data is not available, say so.
                
                %s
                
                
                Question : %s
                """.formatted(context,question)).call().content();
    }
}
