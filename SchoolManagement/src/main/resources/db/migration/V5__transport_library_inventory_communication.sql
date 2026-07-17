-- =====================================================
-- DPS School Management System - Transport, Library, Inventory, Communication
-- =====================================================

-- ===================== TRANSPORT =====================

-- Vehicles
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type ENUM('BUS','VAN','CAR','AUTO') DEFAULT 'BUS',
    make VARCHAR(100),
    model VARCHAR(100),
    year_of_manufacture INT,
    seating_capacity INT,
    fuel_type ENUM('DIESEL','PETROL','CNG','ELECTRIC') DEFAULT 'DIESEL',
    insurance_number VARCHAR(100),
    insurance_expiry DATE,
    fitness_expiry DATE,
    permit_expiry DATE,
    gps_device_id VARCHAR(100),
    status ENUM('ACTIVE','MAINTENANCE','RETIRED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Drivers
CREATE TABLE drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE,
    address TEXT,
    photo_url VARCHAR(500),
    aadhar_number VARCHAR(20),
    blood_group VARCHAR(5),
    experience_years INT,
    status ENUM('ACTIVE','INACTIVE','ON_LEAVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bus Routes
CREATE TABLE bus_routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    route_number VARCHAR(20),
    vehicle_id BIGINT,
    driver_id BIGINT,
    conductor_name VARCHAR(200),
    conductor_phone VARCHAR(20),
    start_location VARCHAR(300),
    end_location VARCHAR(300),
    total_distance_km DECIMAL(6,2),
    estimated_time_minutes INT,
    monthly_fee DECIMAL(10,2),
    max_students INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Route Stops
CREATE TABLE route_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_name VARCHAR(200) NOT NULL,
    stop_order INT NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    FOREIGN KEY (route_id) REFERENCES bus_routes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Student Transport Allocation
CREATE TABLE student_transport (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    stop_id BIGINT,
    academic_year_id BIGINT NOT NULL,
    pickup_type ENUM('BOTH','PICKUP_ONLY','DROP_ONLY') DEFAULT 'BOTH',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (route_id) REFERENCES bus_routes(id),
    FOREIGN KEY (stop_id) REFERENCES route_stops(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== LIBRARY =====================

-- Book Categories
CREATE TABLE book_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    parent_category_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (parent_category_id) REFERENCES book_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Books
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    category_id BIGINT,
    title VARCHAR(300) NOT NULL,
    isbn VARCHAR(20),
    author VARCHAR(200),
    publisher VARCHAR(200),
    edition VARCHAR(50),
    year_published INT,
    language VARCHAR(50) DEFAULT 'English',
    pages INT,
    price DECIMAL(10,2),
    rack_number VARCHAR(20),
    shelf_number VARCHAR(20),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    description TEXT,
    cover_image_url VARCHAR(500),
    is_digital BOOLEAN DEFAULT FALSE,
    digital_url VARCHAR(500),
    status ENUM('AVAILABLE','ALL_ISSUED','DAMAGED','LOST') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (category_id) REFERENCES book_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Book Issues
CREATE TABLE book_issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    issued_to_type ENUM('STUDENT','STAFF') NOT NULL,
    issued_to_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(8,2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    status ENUM('ISSUED','RETURNED','OVERDUE','LOST') DEFAULT 'ISSUED',
    issued_by BIGINT,
    returned_to BIGINT,
    remarks VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (issued_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== INVENTORY =====================

-- Asset Categories
CREATE TABLE asset_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    depreciation_rate DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assets
CREATE TABLE assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    category_id BIGINT,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 1,
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    current_value DECIMAL(12,2),
    vendor_id BIGINT,
    location VARCHAR(200),
    assigned_to VARCHAR(200),
    warranty_expiry DATE,
    condition_status ENUM('NEW','GOOD','FAIR','POOR','DAMAGED','DISPOSED') DEFAULT 'NEW',
    status ENUM('ACTIVE','MAINTENANCE','DISPOSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (category_id) REFERENCES asset_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vendors
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(200),
    address TEXT,
    gst_number VARCHAR(20),
    pan_number VARCHAR(20),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Purchase Orders
CREATE TABLE purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery DATE,
    total_amount DECIMAL(12,2),
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(12,2),
    status ENUM('DRAFT','SUBMITTED','APPROVED','ORDERED','RECEIVED','CANCELLED') DEFAULT 'DRAFT',
    approved_by BIGINT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== COMMUNICATION =====================

-- Notifications
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('SMS','EMAIL','PUSH','IN_APP') NOT NULL,
    target_type ENUM('ALL','BRANCH','CLASS','SECTION','INDIVIDUAL','ROLE') NOT NULL,
    target_id VARCHAR(100),
    priority ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
    status ENUM('DRAFT','SENT','FAILED','SCHEDULED') DEFAULT 'DRAFT',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    sent_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (sent_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Notifications (inbox)
CREATE TABLE user_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_id BIGINT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (notification_id) REFERENCES notifications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Circulars
CREATE TABLE circulars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    circular_number VARCHAR(50),
    circular_date DATE NOT NULL,
    target_audience ENUM('ALL','STUDENTS','PARENTS','TEACHERS','STAFF') NOT NULL,
    file_url VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    published_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (published_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Messages (Parent-Teacher Communication)
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    subject VARCHAR(300),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    parent_message_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (parent_message_id) REFERENCES messages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_book_issues_status ON book_issues(status);
CREATE INDEX idx_notifications_target ON notifications(target_type, target_id);
CREATE INDEX idx_user_notifications ON user_notifications(user_id, is_read);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX idx_student_transport ON student_transport(student_id);
