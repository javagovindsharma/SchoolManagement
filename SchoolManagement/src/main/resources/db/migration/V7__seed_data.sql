-- =====================================================
-- DPS School Management System - Seed Data
-- =====================================================

-- Insert Organization
INSERT INTO organization (name, code, email, phone, board_type, established_year, motto, vision, mission) VALUES
('Delhi Public School', 'DPS', 'info@dps.edu.in', '+91-11-12345678', 'CBSE', 1949,
 'Service Before Self',
 'To nurture young minds into responsible global citizens with strong values, academic excellence, and a spirit of inquiry.',
 'To provide holistic education fostering intellectual growth, creativity, physical fitness, and moral values in a nurturing environment.');

-- Insert Branches
INSERT INTO branches (organization_id, name, code, branch_type, email, phone, city, state, pincode, principal_name, established_year, student_capacity) VALUES
(1, 'DPS Main Campus', 'DPS-MAIN', 'MAIN', 'main@dps.edu.in', '+91-11-11111111', 'New Delhi', 'Delhi', '110001', 'Dr. Rajesh Kumar', 1949, 3000),
(1, 'DPS East Campus', 'DPS-EAST', 'BRANCH', 'east@dps.edu.in', '+91-11-22222222', 'New Delhi', 'Delhi', '110092', 'Mrs. Priya Sharma', 2005, 2000),
(1, 'DPS South Campus', 'DPS-SOUTH', 'BRANCH', 'south@dps.edu.in', '+91-11-33333333', 'New Delhi', 'Delhi', '110017', 'Mr. Anil Verma', 2010, 1500);

-- Insert Roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Full system access across all branches', TRUE),
('ORG_ADMIN', 'Organization Admin', 'Organization-level administration', TRUE),
('BRANCH_ADMIN', 'Branch Admin', 'Branch-level administration', TRUE),
('PRINCIPAL', 'Principal', 'School principal with branch management', TRUE),
('TEACHER', 'Teacher', 'Teaching staff', TRUE),
('STUDENT', 'Student', 'Student portal access', TRUE),
('PARENT', 'Parent', 'Parent portal access', TRUE),
('ACCOUNTANT', 'Accountant', 'Finance and fees management', TRUE),
('LIBRARIAN', 'Librarian', 'Library management', TRUE),
('HR_MANAGER', 'HR Manager', 'Human resources management', TRUE),
('TRANSPORT_MANAGER', 'Transport Manager', 'Transport management', TRUE);

-- Insert Permissions
INSERT INTO permissions (name, module, description) VALUES
-- Dashboard
('dashboard.view', 'DASHBOARD', 'View dashboard'),
('dashboard.analytics', 'DASHBOARD', 'View analytics'),
-- Branch
('branch.view', 'BRANCH', 'View branches'),
('branch.create', 'BRANCH', 'Create branch'),
('branch.edit', 'BRANCH', 'Edit branch'),
('branch.delete', 'BRANCH', 'Delete branch'),
-- Students
('student.view', 'STUDENT', 'View students'),
('student.create', 'STUDENT', 'Create student'),
('student.edit', 'STUDENT', 'Edit student'),
('student.delete', 'STUDENT', 'Delete student'),
('student.export', 'STUDENT', 'Export student data'),
-- Teachers
('teacher.view', 'TEACHER', 'View teachers'),
('teacher.create', 'TEACHER', 'Create teacher'),
('teacher.edit', 'TEACHER', 'Edit teacher'),
('teacher.delete', 'TEACHER', 'Delete teacher'),
-- Academic
('academic.view', 'ACADEMIC', 'View academic data'),
('academic.manage', 'ACADEMIC', 'Manage academic structure'),
('timetable.manage', 'ACADEMIC', 'Manage timetable'),
-- Attendance
('attendance.view', 'ATTENDANCE', 'View attendance'),
('attendance.mark', 'ATTENDANCE', 'Mark attendance'),
('attendance.report', 'ATTENDANCE', 'View attendance reports'),
-- Exams
('exam.view', 'EXAM', 'View exams'),
('exam.create', 'EXAM', 'Create exams'),
('exam.marks_entry', 'EXAM', 'Enter marks'),
('exam.report_card', 'EXAM', 'Generate report cards'),
-- Fees
('fees.view', 'FEES', 'View fees'),
('fees.collect', 'FEES', 'Collect fees'),
('fees.structure', 'FEES', 'Manage fee structure'),
('fees.report', 'FEES', 'View fee reports'),
-- HR
('hr.view', 'HR', 'View HR data'),
('hr.manage', 'HR', 'Manage HR'),
('payroll.manage', 'HR', 'Manage payroll'),
('leave.manage', 'HR', 'Manage leaves'),
-- Transport
('transport.view', 'TRANSPORT', 'View transport'),
('transport.manage', 'TRANSPORT', 'Manage transport'),
-- Library
('library.view', 'LIBRARY', 'View library'),
('library.manage', 'LIBRARY', 'Manage library'),
-- Inventory
('inventory.view', 'INVENTORY', 'View inventory'),
('inventory.manage', 'INVENTORY', 'Manage inventory'),
-- Communication
('notification.send', 'COMMUNICATION', 'Send notifications'),
('circular.manage', 'COMMUNICATION', 'Manage circulars'),
('message.send', 'COMMUNICATION', 'Send messages'),
-- Admission
('admission.view', 'ADMISSION', 'View admissions'),
('admission.manage', 'ADMISSION', 'Manage admissions'),
-- Website
('website.manage', 'WEBSITE', 'Manage website content'),
('gallery.manage', 'WEBSITE', 'Manage gallery'),
('events.manage', 'WEBSITE', 'Manage events'),
('news.manage', 'WEBSITE', 'Manage news');

