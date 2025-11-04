import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, TrendingUp, User, Target, Clock } from "lucide-react";

interface AttendanceRow {
  id: number;
  date: string;
  subjectName: string;
  status: "present" | "absent" | "late";
}

const StudentAttendancePage = () => {
  const [rows, setRows] = useState<AttendanceRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, date: "2024-01-10", subjectName: "Matematika", status: "present" },
      { id: 2, date: "2024-01-11", subjectName: "Fizika", status: "late" },
      { id: 3, date: "2024-01-12", subjectName: "Ona tili", status: "absent" },
      { id: 4, date: "2024-01-15", subjectName: "Tarix", status: "present" },
      { id: 5, date: "2024-01-16", subjectName: "Biologiya", status: "present" },
      { id: 6, date: "2024-01-17", subjectName: "Geografiya", status: "late" },
      { id: 7, date: "2024-01-18", subjectName: "Ingliz tili", status: "present" },
      { id: 8, date: "2024-01-19", subjectName: "Kimyo", status: "present" },
    ]);
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "present": return "default";
      case "late": return "secondary";
      case "absent": return "destructive";
      default: return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "present": return "Kelgan";
      case "late": return "Kechikkan";
      case "absent": return "Kelmagan";
      default: return status;
    }
  };

  // Статистика посещаемости
  const totalClasses = rows.length;
  const presentClasses = rows.filter(r => r.status === "present").length;
  const lateClasses = rows.filter(r => r.status === "late").length;
  const absentClasses = rows.filter(r => r.status === "absent").length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Davomat Ma'lumotlari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Sizning so'nggi davomat statistikangiz va tarixingiz
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-800">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Aliyev Aziz</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">9-A sinf</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Umumiy Davomat
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {attendanceRate}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Darslarning {presentClasses}/{totalClasses}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Darslar
            </CardTitle>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalClasses}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              So'nggi 2 hafta davomida
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kech Qolgan
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {lateClasses}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Darslarga kech qolishlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sababsiz Darslar
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {absentClasses}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Qatnashmagan darslar soni
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Davomat Jadvali
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            So'nggi 2 hafta davomidagi darslarga qatnashish tarixi
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sana</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fan</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{row.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">{row.subjectName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Badge 
                      className={`
                        font-semibold px-3 py-1 rounded-full border-none
                        ${row.status === "present" ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800" : ""}
                        ${row.status === "late" ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800" : ""}
                        ${row.status === "absent" ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800" : ""}
                      `}
                    >
                      {getStatusText(row.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Holatlar Tushuntirishi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">Kelgan</p>
                <p className="text-sm text-green-600 dark:text-green-400">Darsga vaqtida kelgan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-300">Kechikkan</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Darsga kechikkan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">Kelmagan</p>
                <p className="text-sm text-red-600 dark:text-red-400">Darsga kelmagan</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;