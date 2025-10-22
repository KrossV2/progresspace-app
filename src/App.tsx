import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { ChatProvider } from "@/contexts/ChatContext"; // Импортируем ChatProvider
import ChatWidget from "@/components/ChatWidget";
import Dashboard from "./pages/teacher/Dashboard";
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
import TeacherStudentsPage from "./pages/teacher/StudentsPage";
import TeacherParentsPage from "./pages/teacher/ParentsPage";

// Student pages
import StudentGradesPage from "./pages/student/GradesPage";
import StudentAttendancePage from "./pages/student/AttendancePage";
import StudentHomeworksPage from "./pages/student/HomeworksPage";
import StudentTimetablesPage from "./pages/student/TimetablesPage";
import StudentBehaviorsPage from "./pages/student/BehaviorsPage";
import StudentNotificationsPage from "./pages/student/NotificationsPage";

// Parent pages
import ParentChildrenPage from "./pages/parent/ChildrenPage";
import ParentAttendance from "./pages/parent/AttendanceParent"
import BehaviorPage from "./pages/parent/BehaviorPage";
import GradesPage from "./pages/parent/GradesPage";
import ParentTimetable from "./pages/parent/ParentTimetable"
import AdminChatPanel from "./pages/admin/AdminChatPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ChatProvider>
              {/* ChatWidget должен быть ВНЕ AppLayout для порталов */}
              <ChatWidget />
              <AppLayout>
                <Routes>
                  {/* ... все ваши роуты ... */}
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
                  <Route path="/teacher/students" element={<TeacherStudentsPage />} />
                  <Route path="/teacher/parents" element={<TeacherParentsPage />} />
                  <Route path="/admin/chat" element={<AdminChatPanel />} />
                  
                  {/* Student routes */}
                  <Route path="/student/grades" element={<StudentGradesPage />} />
                  <Route path="/student/attendance" element={<StudentAttendancePage />} />
                  <Route path="/student/homeworks" element={<StudentHomeworksPage />} />
                  <Route path="/student/timetables" element={<StudentTimetablesPage />} />
                  <Route path="/student/behaviors" element={<StudentBehaviorsPage />} />
                  <Route path="/student/notifications" element={<StudentNotificationsPage />} />
                  
                  {/* Parent routes */}
                  <Route path="/parent/children" element={<ParentChildrenPage />}/>
                  <Route path="/parent/attendance" element={<ParentAttendance />}/>
                  <Route path="/parent/behaviors" element={<BehaviorPage />}/>
                  <Route path='/parent/grades' element={<GradesPage/>}/>
                  <Route path='/parent/timetables' element={<ParentTimetable/>}/>
                  

                  {/* Role-specific routes */}
                  <Route path="/students" element={<NotFound />} />
                  <Route path="/teachers" element={<NotFound />} />
                  <Route path="/classes" element={<NotFound />} />
                  <Route path="/reports" element={<NotFound />} />
                  <Route path="/settings" element={<NotFound />} />
                  <Route path="/announcements" element={<NotFound />} />
                  <Route path="/attendance" element={<NotFound />} />
                  <Route path="/children" element={<NotFound />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </ChatProvider>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;