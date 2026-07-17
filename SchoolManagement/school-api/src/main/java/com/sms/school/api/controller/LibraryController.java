package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.BookRepository;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.common.entity.Book;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final BookRepository bookRepository;
    private final BranchRepository branchRepository;

    @GetMapping("/books")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<Book>>> getBooks(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        var pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Long branchId = (user != null && user.getBranch() != null) ? user.getBranch().getId() : null;
        Page<Book> books;
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        if (trimmedSearch != null && branchId != null) {
            books = bookRepository.searchByBranch(branchId, trimmedSearch, pageable);
        } else if (branchId != null) {
            books = bookRepository.findByBranchId(branchId, pageable);
        } else if (trimmedSearch != null) {
            books = bookRepository.findAll(pageable); // TODO: add global search
        } else {
            books = bookRepository.findAll(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(books));
    }

    @PostMapping("/books")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL', 'LIBRARIAN')")
    @Transactional
    public ResponseEntity<ApiResponse<Book>> addBook(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String title = (String) dto.get("title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Book title is required"));
        }

        // Resolve branch
        Branch branch = currentUser.getBranch();
        if (branch == null) {
            Object branchIdObj = dto.get("branchId");
            if (branchIdObj != null) {
                branch = branchRepository.findById(Long.valueOf(branchIdObj.toString())).orElse(null);
            }
            if (branch == null) {
                var branches = branchRepository.findByIsActiveTrue();
                if (branches.isEmpty()) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available."));
                }
                branch = branches.get(0);
            }
        }

        Integer totalCopies = dto.get("totalCopies") != null ? Integer.valueOf(dto.get("totalCopies").toString()) : 1;

        Book book = Book.builder()
                .branch(branch)
                .title(title)
                .author((String) dto.get("author"))
                .isbn((String) dto.get("isbn"))
                .publisher((String) dto.get("publisher"))
                .edition((String) dto.get("edition"))
                .language((String) dto.getOrDefault("language", "English"))
                .totalCopies(totalCopies)
                .availableCopies(totalCopies)
                .rackNumber((String) dto.get("rackNumber"))
                .shelfNumber((String) dto.get("shelfNumber"))
                .build();

        if (dto.get("yearPublished") != null && !dto.get("yearPublished").toString().isBlank()) {
            book.setYearPublished(Integer.valueOf(dto.get("yearPublished").toString()));
        }
        if (dto.get("pages") != null && !dto.get("pages").toString().isBlank()) {
            book.setPages(Integer.valueOf(dto.get("pages").toString()));
        }
        if (dto.get("price") != null && !dto.get("price").toString().isBlank()) {
            book.setPrice(new java.math.BigDecimal(dto.get("price").toString()));
        }

        bookRepository.save(book);
        return ResponseEntity.ok(ApiResponse.success("Book added to library", book));
    }
}
