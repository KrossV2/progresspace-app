import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Users, Calendar, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  name: string;
  className: string;
  status: "present" | "absent" | "late";
  lastAttendance?: string;
}

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
    setAttendance(studentsData[selectedClass] || []);
  }, [selectedClass]);

  const handleStatusChange = (studentId: number, status: "present" | "absent" | "late") => {
    setAttendance(prev => prev.map(student =>
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const saveAttendance = () => {
    toast({
      title: "Muvaffaqiyatli",
      description: "Davomat ma'lumotlari saqlandi",
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

  const stats = getStats();

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
    </div>
  );
};

export default AttendancePage;