# 🏫 DPS School Management System

Enterprise-grade School Management Website with integrated ERP System built for **Delhi Public School (CBSE)**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Backend** | Spring Boot 3.4.5, Java 17 |
| **Database** | PostgreSQL |
| **Auth** | JWT (JSON Web Tokens) + BCrypt |
| **AI** | Spring AI + Ollama (RAG) |
| **Realtime** | WebSocket (Video Calling) |

---

## 📁 Project Structure

```
SchoolManagement/
├── SchoolManagement/          # Backend (Spring Boot)
│   ├── pom.xml                # Parent POM (multi-module)
│   ├── school-common/         # Entities, DTOs
│   ├── school-api/            # REST API, Security, Controllers
│   ├── school-rag/            # AI/RAG Module (Ollama)
│   └── school-video/          # WebRTC Video Calling
│
└── sms_ui/                    # Frontend (React + Vite)
    ├── src/
    │   ├── layouts/           # PublicLayout, ERPLayout
    │   ├── context/           # AuthContext, ThemeContext
    │   ├── pages/
    │   │   ├── public/        # School Website (12 pages)
    │   │   ├── auth/          # Login
    │   │   └── erp/           # ERP Portal
    │   │       ├── admin/     # Admin Dashboard & Management
    │   │       ├── teacher/   # Teacher Portal
    │   │       ├── student/   # Student Portal
    │   │       ├── parent/    # Parent Portal
    │   │       └── modules/   # Fees, HR, Transport, Library, etc.
    │   └── components/        # Shared Components
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Java 17+**
- **PostgreSQL 14+**
- **Node.js 18+**
- **Maven 3.9+** (or use included `mvnw`)

### 1. Database Setup

```bash
# Connect to PostgreSQL and create the database
psql -U postgres -c "CREATE DATABASE dps_school_db;"
```

> Hibernate will auto-create all tables on first startup (`ddl-auto=update`).

### 2. Backend Setup

```bash
cd SchoolManagement

# Build all modules
./mvnw clean install -DskipTests

# Run the API
./mvnw spring-boot:run -pl school-api
```

Backend starts at: **http://localhost:8080**

### 3. Frontend Setup

```bash
cd sms_ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🔐 Default Login Credentials

> **Password for all accounts: `Admin@123`**

| Role | Email | Dashboard |
|------|-------|-----------|
| 🔑 Super Admin | `superadmin@dps.edu.in` | `/erp/dashboard` |
| 👨‍💼 Principal | `principal@dps.edu.in` | `/erp/dashboard` |
| 👨‍🏫 Teacher | `teacher1@dps.edu.in` | `/erp/teacher/dashboard` |
| 🎓 Student | `student1@dps.edu.in` | `/erp/student/dashboard` |
| 👨‍👩‍👧 Parent | `parent1@dps.edu.in` | `/erp/parent/dashboard` |

---

## 🌐 Public Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Hero, About, Achievements, Stats, Events, Testimonials |
| About Us | `/about` | Vision, Mission, Chairman Message, History |
| Academics | `/academics` | Programs (Nursery to Class 12), Subjects |
| Admissions | `/admissions` | Process, Documents, Online Apply |
| Achievements | `/achievements` | Academic, Sports, Olympiad Results |
| Facilities | `/facilities` | Labs, Sports, Library, Smart Classes |
| Gallery | `/gallery` | Photo & Video Gallery |
| Events | `/events` | Upcoming Events |
| News | `/news` | Latest School News |
| Careers | `/careers` | Job Openings |
| Branches | `/branches` | 3 Campus Details |
| Contact | `/contact` | Contact Form & Branch Addresses |

---

## 🏢 ERP Modules

| Module | Description | Roles |
|--------|-------------|-------|
| **Dashboard** | Analytics, Branch Performance | Admin, Principal |
| **Branch Management** | Multi-branch CRUD | Super Admin, Org Admin |
| **User Management** | All system users | Admin |
| **Student Management** | Registration, Profiles, Allocation | Admin, Principal |
| **Staff Management** | Teaching & Non-Teaching Staff | Admin, HR |
| **Attendance** | Daily Student & Staff Attendance | Teacher, Admin |
| **Examinations** | Schedule, Marks, Report Cards | Admin, Teacher |
| **Fees** | Structure, Collection, Reports | Admin, Accountant |
| **HR & Payroll** | Leave, Salary, Recruitment | HR Manager |
| **Transport** | Routes, Vehicles, GPS | Transport Manager |
| **Library** | Books, Issue/Return, Fines | Librarian |
| **Inventory** | Assets, Vendors, Procurement | Admin |
| **Communication** | Notifications, Circulars, SMS | Admin, Principal |
| **Admissions** | Online Applications, Tracking | Admin |

