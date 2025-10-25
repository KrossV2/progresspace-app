import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, BookOpen, MapPin, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Lesson {
  id: number;
  day: string;
  time: string;
  subjectName: string;
  teacherName: string;
  room: string;
  type: "lecture" | "practice" | "lab";
  color: string;
}

const StudentTimetablesPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string>("Dushanba");

  useEffect(() => {
    setLessons([
      // Dushanba
      { id: 1, day: "Dushanba", time: "08:00 - 08:45", subjectName: "Matematika", teacherName: "N. Karimova", room: "302", type: "lecture", color: "bg-blue-500" },
      { id: 2, day: "Dushanba", time: "09:00 - 09:45", subjectName: "Fizika", teacherName: "B. Tursunov", room: "205", type: "lecture", color: "bg-green-500" },
      { id: 3, day: "Dushanba", time: "10:00 - 10:45", subjectName: "Informatika", teacherName: "A. Saidov", room: "101", type: "lab", color: "bg-purple-500" },
      { id: 4, day: "Dushanba", time: "11:00 - 11:45", subjectName: "Ona tili", teacherName: "S. Norova", room: "410", type: "practice", color: "bg-orange-500" },
      
      // Seshanba
      { id: 5, day: "Seshanba", time: "08:00 - 08:45", subjectName: "Tarix", teacherName: "M. Qodirov", room: "315", type: "lecture", color: "bg-red-500" },
      { id: 6, day: "Seshanba", time: "09:00 - 09:45", subjectName: "Biologiya", teacherName: "Z. Xolmirzayeva", room: "208", type: "lab", color: "bg-teal-500" },
      { id: 7, day: "Seshanba", time: "10:00 - 10:45", subjectName: "Ingliz tili", teacherName: "J. Smith", room: "105", type: "practice", color: "bg-pink-500" },
      
      // Chorshanba
      { id: 8, day: "Chorshanba", time: "08:00 - 08:45", subjectName: "Matematika", teacherName: "N. Karimova", room: "302", type: "practice", color: "bg-blue-500" },
      { id: 9, day: "Chorshanba", time: "09:00 - 09:45", subjectName: "Fizika", teacherName: "B. Tursunov", room: "205", type: "lab", color: "bg-green-500" },
      { id: 10, day: "Chorshanba", time: "10:00 - 10:45", subjectName: "Geografiya", teacherName: "R. Yusupov", room: "312", type: "lecture", color: "bg-indigo-500" },
      
      // Payshanba
      { id: 11, day: "Payshanba", time: "08:00 - 08:45", subjectName: "Kimyo", teacherName: "L. Abdullayeva", room: "210", type: "lecture", color: "bg-yellow-500" },
      { id: 12, day: "Payshanba", time: "09:00 - 09:45", subjectName: "Adabiyot", teacherName: "S. Norova", room: "410", type: "practice", color: "bg-orange-500" },
      { id: 13, day: "Payshanba", time: "10:00 - 10:45", subjectName: "Jismoniy tarbiya", teacherName: "T. Rahimov", room: "Sport zal", type: "practice", color: "bg-cyan-500" },
      
      // Juma
      { id: 14, day: "Juma", time: "08:00 - 08:45", subjectName: "Informatika", teacherName: "A. Saidov", room: "101", type: "practice", color: "bg-purple-500" },
      { id: 15, day: "Juma", time: "09:00 - 09:45", subjectName: "Ingliz tili", teacherName: "J. Smith", room: "105", type: "lecture", color: "bg-pink-500" },
      { id: 16, day: "Juma", time: "10:00 - 10:45", subjectName: "Tasviriy san'at", teacherName: "D. Alimova", room: "115", type: "practice", color: "bg-rose-500" },
    ]);
  }, []);

  const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lecture": return <BookOpen className="h-4 w-4" />;
      case "practice": return <Users className="h-4 w-4" />;
      case "lab": return <MapPin className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "lecture": return "Ma'ruza";
      case "practice": return "Amaliyot";
      case "lab": return "Laboratoriya";
      default: return type;
    }
  };

  const getDayLessons = (day: string) => {
    return lessons.filter(lesson => lesson.day === day);
  };

  const getTotalLessons = () => {
    return lessons.length;
  };

  const getUniqueSubjects = () => {
    return new Set(lessons.map(lesson => lesson.subjectName)).size;
  };

  const getTodayLessons = () => {
    const today = new Date().getDay();
    const dayMap = [0, "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
    const todayName = dayMap[today] as string;
    return lessons.filter(lesson => lesson.day === todayName);
  };

  const todayLessons = getTodayLessons();

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dars Jadvali
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Haftalik darslar jadvali va ma'lumotlari
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami Darslar</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalLessons()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fanlar Soni</p>
                <p className="text-2xl font-bold text-green-600">{getUniqueSubjects()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugungi Darslar</p>
                <p className="text-2xl font-bold text-orange-600">{todayLessons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ish Kunlari</p>
                <p className="text-2xl font-bold text-purple-600">{days.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Lessons */}
      {todayLessons.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Clock className="h-5 w-5" />
              <span>Bugungi Darslar</span>
            </CardTitle>
            <CardDescription>
              Bugun bo'ladigan barcha darslar ro'yxati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayLessons.map((lesson) => (
                <Card key={lesson.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${lesson.color}`}></div>
                        <span className="font-semibold text-gray-900">{lesson.subjectName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getTypeText(lesson.type)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{lesson.teacherName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{lesson.room}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Navigation */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Oldingi
              </Button>
              <div className="text-center">
                <div className="font-semibold text-gray-900">Hafta {currentWeek + 1}</div>
                <div className="text-sm text-gray-500">10-Yanvar, 2024</div>
              </div>
              <Button variant="outline" size="sm">
                Keyingi
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Yuklab olish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Days Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => setSelectedDay(day)}
            className="flex-1 min-w-[120px]"
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getDayLessons(selectedDay).map((lesson) => (
          <Card 
            key={lesson.id} 
            className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${lesson.color}`}></div>
                  <span>{lesson.subjectName}</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {getTypeIcon(lesson.type)}
                </Badge>
              </div>
              <CardDescription className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{lesson.time}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{lesson.teacherName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{lesson.room}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{getTypeText(lesson.type)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {getDayLessons(selectedDay).length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 text-center">
          <CardContent className="p-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {selectedDay} kuni darslar yo'q
            </h3>
            <p className="text-gray-500">
              Bu kun dam olish kuni yoki darslar rejalashtirilmagan
            </p>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Ma'ruza - Nazariy dars</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Amaliyot - Mashg'ulot darsi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Laboratoriya - Tajriba darsi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTimetablesPage;