import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Subjects from "./pages/Subjects";
import Schedule from "./pages/Schedule";
import Homework from "./pages/Homework";
import Grades from "./pages/Grades";
import NotFound from "./pages/NotFound";

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

// Student pages
import StudentGradesPage from "./pages/student/GradesPage";

// Parent pages
import ParentChildrenPage from "./pages/parent/ChildrenPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/homework" element={<Homework />} />
                <Route path="/grades" element={<Grades />} />
                
                {/* Admin routes */}
                <Route path="/admin/regions" element={<RegionsPage />} />
                <Route path="/admin/cities" element={<CitiesPage />} />
                <Route path="/admin/schools" element={<SchoolsPage />} />
                <Route path="/admin/subjects" element={<SubjectsPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/directors" element={<DirectorsPage />} />
                
                {/* Director routes */}
                <Route path="/director/classes" element={<DirectorClassesPage />} />
                <Route path="/director/teachers" element={<DirectorTeachersPage />} />
                <Route path="/director/timetables" element={<DirectorTimetablesPage />} />
                <Route path="/director/grade-requests" element={<DirectorGradeRequestsPage />} />
                <Route path="/director/statistics" element={<DirectorStatisticsPage />} />
                
                {/* Teacher routes */}
                <Route path="/teacher/homeworks" element={<TeacherHomeworksPage />} />
                <Route path="/teacher/grades" element={<TeacherGradesPage />} />
                <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
                
                {/* Student routes */}
                <Route path="/student/grades" element={<StudentGradesPage />} />
                
                {/* Parent routes */}
                <Route path="/parent/children" element={<ParentChildrenPage />} />
                
                {/* Role-specific routes - TODO: Create these pages */}
                <Route path="/students" element={<NotFound />} />
                <Route path="/teachers" element={<NotFound />} />
                <Route path="/classes" element={<NotFound />} />
                <Route path="/reports" element={<NotFound />} />
                <Route path="/settings" element={<NotFound />} />
                <Route path="/announcements" element={<NotFound />} />
                <Route path="/attendance" element={<NotFound />} />
                <Route path="/children" element={<NotFound />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;