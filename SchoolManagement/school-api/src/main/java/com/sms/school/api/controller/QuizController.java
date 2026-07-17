package com.sms.school.api.controller;

import com.sms.school.api.repository.QuizRepository;
import com.sms.school.api.repository.StudentQuizAttemptRepository;
import com.sms.school.common.entity.Question;
import com.sms.school.common.entity.Quiz;
import com.sms.school.common.entity.StudentQuizAttempt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizRepository quizRepository;
    private final StudentQuizAttemptRepository attemptRepository;

    // Teacher: Create quiz
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Quiz quiz) {
        quiz.getQuestions().forEach(q -> q.setQuiz(quiz));
        return ResponseEntity.ok(quizRepository.save(quiz));
    }

    // Teacher: Get quiz detail with questions and assigned students
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizDetail(@PathVariable Long quizId) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = opt.get();
        Map<String, Object> result = new HashMap<>();
        result.put("id", quiz.getId());
        result.put("title", quiz.getTitle());
        result.put("subject", quiz.getSubject());
        result.put("durationMinutes", quiz.getDurationMinutes());
        result.put("assignedStudentIds", quiz.getAssignedStudentIds());
        List<Map<String, Object>> qs = new ArrayList<>();
        for (Question q : quiz.getQuestions()) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", q.getId());
            m.put("questionText", q.getQuestionText());
            m.put("optionA", q.getOptionA());
            m.put("optionB", q.getOptionB());
            m.put("optionC", q.getOptionC());
            m.put("optionD", q.getOptionD());
            m.put("correctAnswer", q.getCorrectAnswer());
            qs.add(m);
        }
        result.put("questions", qs);
        return ResponseEntity.ok(result);
    }

    // Teacher: Update quiz title/subject/duration
    @PutMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = opt.get();
        if (body.containsKey("title")) quiz.setTitle((String) body.get("title"));
        if (body.containsKey("subject")) quiz.setSubject((String) body.get("subject"));
        if (body.containsKey("durationMinutes")) quiz.setDurationMinutes((Integer) body.get("durationMinutes"));
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of("status", "Quiz updated"));
    }

    // Teacher: Update a question
    @PutMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long quizId, @PathVariable Long questionId, @RequestBody Map<String, String> body) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = opt.get();
        for (Question q : quiz.getQuestions()) {
            if (q.getId().equals(questionId)) {
                if (body.containsKey("questionText")) q.setQuestionText(body.get("questionText"));
                if (body.containsKey("optionA")) q.setOptionA(body.get("optionA"));
                if (body.containsKey("optionB")) q.setOptionB(body.get("optionB"));
                if (body.containsKey("optionC")) q.setOptionC(body.get("optionC"));
                if (body.containsKey("optionD")) q.setOptionD(body.get("optionD"));
                if (body.containsKey("correctAnswer")) q.setCorrectAnswer(body.get("correctAnswer"));
                break;
            }
        }
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of("status", "Question updated"));
    }

    // Teacher: Delete a question
    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long quizId, @PathVariable Long questionId) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = opt.get();
        quiz.getQuestions().removeIf(q -> q.getId().equals(questionId));
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of("status", "Question deleted"));
    }

    // Teacher: Unassign student from quiz
    @PostMapping("/{quizId}/unassign")
    public ResponseEntity<?> unassign(@PathVariable Long quizId, @RequestBody Map<String, List<Long>> body) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = opt.get();
        quiz.getAssignedStudentIds().removeAll(body.get("studentIds"));
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of("status", "Unassigned"));
    }

    // Teacher: Get quizzes created by teacher
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(quizRepository.findByCreatedBy(teacherId));
    }

    // Teacher: Upload questions via CSV
    @PostMapping("/{quizId}/upload-csv")
    public ResponseEntity<?> uploadCsv(@PathVariable Long quizId, @RequestParam("file") MultipartFile file) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Quiz quiz = opt.get();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                if (first) { first = false; continue; } // skip header
                String[] parts = line.split(",", -1);
                if (parts.length >= 6) {
                    Question q = new Question();
                    q.setQuestionText(parts[0].trim());
                    q.setOptionA(parts[1].trim());
                    q.setOptionB(parts[2].trim());
                    q.setOptionC(parts[3].trim());
                    q.setOptionD(parts[4].trim());
                    q.setCorrectAnswer(parts[5].trim().toUpperCase());
                    q.setQuiz(quiz);
                    quiz.getQuestions().add(q);
                }
            }
            quizRepository.save(quiz);
            return ResponseEntity.ok(Map.of("status", "Questions uploaded", "count", quiz.getQuestions().size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to parse CSV: " + e.getMessage()));
        }
    }

    // Teacher: Assign quiz to students
    @PostMapping("/{quizId}/assign")
    public ResponseEntity<?> assign(@PathVariable Long quizId, @RequestBody Map<String, List<Long>> body) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Quiz quiz = opt.get();
        quiz.getAssignedStudentIds().addAll(body.get("studentIds"));
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of("status", "Assigned"));
    }

    // Student: Get assigned quizzes
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getForStudent(@PathVariable Long studentId) {
        List<Quiz> quizzes = quizRepository.findByAssignedStudentIdsContaining(studentId);
        List<StudentQuizAttempt> attempts = attemptRepository.findByStudentId(studentId);
        Set<Long> attemptedIds = new HashSet<>();
        attempts.forEach(a -> attemptedIds.add(a.getQuizId()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Quiz q : quizzes) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", q.getId());
            m.put("title", q.getTitle());
            m.put("subject", q.getSubject());
            m.put("durationMinutes", q.getDurationMinutes());
            m.put("totalQuestions", q.getQuestions().size());
            m.put("attempted", attemptedIds.contains(q.getId()));
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }

    // Student: Get quiz questions (without correct answer)
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long quizId) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Quiz quiz = opt.get();
        List<Map<String, Object>> questions = new ArrayList<>();
        for (Question q : quiz.getQuestions()) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", q.getId());
            m.put("questionText", q.getQuestionText());
            m.put("optionA", q.getOptionA());
            m.put("optionB", q.getOptionB());
            m.put("optionC", q.getOptionC());
            m.put("optionD", q.getOptionD());
            questions.add(m);
        }
        return ResponseEntity.ok(Map.of("quiz", quiz.getTitle(), "duration", quiz.getDurationMinutes(), "questions", questions));
    }

    // Student: Submit quiz
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submit(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        Long studentId = Long.valueOf(body.get("studentId").toString());

        if (attemptRepository.findByStudentIdAndQuizId(studentId, quizId).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already attempted"));
        }

        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        // Safely extract answers map
        Map<String, String> answers = new HashMap<>();
        Object answersObj = body.get("answers");
        if (answersObj instanceof Map) {
            ((Map<?, ?>) answersObj).forEach((k, v) -> {
                if (k != null && v != null) answers.put(k.toString(), v.toString());
            });
        }

        Quiz quiz = opt.get();
        int totalQuestions = quiz.getQuestions().size();
        int attempted = 0;
        int correct = 0;
        int wrong = 0;

        for (Question q : quiz.getQuestions()) {
            String given = answers.get(String.valueOf(q.getId()));
            if (given != null && !given.isBlank()) {
                attempted++;
                if (given.equalsIgnoreCase(q.getCorrectAnswer())) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        }

        int unattempted = totalQuestions - attempted;
        int score = totalQuestions > 0 ? (correct * 100) / totalQuestions : 0;

        StudentQuizAttempt attempt = new StudentQuizAttempt();
        attempt.setStudentId(studentId);
        attempt.setQuizId(quizId);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCorrectAnswers(correct);
        attempt.setScore(score);
        attemptRepository.save(attempt);

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalQuestions", totalQuestions);
        report.put("attempted", attempted);
        report.put("correct", correct);
        report.put("wrong", wrong);
        report.put("unattempted", unattempted);
        report.put("score", score);
        return ResponseEntity.ok(report);
    }

    // Student: Get scorecard
    @GetMapping("/scorecard/{studentId}")
    public ResponseEntity<?> scorecard(@PathVariable Long studentId) {
        return ResponseEntity.ok(attemptRepository.findByStudentId(studentId));
    }
}
