package com.sms.school.rag.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.school.rag.entity.BookEmbedding;
import com.sms.school.rag.repository.BookEmbeddingRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookQaService {

    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;
    private final BookEmbeddingRepository repository;
    private final ObjectMapper objectMapper;

    public BookQaService(
            ChatClient.Builder builder,
            EmbeddingModel embeddingModel,
            BookEmbeddingRepository repository,
            ObjectMapper objectMapper) {

        this.chatClient = builder.build();
        this.embeddingModel = embeddingModel;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public String ask(String question, String subject) {

        float[] queryVector = embeddingModel.embed(question);

        List<BookEmbedding> topMatches = repository.findAll()
                .stream()
                .sorted((a, b) -> Double.compare(
                        similarity(b.getEmbedding(), queryVector),
                        similarity(a.getEmbedding(), queryVector)
                ))
                .limit(10)
                .toList();

        String context = topMatches.stream()
                .map(BookEmbedding::getContent)
                .collect(Collectors.joining("\n\n"));

        return chatClient.prompt()
                .user("""
                        You are a school teacher.
                        Answer ONLY from the textbook content below.
                        If not found, say "Not covered in your textbook".

                        Textbook:
                        %s

                        Question:
                        %s
                        """.formatted(context, question))
                .call()
                .content();
    }

    private double similarity(String embeddingJson, float[] queryVector) {

        try {

            List<Double> stored =
                    objectMapper.readValue(
                            embeddingJson,
                            new TypeReference<List<Double>>() {});

            double dot = 0;
            double normA = 0;
            double normB = 0;

            for (int i = 0; i < Math.min(stored.size(), queryVector.length); i++) {

                double a = stored.get(i);
                double b = queryVector[i];

                dot += a * b;
                normA += a * a;
                normB += b * b;
            }

            return dot / (Math.sqrt(normA) * Math.sqrt(normB));

        } catch (Exception e) {
            return 0;
        }
    }
}