-- Assign all permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Assign org-level permissions to ORG_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name NOT IN ('branch.delete');

-- Assign branch-level permissions to BRANCH_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE module NOT IN ('BRANCH') OR name = 'branch.view';

-- Insert Academic Years
INSERT INTO academic_years (branch_id, name, start_date, end_date, is_current) VALUES
(1, '2025-2026', '2025-04-01', '2026-03-31', TRUE),
(2, '2025-2026', '2025-04-01', '2026-03-31', TRUE),
(3, '2025-2026', '2025-04-01', '2026-03-31', TRUE);

-- Insert Default Users (password: Admin@123)
INSERT INTO users (username, email, password_hash, role_id, branch_id, first_name, last_name, phone, is_active, is_email_verified) VALUES
('superadmin', 'superadmin@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, NULL, 'Super', 'Admin', '+91-9999900000', TRUE, TRUE),
('orgadmin', 'orgadmin@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, NULL, 'Org', 'Admin', '+91-9999900001', TRUE, TRUE),
('branchadmin', 'branchadmin@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, 1, 'Branch', 'Admin', '+91-9999900002', TRUE, TRUE),
('principal', 'principal@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 4, 1, 'Dr. Rajesh', 'Kumar', '+91-9999900003', TRUE, TRUE),
('teacher1', 'teacher1@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 5, 1, 'Anita', 'Gupta', '+91-9999900004', TRUE, TRUE),
('student1', 'student1@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 6, 1, 'Rahul', 'Sharma', '+91-9999900005', TRUE, TRUE),
('parent1', 'parent1@dps.edu.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 7, 1, 'Vikram', 'Sharma', '+91-9999900006', TRUE, TRUE);

-- Insert Classes for Main Branch
INSERT INTO classes (branch_id, name, numeric_name, display_order, is_active) VALUES
(1, 'Nursery', 0, 1, TRUE),
(1, 'LKG', 0, 2, TRUE),
(1, 'UKG', 0, 3, TRUE),
(1, 'Class 1', 1, 4, TRUE),
(1, 'Class 2', 2, 5, TRUE),
(1, 'Class 3', 3, 6, TRUE),
(1, 'Class 4', 4, 7, TRUE),
(1, 'Class 5', 5, 8, TRUE),
(1, 'Class 6', 6, 9, TRUE),
(1, 'Class 7', 7, 10, TRUE),
(1, 'Class 8', 8, 11, TRUE),
(1, 'Class 9', 9, 12, TRUE),
(1, 'Class 10', 10, 13, TRUE),
(1, 'Class 11', 11, 14, TRUE),
(1, 'Class 12', 12, 15, TRUE);

-- Insert Sections for Class 10
INSERT INTO sections (class_id, name, capacity) VALUES
(13, 'A', 40), (13, 'B', 40), (13, 'C', 40), (13, 'D', 40);

-- Insert Subjects
INSERT INTO subjects (branch_id, name, code, subject_type, category) VALUES
(1, 'English', 'ENG', 'THEORY', 'CORE'),
(1, 'Hindi', 'HIN', 'THEORY', 'CORE'),
(1, 'Mathematics', 'MAT', 'THEORY', 'CORE'),
(1, 'Science', 'SCI', 'BOTH', 'CORE'),
(1, 'Social Science', 'SST', 'THEORY', 'CORE'),
(1, 'Computer Science', 'CS', 'BOTH', 'ELECTIVE'),
(1, 'Physical Education', 'PE', 'PRACTICAL', 'CORE'),
(1, 'Art & Craft', 'ART', 'PRACTICAL', 'OPTIONAL'),
(1, 'Music', 'MUS', 'PRACTICAL', 'OPTIONAL'),
(1, 'Sanskrit', 'SKT', 'THEORY', 'OPTIONAL');

-- Insert Fee Categories
INSERT INTO fee_categories (branch_id, name, frequency, is_recurring) VALUES
(1, 'Tuition Fee', 'MONTHLY', TRUE),
(1, 'Admission Fee', 'ONE_TIME', FALSE),
(1, 'Annual Fee', 'YEARLY', TRUE),
(1, 'Transport Fee', 'MONTHLY', TRUE),
(1, 'Lab Fee', 'YEARLY', TRUE),
(1, 'Library Fee', 'YEARLY', TRUE),
(1, 'Sports Fee', 'YEARLY', TRUE),
(1, 'Exam Fee', 'HALF_YEARLY', TRUE);

-- Insert Leave Types
INSERT INTO leave_types (branch_id, name, code, max_days_per_year, is_paid, applicable_to) VALUES
(1, 'Casual Leave', 'CL', 12, TRUE, 'ALL'),
(1, 'Sick Leave', 'SL', 10, TRUE, 'ALL'),
(1, 'Earned Leave', 'EL', 30, TRUE, 'ALL'),
(1, 'Maternity Leave', 'ML', 180, TRUE, 'ALL'),
(1, 'Paternity Leave', 'PL', 15, TRUE, 'ALL'),
(1, 'Unpaid Leave', 'UL', 30, FALSE, 'ALL');

-- Insert Exam Types
INSERT INTO exam_types (branch_id, name, description, weightage, academic_year_id) VALUES
(1, 'Unit Test 1', 'First Unit Test', 10.00, 1),
(1, 'Unit Test 2', 'Second Unit Test', 10.00, 1),
(1, 'Half Yearly', 'Half Yearly Examination', 30.00, 1),
(1, 'Unit Test 3', 'Third Unit Test', 10.00, 1),
(1, 'Unit Test 4', 'Fourth Unit Test', 10.00, 1),
(1, 'Annual', 'Annual Examination', 30.00, 1);

-- Insert Grading System (CBSE)
INSERT INTO grading_systems (branch_id, name, min_marks, max_marks, grade, grade_point, remarks) VALUES
(1, 'CBSE Grade', 91, 100, 'A1', 10.0, 'Outstanding'),
(1, 'CBSE Grade', 81, 90, 'A2', 9.0, 'Excellent'),
(1, 'CBSE Grade', 71, 80, 'B1', 8.0, 'Very Good'),
(1, 'CBSE Grade', 61, 70, 'B2', 7.0, 'Good'),
(1, 'CBSE Grade', 51, 60, 'C1', 6.0, 'Above Average'),
(1, 'CBSE Grade', 41, 50, 'C2', 5.0, 'Average'),
(1, 'CBSE Grade', 33, 40, 'D', 4.0, 'Below Average'),
(1, 'CBSE Grade', 0, 32, 'E', 0.0, 'Needs Improvement');
