import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ChatWidget from "@/components/ChatWidget";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./pages/teacher/Dashboard";
import Profile from "./pages/Profile";
import Subjects from "./pages/Subjects";
import Schedule from "./pages/Schedule";
import Homework from "./pages/Homework";
import Grades from "./pages/Grades";
import NotFound from "./pages/NotFound";
import ThemeInitializer from "./components/ThemeInitializer";

// Admin pages
import RegionsPage from "./pages/admin/RegionsPage";
import CitiesPage from "./pages/admin/CitiesPage";
import SchoolsPage from "./pages/admin/SchoolsPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import UsersPage from "./pages/admin/UsersPage";
import DirectorsPage from "./pages/admin/DirectorsPage";

// Director pages
import DirectorClassesPage from "./pages/director/ClassesPage";
import DirectorTeachersPage from "./pages/director/TeachersPage";
import DirectorTimetablesPage from "./pages/director/TimetablesPage";
import DirectorGradeRequestsPage from "./pages/director/GradeRequestsPage";
import DirectorStatisticsPage from "./pages/director/StatisticsPage";

// Teacher pages
import TeacherHomeworksPage from "./pages/teacher/HomeworksPage";
import TeacherGradesPage from "./pages/teacher/GradesPage";
import TeacherAttendancePage from "./pages/teacher/AttendancePage";
import TeacherStudentsPage from "./pages/teacher/StudentsPage";
import TeacherParentsPage from "./pages/teacher/ParentsPage";
import FilesPage from "./pages/teacher/FilesPage";

// Student pages
import StudentGradesPage from "./pages/student/GradesPage";
import StudentAttendancePage from "./pages/student/AttendancePage";
import StudentHomeworksPage from "./pages/student/HomeworksPage";
import StudentTimetablesPage from "./pages/student/TimetablesPage";
import StudentBehaviorsPage from "./pages/student/BehaviorsPage";
import StudentNotificationsPage from "./pages/student/NotificationsPage";

// Parent pages
import ParentChildrenPage from "./pages/parent/ChildrenPage";
import ParentAttendance from "./pages/parent/AttendanceParent";
import BehaviorPage from "./pages/parent/BehaviorPage";
import GradesPage from "./pages/parent/GradesPage";
import ParentTimetable from "./pages/parent/ParentTimetable";
import AdminChatPanel from "./pages/admin/AdminChatPanel";

const queryClient = new QueryClient();

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Компонент для публичных маршрутов (редирект если уже авторизован)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Общие маршруты */}
        <Route path="/subjects" element={
          <ProtectedRoute>
            <AppLayout>
              <Subjects />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/schedule" element={
          <ProtectedRoute>
            <AppLayout>
              <Schedule />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/homework" element={
          <ProtectedRoute>
            <AppLayout>
              <Homework />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/grades" element={
          <ProtectedRoute>
            <AppLayout>
              <Grades />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/regions" element={
          <ProtectedRoute>
            <AppLayout>
              <RegionsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/cities" element={
          <ProtectedRoute>
            <AppLayout>
              <CitiesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/schools" element={
          <ProtectedRoute>
            <AppLayout>
              <SchoolsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/subjects" element={
          <ProtectedRoute>
            <AppLayout>
              <SubjectsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <AppLayout>
              <UsersPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/directors" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/chat" element={
          <ProtectedRoute>
            <AppLayout>
              <AdminChatPanel />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Director routes */}
        <Route path="/director/classes" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorClassesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/director/teachers" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorTeachersPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/director/timetables" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorTimetablesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/director/grade-requests" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorGradeRequestsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/director/statistics" element={
          <ProtectedRoute>
            <AppLayout>
              <DirectorStatisticsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Teacher routes */}
        <Route path="/teacher/homeworks" element={
          <ProtectedRoute>
            <AppLayout>
              <TeacherHomeworksPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/grades" element={
          <ProtectedRoute>
            <AppLayout>
              <TeacherGradesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/attendance" element={
          <ProtectedRoute>
            <AppLayout>
              <TeacherAttendancePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/students" element={
          <ProtectedRoute>
            <AppLayout>
              <TeacherStudentsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/parents" element={
          <ProtectedRoute>
            <AppLayout>
              <TeacherParentsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/files" element={
          <ProtectedRoute>
            <AppLayout>
              <FilesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Student routes */}
        <Route path="/student/grades" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentGradesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/attendance" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentAttendancePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/homeworks" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentHomeworksPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/timetables" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentTimetablesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/behaviors" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentBehaviorsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/student/notifications" element={
          <ProtectedRoute>
            <AppLayout>
              <StudentNotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Parent routes */}
        <Route path="/parent/children" element={
          <ProtectedRoute>
            <AppLayout>
              <ParentChildrenPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/parent/attendance" element={
          <ProtectedRoute>
            <AppLayout>
              <ParentAttendance />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/parent/behaviors" element={
          <ProtectedRoute>
            <AppLayout>
              <BehaviorPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/parent/grades" element={
          <ProtectedRoute>
            <AppLayout>
              <GradesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/parent/timetables" element={
          <ProtectedRoute>
            <AppLayout>
              <ParentTimetable />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
            <TooltipProvider>
              <ThemeInitializer />
              <Toaster />
              <Sonner />
              <ChatWidget />
              <AppContent />
            </TooltipProvider>
          </ChatProvider>
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);


export default App;