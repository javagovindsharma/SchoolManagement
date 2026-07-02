package com.sms.school.rag.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.school.rag.entity.BookEmbedding;
import com.sms.school.rag.repository.BookEmbeddingRepository;
import lombok.AllArgsConstructor;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookIngestionService {

    private final EmbeddingModel embeddingModel;
    private final BookEmbeddingRepository repository;
    private final ObjectMapper objectMapper;

    public void ingestBook(Resource bookPdf, String bookName, String subject) {

        var chunks = new TokenTextSplitter(500, 100, 5, 1000, true)
                .apply(new TikaDocumentReader(bookPdf).get());

        chunks.forEach(doc -> {

            try {

                float[] embedding =
                        embeddingModel.embed(doc.getText());

                BookEmbedding entity = new BookEmbedding();
                entity.setBookName(bookName);
                entity.setSubject(subject);
                entity.setContent(doc.getText());

                entity.setEmbedding(
                        objectMapper.writeValueAsString(embedding));

                repository.save(entity);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
}