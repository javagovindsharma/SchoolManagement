-- =====================================================
-- DPS School Management System - Website, Events, Achievements, Admissions
-- =====================================================

-- ===================== WEBSITE CONTENT =====================

-- Website Pages (CMS)
CREATE TABLE website_pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    content LONGTEXT,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    meta_keywords VARCHAR(500),
    featured_image_url VARCHAR(500),
    page_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Testimonials
CREATE TABLE testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    name VARCHAR(200) NOT NULL,
    designation VARCHAR(200),
    relation ENUM('PARENT','STUDENT','ALUMNI','TEACHER','OTHER') DEFAULT 'PARENT',
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    photo_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Photo Gallery
CREATE TABLE gallery_albums (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    album_type ENUM('PHOTO','VIDEO') DEFAULT 'PHOTO',
    event_date DATE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Gallery Images
CREATE TABLE gallery_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    album_id BIGINT NOT NULL,
    title VARCHAR(200),
    description VARCHAR(500),
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    media_type ENUM('IMAGE','VIDEO') DEFAULT 'IMAGE',
    video_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES gallery_albums(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Facilities
CREATE TABLE facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== EVENTS =====================

-- Events
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    event_type ENUM('ACADEMIC','CULTURAL','SPORTS','HOLIDAY','EXAM','MEETING','OTHER') DEFAULT 'ACADEMIC',
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(300),
    organizer VARCHAR(200),
    target_audience ENUM('ALL','STUDENTS','PARENTS','TEACHERS','STAFF') DEFAULT 'ALL',
    image_url VARCHAR(500),
    is_public BOOLEAN DEFAULT TRUE,
    is_holiday BOOLEAN DEFAULT FALSE,
    status ENUM('UPCOMING','ONGOING','COMPLETED','CANCELLED') DEFAULT 'UPCOMING',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News
CREATE TABLE news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image_url VARCHAR(500),
    category ENUM('ACADEMIC','SPORTS','CULTURAL','ACHIEVEMENT','GENERAL') DEFAULT 'GENERAL',
    author_id BIGINT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== ACHIEVEMENTS =====================

-- Achievements
CREATE TABLE achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    achievement_type ENUM('ACADEMIC','SPORTS','OLYMPIAD','COMPETITIVE_EXAM','CULTURAL','AWARD','CERTIFICATION','FACULTY') NOT NULL,
    category VARCHAR(100),
    student_id BIGINT,
    staff_id BIGINT,
    student_name VARCHAR(200),
    class_name VARCHAR(50),
    competition_name VARCHAR(300),
    position VARCHAR(50),
    medal ENUM('GOLD','SILVER','BRONZE','MERIT','PARTICIPATION'),
    awarded_by VARCHAR(200),
    achievement_date DATE,
    image_url VARCHAR(500),
    certificate_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    academic_year_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Top Rankers
CREATE TABLE top_rankers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    class_name VARCHAR(50),
    rank_position INT NOT NULL,
    percentage DECIMAL(5,2),
    cgpa DECIMAL(4,2),
    exam_name VARCHAR(200),
    photo_url VARCHAR(500),
    is_displayed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== ADMISSIONS =====================

-- Admission Enquiries
CREATE TABLE admission_enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    student_name VARCHAR(200) NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE','FEMALE','OTHER'),
    applying_for_class VARCHAR(50) NOT NULL,
    father_name VARCHAR(200),
    mother_name VARCHAR(200),
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(200),
    address TEXT,
    previous_school VARCHAR(300),
    source ENUM('WEBSITE','WALK_IN','REFERRAL','ADVERTISEMENT','SOCIAL_MEDIA','OTHER') DEFAULT 'WEBSITE',
    status ENUM('NEW','CONTACTED','VISIT_SCHEDULED','FORM_ISSUED','REGISTERED','REJECTED','CLOSED') DEFAULT 'NEW',
    remarks TEXT,
    assigned_to BIGINT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admission Applications
CREATE TABLE admission_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    academic_year_id BIGINT NOT NULL,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
    applying_for_class VARCHAR(50) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Indian',
    religion VARCHAR(50),
    caste VARCHAR(50),
    category ENUM('GENERAL','OBC','SC','ST','EWS') DEFAULT 'GENERAL',
    mother_tongue VARCHAR(50),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    father_name VARCHAR(200),
    father_phone VARCHAR(20),
    father_email VARCHAR(200),
    father_occupation VARCHAR(200),
    father_qualification VARCHAR(200),
    mother_name VARCHAR(200),
    mother_phone VARCHAR(20),
    mother_email VARCHAR(200),
    mother_occupation VARCHAR(200),
    mother_qualification VARCHAR(200),
    guardian_name VARCHAR(200),
    guardian_phone VARCHAR(20),
    guardian_relation VARCHAR(50),
    previous_school VARCHAR(300),
    previous_class VARCHAR(50),
    previous_percentage DECIMAL(5,2),
    tc_available BOOLEAN DEFAULT FALSE,
    special_needs TEXT,
    medical_conditions TEXT,
    photo_url VARCHAR(500),
    birth_certificate_url VARCHAR(500),
    aadhar_url VARCHAR(500),
    tc_url VARCHAR(500),
    marksheet_url VARCHAR(500),
    other_documents JSON,
    application_fee_paid BOOLEAN DEFAULT FALSE,
    payment_transaction_id VARCHAR(100),
    status ENUM('SUBMITTED','UNDER_REVIEW','SHORTLISTED','TEST_SCHEDULED','INTERVIEW_SCHEDULED','SELECTED','WAITLISTED','REJECTED','ENROLLED','CANCELLED') DEFAULT 'SUBMITTED',
    entrance_test_marks DECIMAL(6,2),
    interview_remarks TEXT,
    approved_by BIGINT,
    approval_date DATE,
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Careers/Job Postings
CREATE TABLE careers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(300) NOT NULL,
    department VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    qualification VARCHAR(500),
    experience VARCHAR(200),
    salary_range VARCHAR(100),
    location VARCHAR(200),
    job_type ENUM('FULL_TIME','PART_TIME','CONTRACT','VISITING') DEFAULT 'FULL_TIME',
    application_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_events_branch ON events(branch_id, start_date);
CREATE INDEX idx_news_published ON news(is_published, published_at);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
CREATE INDEX idx_admissions_status ON admission_applications(status);
CREATE INDEX idx_admissions_branch ON admission_applications(branch_id);
