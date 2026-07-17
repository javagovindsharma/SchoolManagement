package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(length = 20)
    private String isbn;

    @Column(length = 200)
    private String author;

    @Column(length = 200)
    private String publisher;

    @Column(length = 50)
    private String edition;

    @Column(name = "year_published")
    private Integer yearPublished;

    @Column(length = 50)
    @Builder.Default
    private String language = "English";

    private Integer pages;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "rack_number", length = 20)
    private String rackNumber;

    @Column(name = "shelf_number", length = 20)
    private String shelfNumber;

    @Column(name = "total_copies")
    @Builder.Default
    private Integer totalCopies = 1;

    @Column(name = "available_copies")
    @Builder.Default
    private Integer availableCopies = 1;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "is_digital")
    @Builder.Default
    private Boolean isDigital = false;

    @Column(name = "digital_url", length = 500)
    private String digitalUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookStatus status = BookStatus.AVAILABLE;

    public enum BookStatus { AVAILABLE, ALL_ISSUED, DAMAGED, LOST }
}
