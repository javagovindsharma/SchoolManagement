-- =====================================================
-- DPS School Management System - Academic Schema
-- =====================================================

-- Academic Years
CREATE TABLE academic_years (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Classes
CREATE TABLE classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    numeric_name INT,
    description VARCHAR(200),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sections
CREATE TABLE sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    name VARCHAR(20) NOT NULL,
    capacity INT DEFAULT 40,
    class_teacher_id BIGINT,
    room_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subjects
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    subject_type ENUM('THEORY','PRACTICAL','BOTH') DEFAULT 'THEORY',
    category ENUM('CORE','ELECTIVE','OPTIONAL','EXTRA_CURRICULAR') DEFAULT 'CORE',
    max_marks_theory INT DEFAULT 100,
    max_marks_practical INT DEFAULT 0,
    passing_marks INT DEFAULT 33,
    credit_hours INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Class-Subject Mapping
CREATE TABLE class_subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT,
    periods_per_week INT DEFAULT 5,
    academic_year_id BIGINT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    UNIQUE KEY uk_class_subject_year (class_id, subject_id, academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teachers/Staff
CREATE TABLE staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    branch_id BIGINT NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(100),
    qualification VARCHAR(500),
    specialization VARCHAR(200),
    experience_years INT DEFAULT 0,
    date_of_joining DATE,
    date_of_birth DATE,
    gender ENUM('MALE','FEMALE','OTHER'),
    blood_group VARCHAR(5),
    marital_status ENUM('SINGLE','MARRIED','DIVORCED','WIDOWED'),
    father_name VARCHAR(200),
    mother_name VARCHAR(200),
    spouse_name VARCHAR(200),
    permanent_address TEXT,
    current_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    emergency_contact VARCHAR(20),
    emergency_person VARCHAR(200),
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    bank_name VARCHAR(200),
    bank_account_no VARCHAR(50),
    ifsc_code VARCHAR(20),
    salary_grade VARCHAR(50),
    basic_salary DECIMAL(12,2),
    staff_type ENUM('TEACHING','NON_TEACHING','ADMIN','MANAGEMENT') DEFAULT 'TEACHING',
    contract_type ENUM('PERMANENT','CONTRACTUAL','PROBATION','VISITING') DEFAULT 'PERMANENT',
    photo_url VARCHAR(500),
    resume_url VARCHAR(500),
    is_class_teacher BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Students
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    branch_id BIGINT NOT NULL,
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(20),
    class_id BIGINT,
    section_id BIGINT,
    academic_year_id BIGINT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('MALE','FEMALE','OTHER'),
    blood_group VARCHAR(5),
    nationality VARCHAR(50) DEFAULT 'Indian',
    religion VARCHAR(50),
    caste VARCHAR(50),
    category ENUM('GENERAL','OBC','SC','ST','EWS') DEFAULT 'GENERAL',
    aadhar_number VARCHAR(20),
    mother_tongue VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    photo_url VARCHAR(500),
    previous_school VARCHAR(300),
    previous_class VARCHAR(50),
    tc_number VARCHAR(50),
    admission_date DATE,
    admission_type ENUM('NEW','TRANSFER','RE_ADMISSION') DEFAULT 'NEW',
    status ENUM('ACTIVE','INACTIVE','GRADUATED','TRANSFERRED','EXPELLED','DROPOUT') DEFAULT 'ACTIVE',
    house VARCHAR(50),
    bus_route_id BIGINT,
    medical_conditions TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Parents/Guardians
CREATE TABLE parents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    father_name VARCHAR(200),
    father_phone VARCHAR(20),
    father_email VARCHAR(200),
    father_occupation VARCHAR(200),
    father_qualification VARCHAR(200),
    father_aadhar VARCHAR(20),
    father_photo_url VARCHAR(500),
    mother_name VARCHAR(200),
    mother_phone VARCHAR(20),
    mother_email VARCHAR(200),
    mother_occupation VARCHAR(200),
    mother_qualification VARCHAR(200),
    mother_aadhar VARCHAR(20),
    mother_photo_url VARCHAR(500),
    guardian_name VARCHAR(200),
    guardian_relation VARCHAR(50),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(200),
    guardian_occupation VARCHAR(200),
    guardian_address TEXT,
    annual_income DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Student-Parent Mapping
CREATE TABLE student_parents (
    student_id BIGINT NOT NULL,
    parent_id BIGINT NOT NULL,
    relationship ENUM('FATHER','MOTHER','GUARDIAN') NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (student_id, parent_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (parent_id) REFERENCES parents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Timetable
CREATE TABLE timetable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT,
    academic_year_id BIGINT,
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') NOT NULL,
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES staff(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Syllabus
CREATE TABLE syllabus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    chapter_no INT,
    description TEXT,
    topics TEXT,
    learning_objectives TEXT,
    teaching_methodology TEXT,
    resources TEXT,
    completion_status ENUM('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_students_branch ON students(branch_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_students_admission ON students(admission_no);
CREATE INDEX idx_staff_branch ON staff(branch_id);
CREATE INDEX idx_staff_employee ON staff(employee_id);
CREATE INDEX idx_timetable_class ON timetable(class_id, section_id, day_of_week);
CREATE INDEX idx_classes_branch ON classes(branch_id);
