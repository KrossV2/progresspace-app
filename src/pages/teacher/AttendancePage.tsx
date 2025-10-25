import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Users, Calendar, Target, TrendingUp, BookOpen, Eye, User } from "lucide-react";
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
  const [currentStudent, setCurrentStudent] = useState("Aziz Karimov"); // Текущий ученик
  const { toast } = useToast();

  const classes = ["10-A", "9-B", "11-A", "8-V"];
  
  // Данные учеников по классам
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

  // Загружаем уроки из localStorage при загрузке
  useEffect(() => {
    const savedLessons = localStorage.getItem('teacher-lessons');
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    }
  }, []);

  // Синхронизация данных учеников с сохраненными уроками
  useEffect(() => {
    const currentClassStudents = studentsData[selectedClass] || [];
    
    // Находим последний урок для этого класса
    const lastLesson = lessons
      .filter(lesson => lesson.className === selectedClass && lesson.date === selectedDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastLesson) {
      // Обновляем статусы учеников из последнего урока
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
    // Проверяем, есть ли уже урок на эту дату и класс
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
      // Обновляем существующий урок
      updatedLessons = [...lessons];
      updatedLessons[existingLessonIndex] = newLesson;
    } else {
      // Добавляем новый урок
      updatedLessons = [...lessons, newLesson];
    }

    setLessons(updatedLessons);
    localStorage.setItem('teacher-lessons', JSON.stringify(updatedLessons));

    toast({
      title: "Muvaffaqiyatli",
      description: `Davomat saqlandi! ${selectedClass} sinfi uchun ${attendance.filter(s => s.status === "present").length} ta o'quvchi qatnashdi`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "absent": return "bg-red-100 text-red-800 border-red-200";
      case "late": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-4 w-4" />;
      case "absent": return <X className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      default: return null;
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

  // Статистика для ученика
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Davomat Tizimi
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              O'quvchilar davomatini boshqaring va kuzatib boring
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for Teacher/Student View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teacher" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            O'qituvchi Rejimi
          </TabsTrigger>
          <TabsTrigger value="student" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            O'quvchi Ko'rinishi
          </TabsTrigger>
        </TabsList>

        {/* Teacher View */}
        <TabsContent value="teacher">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Jami O'quvchilar</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Qatnashganlar</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.present}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Kech qolganlar</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.late}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Davomat Foizi</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.attendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle>Filtrlash</CardTitle>
              <CardDescription>
                Sinf va sana bo'yicha davomatni belgilang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Sinfni tanlang</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium mb-2 block">Sana</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={saveAttendance} className="bg-blue-600 hover:bg-blue-700">
                    Saqlash
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Davomatni belgilash - {selectedClass} sinfi</CardTitle>
              <CardDescription>
                {new Date(selectedDate).toLocaleDateString('uz-UZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendance.map((student) => (
                  <Card 
                    key={student.id} 
                    className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{student.name}</h3>
                          <p className="text-sm text-slate-600">{student.className}</p>
                        </div>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusIcon(student.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className={`flex-1 ${
                            student.status === "present" 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                          onClick={() => handleStatusChange(student.id, "present")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Bor
                        </Button>
                        <Button 
                          size="sm" 
                          className={`flex-1 ${
                            student.status === "late" 
                              ? "bg-orange-600 hover:bg-orange-700" 
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          }`}
                          onClick={() => handleStatusChange(student.id, "late")}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Kech
                        </Button>
                        <Button 
                          size="sm" 
                          className={`flex-1 ${
                            student.status === "absent" 
                              ? "bg-red-600 hover:bg-red-700" 
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                          onClick={() => handleStatusChange(student.id, "absent")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Yo'q
                        </Button>
                      </div>

                      {student.lastAttendance && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500">
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
            >
              <Check className="h-4 w-4 mr-2" />
              Hammasi Bor
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setAttendance(prev => prev.map(student => ({ ...student, status: "absent" })));
              }}
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
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    {currentStudent}
                  </CardTitle>
                  <CardDescription>
                    Sizning davomat statistikangiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Jami Darslar:</span>
                    <Badge variant="secondary">{studentStats.totalLessons}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Qatnashgan:</span>
                    <Badge variant="default" className="bg-green-600">{studentStats.presentLessons}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span>Kech qolgan:</span>
                    <Badge variant="default" className="bg-orange-600">{studentStats.lateLessons}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Qatnashmagan:</span>
                    <Badge variant="default" className="bg-red-600">{studentStats.absentLessons}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span>Davomat Foizi:</span>
                    <Badge variant="default" className="bg-purple-600">{studentStats.attendanceRate}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lessons List */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Mening Davomat Tarixim
                  </CardTitle>
                  <CardDescription>
                    O'qituvchi tomonidan belgilangan barcha davomat ma'lumotlari
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lessons.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>Hali hech qanday dars yuklanmagan</p>
                      <p className="text-sm mt-2">O'qituvchi dars davomatini belgilagach, bu yerda ko'rasiz</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {lessons
                        .filter(lesson => lesson.attendance.some(s => s.name === currentStudent))
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((lesson) => {
                          const studentAttendance = lesson.attendance.find(s => s.name === currentStudent);
                          return (
                            <Card key={lesson.id} className="border-slate-200 hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-semibold text-slate-900">{lesson.subject}</h3>
                                    <p className="text-sm text-slate-600">
                                      {lesson.className} • {lesson.teacher} • {lesson.topic}
                                    </p>
                                  </div>
                                  <Badge className={getStatusColor(studentAttendance?.status || "absent")}>
                                    {getStatusIcon(studentAttendance?.status || "absent")}
                                    {studentAttendance?.status === "present" ? "Bor" : 
                                     studentAttendance?.status === "late" ? "Kech" : "Yo'q"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(lesson.date).toLocaleDateString('uz-UZ', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">
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

export default AttendancePage;