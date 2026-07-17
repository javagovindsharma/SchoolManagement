import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import ERPLayout from './layouts/ERPLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Website Pages
import Homepage from './pages/public/Homepage';
import About from './pages/public/About';
import Academics from './pages/public/Academics';
import Admissions from './pages/public/Admissions';
import Achievements from './pages/public/Achievements';
import Facilities from './pages/public/Facilities';
import Gallery from './pages/public/Gallery';
import Events from './pages/public/Events';
import NewsPage from './pages/public/NewsPage';
import Careers from './pages/public/Careers';
import Branches from './pages/public/Branches';
import Contact from './pages/public/Contact';

// Auth
import Login from './pages/auth/Login';

// Admin/Super Admin
import AdminDashboard from './pages/erp/admin/AdminDashboard';
import BranchManagement from './pages/erp/admin/BranchManagement';
import UserManagement from './pages/erp/admin/UserManagement';
import StudentManagement from './pages/erp/admin/StudentManagement';
import StaffManagement from './pages/erp/admin/StaffManagement';
import ClassManagement from './pages/erp/admin/ClassManagement';
import SubjectManagement from './pages/erp/admin/SubjectManagement';
import AcademicYears from './pages/erp/admin/AcademicYears';

// Teacher Portal
import TeacherDashboard from './pages/erp/teacher/TeacherDashboard';
import TeacherAttendance from './pages/erp/teacher/TeacherAttendance';
import TeacherMarks from './pages/erp/teacher/TeacherMarks';
import TeacherSchedule from './pages/erp/teacher/TeacherSchedule';
import TeacherAssignments from './pages/erp/teacher/TeacherAssignments';

// Student Portal
import StudentDashboard from './pages/erp/student/StudentDashboard';
import StudentAttendance from './pages/erp/student/StudentAttendance';
import StudentResults from './pages/erp/student/StudentResults';
import StudentSchedule from './pages/erp/student/StudentSchedule';
import StudentAssignments from './pages/erp/student/StudentAssignments';

// Parent Portal
import ParentDashboard from './pages/erp/parent/ParentDashboard';
import ParentAttendance from './pages/erp/parent/ParentAttendance';
import ParentFees from './pages/erp/parent/ParentFees';
import ParentResults from './pages/erp/parent/ParentResults';

// Module Pages
import FeesModule from './pages/erp/modules/FeesModule';
import ExamModule from './pages/erp/modules/ExamModule';
import HRModule from './pages/erp/modules/HRModule';
import TransportModule from './pages/erp/modules/TransportModule';
import LibraryModule from './pages/erp/modules/LibraryModule';
import InventoryModule from './pages/erp/modules/InventoryModule';
import CommunicationModule from './pages/erp/modules/CommunicationModule';
import AdmissionModule from './pages/erp/modules/AdmissionModule';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* ========== PUBLIC WEBSITE ========== */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* ========== AUTH ========== */}
            <Route path="/login" element={<Login />} />

            {/* ========== ERP PORTAL ========== */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ERPLayout />}>

              {/* Admin / Super Admin / Branch Admin / Principal */}
              <Route path="/erp/dashboard" element={<AdminDashboard />} />
              <Route path="/erp/branches" element={<BranchManagement />} />
              <Route path="/erp/users" element={<UserManagement />} />
              <Route path="/erp/students" element={<StudentManagement />} />
              <Route path="/erp/staff" element={<StaffManagement />} />
              <Route path="/erp/classes" element={<ClassManagement />} />
              <Route path="/erp/subjects" element={<SubjectManagement />} />
              <Route path="/erp/academic-years" element={<AcademicYears />} />

              {/* Teacher Portal */}
              <Route path="/erp/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/erp/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/erp/teacher/marks" element={<TeacherMarks />} />
              <Route path="/erp/teacher/schedule" element={<TeacherSchedule />} />
              <Route path="/erp/teacher/assignments" element={<TeacherAssignments />} />

              {/* Student Portal */}
              <Route path="/erp/student/dashboard" element={<StudentDashboard />} />
              <Route path="/erp/student/attendance" element={<StudentAttendance />} />
              <Route path="/erp/student/results" element={<StudentResults />} />
              <Route path="/erp/student/schedule" element={<StudentSchedule />} />
              <Route path="/erp/student/assignments" element={<StudentAssignments />} />

              {/* Parent Portal */}
              <Route path="/erp/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/erp/parent/attendance" element={<ParentAttendance />} />
              <Route path="/erp/parent/fees" element={<ParentFees />} />
              <Route path="/erp/parent/results" element={<ParentResults />} />

              {/* ERP Modules */}
              <Route path="/erp/fees/*" element={<FeesModule />} />
              <Route path="/erp/exams/*" element={<ExamModule />} />
              <Route path="/erp/hr/*" element={<HRModule />} />
              <Route path="/erp/transport" element={<TransportModule />} />
              <Route path="/erp/library/*" element={<LibraryModule />} />
              <Route path="/erp/inventory/*" element={<InventoryModule />} />
              <Route path="/erp/communication/*" element={<CommunicationModule />} />
              <Route path="/erp/admissions/*" element={<AdmissionModule />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
