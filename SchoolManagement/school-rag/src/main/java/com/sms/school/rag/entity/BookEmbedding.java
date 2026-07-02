package com.sms.school.rag.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book_embeddings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class BookEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookId;

    private String bookName;

    private String subject;

    @Lob
    private String content;

    @Column(columnDefinition = "json")
    private String embedding;
}