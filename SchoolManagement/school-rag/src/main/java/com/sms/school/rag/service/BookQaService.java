package com.sms.school.rag.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.stream.Collectors;

@Service
public class BookQaService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public BookQaService(ChatClient.Builder builder, VectorStore vectorStore) {
        this.chatClient = builder.build();
        this.vectorStore = vectorStore;
    }

    public String ask(String question, String subject) {
        var results = vectorStore.similaritySearch(SearchRequest.builder().query(question).topK(5).build());
        String context = results.stream().map(Document::getText).collect(Collectors.joining("\n\n"));
        return chatClient.prompt().user("""
                You are a school teacher. Answer ONLY from the textbook content below.
                If not found, say "Not covered in your textbook".
                
                Textbook: %s
                Question: %s
                """.formatted(context, question)).call().content();
    }

    public Flux<String> askStream(String question, String subject) {
        var results = vectorStore.similaritySearch(SearchRequest.builder().query(question).topK(5).build());
        String context = results.stream().map(Document::getText).collect(Collectors.joining("\n\n"));
        return chatClient.prompt().user("""
                You are a school teacher. Answer ONLY from the textbook content below.
                If not found, say "Not covered in your textbook".
                
                Textbook: %s
                Question: %s
                """.formatted(context, question)).stream().content();
    }
}
