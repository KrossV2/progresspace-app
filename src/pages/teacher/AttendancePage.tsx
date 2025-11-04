import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Users, Calendar, Target, TrendingUp, BookOpen, Eye, User, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Student {
  id: number;
  name: string;
  className: string;
  status: "present" | "absent" | "late";
  lastAttendance?: string;
}

interface Lesson {
  id: number;
  subject: string;
  className: string;
  date: string;
  teacher: string;
  topic: string;
  attendance: Student[];
}

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("teacher");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentStudent, setCurrentStudent] = useState("Aziz Karimov");
  const { toast } = useToast();

  const classes = ["10-A", "9-B", "11-A", "8-V"];
  
  const studentsData: Record<string, Student[]> = {
    "10-A": [
      { id: 1, name: "Aziz Karimov", className: "10-A", status: "present", lastAttendance: "2024-01-15" },
      { id: 2, name: "Malika Tosheva", className: "10-A", status: "absent", lastAttendance: "2024-01-14" },
      { id: 3, name: "Sardor Ahmadov", className: "10-A", status: "late", lastAttendance: "2024-01-15" },
      { id: 4, name: "Dilbar Xolmirzayeva", className: "10-A", status: "present", lastAttendance: "2024-01-15" },
      { id: 5, name: "Javohir Rahimov", className: "10-A", status: "present", lastAttendance: "2024-01-15" },
      { id: 6, name: "Zarina Qodirova", className: "10-A", status: "absent", lastAttendance: "2024-01-14" }
    ],
    "9-B": [
      { id: 7, name: "Olimjon Saidov", className: "9-B", status: "present", lastAttendance: "2024-01-15" },
      { id: 8, name: "Madina Yusupova", className: "9-B", status: "late", lastAttendance: "2024-01-15" }
    ]
  };

  useEffect(() => {
    const savedLessons = localStorage.getItem('teacher-lessons');
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    }
  }, []);

  useEffect(() => {
    const currentClassStudents = studentsData[selectedClass] || [];
    
    const lastLesson = lessons
      .filter(lesson => lesson.className === selectedClass && lesson.date === selectedDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastLesson) {
      const updatedStudents = currentClassStudents.map(student => {
        const lessonAttendance = lastLesson.attendance.find(s => s.id === student.id);
        return lessonAttendance ? { ...student, status: lessonAttendance.status } : student;
      });
      setAttendance(updatedStudents);
    } else {
      setAttendance(currentClassStudents);
    }
  }, [selectedClass, lessons, selectedDate]);

  const handleStatusChange = (studentId: number, status: "present" | "absent" | "late") => {
    setAttendance(prev => prev.map(student =>
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const saveAttendance = () => {
    const existingLessonIndex = lessons.findIndex(
      lesson => lesson.className === selectedClass && lesson.date === selectedDate
    );

    const newLesson: Lesson = {
      id: existingLessonIndex !== -1 ? lessons[existingLessonIndex].id : Date.now(),
      subject: "Matematika",
      className: selectedClass,
      date: selectedDate,
      teacher: "Aliyev F.",
      topic: `${selectedClass} sinfi darsi - ${new Date(selectedDate).toLocaleDateString('uz-UZ')}`,
      attendance: attendance.map(student => ({
        ...student,
        lastAttendance: selectedDate
      }))
    };

    let updatedLessons;
    if (existingLessonIndex !== -1) {
      updatedLessons = [...lessons];
      updatedLessons[existingLessonIndex] = newLesson;
    } else {
      updatedLessons = [...lessons, newLesson];
    }

    setLessons(updatedLessons);
    localStorage.setItem('teacher-lessons', JSON.stringify(updatedLessons));

    toast({
      title: "Muvaffaqiyatli",
      description: `Davomat saqlandi! ${selectedClass} sinfi uchun ${attendance.filter(s => s.status === "present").length} ta o'quvchi qatnashdi`,
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "present": return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none";
      case "absent": return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none";
      case "late": return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-none";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-none";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4" />;
      case "absent": return <X className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStats = () => {
    const present = attendance.filter(s => s.status === "present").length;
    const absent = attendance.filter(s => s.status === "absent").length;
    const late = attendance.filter(s => s.status === "late").length;
    const total = attendance.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, late, total, attendanceRate };
  };

  const getStudentStats = () => {
    const studentLessons = lessons.filter(lesson => 
      lesson.attendance.some(student => student.name === currentStudent)
    );

    const presentLessons = studentLessons.filter(lesson => 
      lesson.attendance.some(student => 
        student.name === currentStudent && student.status === "present"
      )
    ).length;

    const lateLessons = studentLessons.filter(lesson => 
      lesson.attendance.some(student => 
        student.name === currentStudent && student.status === "late"
      )
    ).length;

    const absentLessons = studentLessons.filter(lesson => 
      lesson.attendance.some(student => 
        student.name === currentStudent && student.status === "absent"
      )
    ).length;

    const attendanceRate = studentLessons.length > 0 ? Math.round((presentLessons / studentLessons.length) * 100) : 0;

    return {
      totalLessons: studentLessons.length,
      presentLessons,
      lateLessons,
      absentLessons,
      attendanceRate
    };
  };

  const stats = getStats();
  const studentStats = getStudentStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Davomat Tizimi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              O'quvchilar davomatini boshqaring va kuzatib boring
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for Teacher/Student View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
          <TabsTrigger 
            value="teacher" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            O'qituvchi Rejimi
          </TabsTrigger>
          <TabsTrigger 
            value="student" 
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Eye className="h-4 w-4" />
            O'quvchi Ko'rinishi
          </TabsTrigger>
        </TabsList>

        {/* Teacher View */}
        <TabsContent value="teacher">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Jami O'quvchilar
                </CardTitle>
                <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                  {selectedClass} sinfi
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Qatnashganlar
                </CardTitle>
                <Check className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                  {stats.present}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                  Bugun qatnashganlar
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Kech qolganlar
                </CardTitle>
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.late}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                  Kechikkan o'quvchilar
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Davomat Foizi
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.attendanceRate}%
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                  Umumiy davomat
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters Card */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Filtrlash
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Sinf va sana bo'yicha davomatni belgilang
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-end">
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Sinfni tanlang
                  </Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Sinfni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Sana
                  </Label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  />
                </div>
                <Button 
                  onClick={saveAttendance}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-8"
                >
                  Saqlash
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Davomatni belgilash - {selectedClass} sinfi
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
                {new Date(selectedDate).toLocaleDateString('uz-UZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendance.map((student) => (
                  <Card 
                    key={student.id} 
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                            {student.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {student.className}
                          </p>
                        </div>
                        <Badge className={`font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(student.status)}`}>
                          {getStatusIcon(student.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className={`flex-1 rounded-lg transition-all duration-200 ${
                            student.status === "present" 
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                          }`}
                          onClick={() => handleStatusChange(student.id, "present")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Bor
                        </Button>
                        <Button 
                          size="sm" 
                          className={`flex-1 rounded-lg transition-all duration-200 ${
                            student.status === "late" 
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white" 
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300"
                          }`}
                          onClick={() => handleStatusChange(student.id, "late")}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Kech
                        </Button>
                        <Button 
                          size="sm" 
                          className={`flex-1 rounded-lg transition-all duration-200 ${
                            student.status === "absent" 
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white" 
                              : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                          }`}
                          onClick={() => handleStatusChange(student.id, "absent")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Yo'q
                        </Button>
                      </div>

                      {student.lastAttendance && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            So'nggi davomat: {new Date(student.lastAttendance).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-6">
            <Button 
              variant="outline"
              onClick={() => {
                setAttendance(prev => prev.map(student => ({ ...student, status: "present" })));
              }}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <Check className="h-4 w-4 mr-2" />
              Hammasi Bor
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setAttendance(prev => prev.map(student => ({ ...student, status: "absent" })));
              }}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Hammasi Yo'q
            </Button>
          </div>
        </TabsContent>

        {/* Student View */}
        <TabsContent value="student">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Statistics */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    {currentStudent}
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Sizning davomat statistikangiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Jami Darslar:</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-bold">
                      {studentStats.totalLessons}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Qatnashgan:</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none font-bold">
                      {studentStats.presentLessons}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Kech qolgan:</span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none font-bold">
                      {studentStats.lateLessons}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Qatnashmagan:</span>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none font-bold">
                      {studentStats.absentLessons}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Davomat Foizi:</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none font-bold">
                      {studentStats.attendanceRate}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-green-500" />
                    Mening Davomat Tarixim
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
                    O'qituvchi tomonidan belgilangan barcha davomat ma'lumotlari
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {lessons.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Hali hech qanday dars yuklanmagan
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        O'qituvchi dars davomatini belgilagach, bu yerda ko'rasiz
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {lessons
                        .filter(lesson => lesson.attendance.some(s => s.name === currentStudent))
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((lesson) => {
                          const studentAttendance = lesson.attendance.find(s => s.name === currentStudent);
                          return (
                            <Card 
                              key={lesson.id} 
                              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                                      {lesson.subject}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {lesson.className} • {lesson.teacher}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                                      {lesson.topic}
                                    </p>
                                  </div>
                                  <Badge className={`font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(studentAttendance?.status || "absent")}`}>
                                    {getStatusIcon(studentAttendance?.status || "absent")}
                                    {studentAttendance?.status === "present" ? "Bor" : 
                                     studentAttendance?.status === "late" ? "Kech" : "Yo'q"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(lesson.date).toLocaleDateString('uz-UZ', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {lesson.date}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add missing Label component
const Label = ({ className, children, ...props }: { className?: string; children: React.ReactNode } & React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
    {children}
  </label>
);

export default AttendancePage;