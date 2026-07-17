-- =====================================================
-- DPS School Management System - Attendance & Exams
-- =====================================================

-- Attendance
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status ENUM('PRESENT','ABSENT','LATE','HALF_DAY','EXCUSED') NOT NULL,
    remarks VARCHAR(500),
    marked_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (marked_by) REFERENCES staff(id),
    UNIQUE KEY uk_attendance (student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Staff Attendance
CREATE TABLE staff_attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('PRESENT','ABSENT','LATE','HALF_DAY','ON_LEAVE','HOLIDAY') NOT NULL,
    remarks VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    UNIQUE KEY uk_staff_attendance (staff_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exam Types
CREATE TABLE exam_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    weightage DECIMAL(5,2) DEFAULT 0,
    academic_year_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exams
CREATE TABLE exams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    exam_type_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'SCHEDULED',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exam Schedule
CREATE TABLE exam_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_marks INT NOT NULL,
    passing_marks INT NOT NULL,
    room_number VARCHAR(50),
    invigilator_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (invigilator_id) REFERENCES staff(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Marks/Results
CREATE TABLE exam_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    exam_schedule_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    marks_obtained DECIMAL(6,2),
    practical_marks DECIMAL(6,2),
    total_marks DECIMAL(6,2),
    grade VARCHAR(5),
    grade_point DECIMAL(4,2),
    rank_in_class INT,
    remarks VARCHAR(500),
    is_absent BOOLEAN DEFAULT FALSE,
    entered_by BIGINT,
    verified_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (entered_by) REFERENCES staff(id),
    UNIQUE KEY uk_exam_result (exam_schedule_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Grading System
CREATE TABLE grading_systems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point DECIMAL(4,2),
    remarks VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Report Cards
CREATE TABLE report_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    total_marks DECIMAL(8,2),
    marks_obtained DECIMAL(8,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(5),
    cgpa DECIMAL(4,2),
    rank_in_class INT,
    rank_in_section INT,
    attendance_percentage DECIMAL(5,2),
    teacher_remarks TEXT,
    principal_remarks TEXT,
    status ENUM('DRAFT','PUBLISHED','LOCKED') DEFAULT 'DRAFT',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (exam_id) REFERENCES exams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Homework/Assignments
CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    section_id BIGINT,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    assignment_type ENUM('HOMEWORK','CLASSWORK','PROJECT','ASSIGNMENT') DEFAULT 'HOMEWORK',
    file_url VARCHAR(500),
    due_date DATE,
    max_marks INT,
    is_graded BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE','CLOSED','CANCELLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES staff(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assignment Submissions
CREATE TABLE assignment_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_text TEXT,
    file_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained DECIMAL(6,2),
    grade VARCHAR(5),
    teacher_feedback TEXT,
    status ENUM('SUBMITTED','LATE','GRADED','RETURNED') DEFAULT 'SUBMITTED',
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY uk_submission (assignment_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_attendance_student ON attendance(student_id, date);
CREATE INDEX idx_attendance_class ON attendance(class_id, section_id, date);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
CREATE INDEX idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX idx_assignments_class ON assignments(class_id, section_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
