package com.sms.school.rag.repository;

import com.sms.school.rag.entity.BookEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookEmbeddingRepository extends JpaRepository<BookEmbedding, Long> {
}