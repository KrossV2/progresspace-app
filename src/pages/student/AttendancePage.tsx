import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, TrendingUp } from "lucide-react";

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
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Заголовок */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Davomat Ma'lumotlari
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sizning so'nggi davomat statistikangiz va tarixingiz
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Umumiy davomat</p>
                <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Darslar soni</p>
                <p className="text-2xl font-bold text-blue-600">{totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Qatnashgan darslar</p>
                <p className="text-2xl font-bold text-purple-600">{presentClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Таблица посещаемости */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Davomat Jadvali</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 hover:bg-blue-50">
                  <TableHead className="font-semibold text-blue-900 py-4">Sana</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Fan</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4 text-right">Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow 
                    key={r.id} 
                    className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-blue-100"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{r.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span>{r.subjectName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Badge 
                        variant={getStatusVariant(r.status)}
                        className={`
                          ${r.status === "present" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          ${r.status === "late" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                          ${r.status === "absent" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
                          font-semibold px-3 py-1 rounded-full
                        `}
                      >
                        {getStatusText(r.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Легенда */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Kelgan - Darsga vaqtida kelgan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Kechikkan - Darsga kechikkan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Kelmagan - Darsga kelmagan</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;