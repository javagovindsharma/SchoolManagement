import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
 
import Login from './pages/Login';
 
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentList    from './pages/admin/students/StudentList';
import StudentAdd     from './pages/admin/students/StudentAdd';
import StudentEdit    from './pages/admin/students/StudentEdit';
import TeacherList    from './pages/admin/teachers/TeacherList';
import TeacherAdd     from './pages/admin/teachers/TeacherAdd';
import TeacherEdit    from './pages/admin/teachers/Teacheredit';
import ClassList      from './pages/admin/classes/ClassList';
import ClassAdd       from './pages/admin/classes/ClassAdd';
import ClassEdit      from './pages/admin/classes/ClassEdit';
import SubjectList    from './pages/admin/subjects/SubjectList';
import Announcements  from './pages/admin/announcements/Announcements';
import Reports        from './pages/admin/reports/Reports';
import BookUpload     from './pages/admin/books/BookUpload';
import AdminAiChat   from './pages/admin/ai/AdminAiChat';
 
// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Attendance       from './pages/teacher/Attendance';
import Marks            from './pages/teacher/Marks';
import Schedule         from './pages/teacher/Schedule';
import Requests         from './pages/teacher/Requests';
import QuizManage      from './pages/teacher/QuizManage';
import QuizEdit        from './pages/teacher/QuizEdit';
 
// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance     from './pages/student/MyAttendance';
import MyMarks          from './pages/student/MyMarks';
import MySchedule       from './pages/student/MySchedule';
import MyRequests       from './pages/student/MyRequests';
import AiChat           from './pages/student/AiChat';
import MyQuizzes        from './pages/student/MyQuizzes';
 
// Video Call (shared across roles)
import VideoCall        from './pages/video/VideoCall';
 
function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}
 
function AdminRoute({ children }) {
  return <ProtectedRoute role="Admin"><Layout>{children}</Layout></ProtectedRoute>;
}
function TeacherRoute({ children }) {
  return <ProtectedRoute role="Teacher"><Layout>{children}</Layout></ProtectedRoute>;
}
function StudentRoute({ children }) {
  return <ProtectedRoute role="Student"><Layout>{children}</Layout></ProtectedRoute>;
}
 
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"       element={<Navigate to="/login" />} />
          <Route path="/login"  element={<Login />} />{/* Redirects for wrong URLs */}
          <Route path="/students"  element={<Navigate to="/admin/students" />} />
          <Route path="/teachers"  element={<Navigate to="/admin/teachers" />} />
          <Route path="/classes"   element={<Navigate to="/admin/classes" />} />
          <Route path="/subjects"  element={<Navigate to="/admin/subjects" />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />
 
 
          {/* Admin */}
          <Route path="/admin/dashboard"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/students"      element={<AdminRoute><StudentList /></AdminRoute>} />
          <Route path="/admin/students/add"  element={<AdminRoute><StudentAdd /></AdminRoute>} />
          <Route path="/admin/students/edit/:id" element={<AdminRoute><StudentEdit /></AdminRoute>} />
          <Route path="/admin/teachers"      element={<AdminRoute><TeacherList /></AdminRoute>} />
          <Route path="/admin/teachers/add"  element={<AdminRoute><TeacherAdd /></AdminRoute>} />
          <Route path="/admin/teachers/edit/:id" element={<AdminRoute><TeacherEdit /></AdminRoute>} />
          <Route path="/admin/classes"       element={<AdminRoute><ClassList /></AdminRoute>} />
          <Route path="/admin/classes/add"   element={<AdminRoute><ClassAdd /></AdminRoute>} />
          <Route path="/admin/classes/edit/:id" element={<AdminRoute><ClassEdit /></AdminRoute>} />
          <Route path="/admin/subjects"      element={<AdminRoute><SubjectList /></AdminRoute>} />
          <Route path="/admin/announcements" element={<AdminRoute><Announcements /></AdminRoute>} />
          <Route path="/admin/reports"       element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/admin/books/upload"  element={<AdminRoute><BookUpload /></AdminRoute>} />
          <Route path="/admin/ai-chat"       element={<AdminRoute><AdminAiChat /></AdminRoute>} />
          <Route path="/admin/video-call"    element={<AdminRoute><VideoCall /></AdminRoute>} />
 
          {/* Teacher */}
          <Route path="/teacher/dashboard"  element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
          <Route path="/teacher/attendance" element={<TeacherRoute><Attendance /></TeacherRoute>} />
          <Route path="/teacher/marks"      element={<TeacherRoute><Marks /></TeacherRoute>} />
          <Route path="/teacher/schedule"   element={<TeacherRoute><Schedule /></TeacherRoute>} />
          <Route path="/teacher/requests"   element={<TeacherRoute><Requests /></TeacherRoute>} />
          <Route path="/teacher/quizzes"    element={<TeacherRoute><QuizManage /></TeacherRoute>} />
          <Route path="/teacher/quizzes/edit/:id" element={<TeacherRoute><QuizEdit /></TeacherRoute>} />
          <Route path="/teacher/video-call" element={<TeacherRoute><VideoCall /></TeacherRoute>} />
 
          {/* Student */}
          <Route path="/student/dashboard"  element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/student/attendance" element={<StudentRoute><MyAttendance /></StudentRoute>} />
          <Route path="/student/marks"      element={<StudentRoute><MyMarks /></StudentRoute>} />
          <Route path="/student/schedule"   element={<StudentRoute><MySchedule /></StudentRoute>} />
          <Route path="/student/requests"   element={<StudentRoute><MyRequests /></StudentRoute>} />
          <Route path="/student/ai-chat"    element={<StudentRoute><AiChat /></StudentRoute>} />
          <Route path="/student/quizzes"    element={<StudentRoute><MyQuizzes /></StudentRoute>} />
          <Route path="/student/video-call" element={<StudentRoute><VideoCall /></StudentRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}