---

## 🔑 Role-Based Access (11 Roles)

1. **Super Admin** — Full system access across all branches
2. **Organization Admin** — Organization-level management
3. **Branch Admin** — Branch-level management
4. **Principal** — Academic oversight
5. **Teacher** — Attendance, Marks, Assignments
6. **Student** — View results, timetable, assignments
7. **Parent** — Monitor child's progress, fees
8. **Accountant** — Fee collection & reports
9. **Librarian** — Library management
10. **HR Manager** — Staff, Payroll, Leave
11. **Transport Manager** — Routes, Vehicles, Drivers

---

## 🛡️ Security Features

- ✅ JWT Authentication with refresh tokens
- ✅ BCrypt password hashing
- ✅ Role-Based Access Control (RBAC)
- ✅ Account lockout after 5 failed attempts
- ✅ CORS protection
- ✅ Audit logging
- ✅ Input validation

---

## 🎨 Design Features

- 🌗 Dark / Light Mode toggle
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 🎯 Modern UI with CSS Variables
- ⚡ Fast — Vite 8 + Virtual Threads
- ♿ Accessibility compliant

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/login          — Login
POST /api/auth/register       — Register new user
```

### Dashboard
```
GET  /api/dashboard/stats     — Dashboard statistics
```

### Branches
```
GET    /api/branches          — List all branches
POST   /api/branches          — Create branch
PUT    /api/branches/{id}     — Update branch
DELETE /api/branches/{id}     — Delete branch
```

### Students
```
GET  /api/students            — List students (paginated, searchable)
GET  /api/students/{id}      — Get student by ID
GET  /api/students/count     — Student count
```

### Staff / Teachers
```
GET    /api/teachers          — List teachers
POST   /api/teachers          — Create teacher with account
PUT    /api/teachers/{id}     — Update teacher
DELETE /api/teachers/{id}     — Deactivate teacher
```

### Attendance
```
GET  /api/attendance/student/{id}?startDate=&endDate=
GET  /api/attendance/section/{id}?date=
POST /api/attendance           — Mark attendance (bulk)
GET  /api/attendance/percentage/{studentId}?startDate=&endDate=
```

### Exams
```
GET  /api/exams               — List exams
POST /api/exams               — Create exam
PUT  /api/exams/{id}          — Update exam
```

### Fees
```
GET  /api/fees/payments       — List payments (paginated)
GET  /api/fees/student/{id}   — Student fee history
POST /api/fees/payments       — Collect fee
```

### Library
```
GET  /api/library/books       — List books (paginated, searchable)
POST /api/library/books       — Add book
```

### Transport
```
GET  /api/transport/routes    — List bus routes
POST /api/transport/routes    — Create route
```

### Communication
```
GET  /api/notifications       — List notifications
POST /api/notifications       — Send notification
```

---

## 📋 Swagger / OpenAPI

After starting the backend, access API documentation at:

```
http://localhost:8080/swagger-ui/index.html
```

---

## 🏗️ Database Schema

The system uses **50+ tables** covering:
- Organization & Branches
- Users, Roles & Permissions
- Students, Parents, Staff
- Classes, Sections, Subjects
- Attendance, Exams, Results
- Fee Structure & Payments
- HR, Payroll, Leave
- Transport, Library, Inventory
- Events, News, Achievements
- Admissions, Communication

Schema files: `src/main/resources/db/migration/V1-V7*.sql`

---

## 📄 License

This project is proprietary software for Delhi Public School.

---

## 👨‍💻 Development

```bash
# Backend hot-reload (Spring DevTools)
./mvnw spring-boot:run -pl school-api

# Frontend hot-reload
cd sms_ui && npm run dev

# Build for production
./mvnw clean package -DskipTests
cd sms_ui && npm run build
```
