import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Award,
  AlertTriangle,
  Target,
  Star,
  BarChart3
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface ClassStatistics {
  id: number;
  name: string;
  studentCount: number;
  averageGrade: number;
  attendanceRate: number;
  excellentStudents: number;
  failingStudents: number;
}

interface TeacherStatistics {
  id: number;
  name: string;
  subjectName: string;
  classCount: number;
  averageGrade: number;
  attendanceRate: number;
}

interface AttendanceStatistics {
  month: string;
  attendanceRate: number;
  present: number;
  absent: number;
  late: number;
}

interface SubjectPerformance {
  subjectName: string;
  averageGrade: number;
  studentCount: number;
  excellentCount: number;
  failingCount: number;
}

const StatisticsPage = () => {
  const [classStats, setClassStats] = useState<ClassStatistics[]>([]);
  const [teacherStats, setTeacherStats] = useState<TeacherStatistics[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStatistics[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const { toast } = useToast();

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const classStatsData = [
        {
          id: 1,
          name: "1-A",
          studentCount: 25,
          averageGrade: 4.2,
          attendanceRate: 95,
          excellentStudents: 8,
          failingStudents: 1
        },
        {
          id: 2,
          name: "1-B",
          studentCount: 28,
          averageGrade: 3.8,
          attendanceRate: 92,
          excellentStudents: 5,
          failingStudents: 3
        },
        {
          id: 3,
          name: "2-A",
          studentCount: 22,
          averageGrade: 4.5,
          attendanceRate: 97,
          excellentStudents: 12,
          failingStudents: 0
        },
        {
          id: 4,
          name: "10-A",
          studentCount: 30,
          averageGrade: 4.0,
          attendanceRate: 89,
          excellentStudents: 10,
          failingStudents: 2
        },
      ];

      const teacherStatsData = [
        {
          id: 1,
          name: "Nilufar Karimova",
          subjectName: "Matematika",
          classCount: 3,
          averageGrade: 4.1,
          attendanceRate: 94
        },
        {
          id: 2,
          name: "Bekzod Tursunov",
          subjectName: "Fizika",
          classCount: 2,
          averageGrade: 3.9,
          attendanceRate: 91
        },
        {
          id: 3,
          name: "Sevara Norova",
          subjectName: "Ona tili",
          classCount: 4,
          averageGrade: 4.3,
          attendanceRate: 96
        },
        {
          id: 4,
          name: "Davron Umarov",
          subjectName: "Ingliz tili",
          classCount: 3,
          averageGrade: 3.7,
          attendanceRate: 88
        },
      ];

      const attendanceStatsData = [
        { month: "Yanvar", attendanceRate: 92, present: 2760, absent: 240, late: 120 },
        { month: "Fevral", attendanceRate: 94, present: 2820, absent: 180, late: 100 },
        { month: "Mart", attendanceRate: 91, present: 2730, absent: 270, late: 150 },
        { month: "Aprel", attendanceRate: 96, present: 2880, absent: 120, late: 80 },
        { month: "May", attendanceRate: 93, present: 2790, absent: 210, late: 110 },
        { month: "Iyun", attendanceRate: 95, present: 2850, absent: 150, late: 90 },
      ];

      const subjectPerformanceData = [
        { subjectName: "Matematika", averageGrade: 4.1, studentCount: 105, excellentCount: 35, failingCount: 6 },
        { subjectName: "Ona tili", averageGrade: 4.3, studentCount: 105, excellentCount: 42, failingCount: 3 },
        { subjectName: "Fizika", averageGrade: 3.9, studentCount: 75, excellentCount: 20, failingCount: 8 },
        { subjectName: "Ingliz tili", averageGrade: 3.7, studentCount: 105, excellentCount: 18, failingCount: 12 },
        { subjectName: "Kimyo", averageGrade: 4.0, studentCount: 60, excellentCount: 22, failingCount: 5 },
        { subjectName: "Biologiya", averageGrade: 4.2, studentCount: 60, excellentCount: 28, failingCount: 2 },
      ];

      setClassStats(classStatsData);
      setTeacherStats(teacherStatsData);
      setAttendanceStats(attendanceStatsData);
      setSubjectPerformance(subjectPerformanceData);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Statistik ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "text-green-600 dark:text-green-400";
    if (grade >= 4.0) return "text-blue-600 dark:text-blue-400";
    if (grade >= 3.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600 dark:text-green-400";
    if (rate >= 90) return "text-blue-600 dark:text-blue-400";
    if (rate >= 85) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeBadgeClass = (grade: number) => {
    if (grade >= 4.5) return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none";
    if (grade >= 4.0) return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none";
    if (grade >= 3.5) return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-none";
    return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none";
  };

  const getAttendanceBadgeClass = (rate: number) => {
    if (rate >= 95) return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none";
    if (rate >= 90) return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none";
    if (rate >= 85) return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-none";
    return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none";
  };

  const totalStudents = classStats.reduce((sum, cls) => sum + cls.studentCount, 0);
  const overallAverageGrade = classStats.length > 0 
    ? classStats.reduce((sum, cls) => sum + cls.averageGrade * cls.studentCount, 0) / totalStudents 
    : 0;
  const overallAttendanceRate = classStats.length > 0 
    ? classStats.reduce((sum, cls) => sum + cls.attendanceRate * cls.studentCount, 0) / totalStudents 
    : 0;
  const totalExcellentStudents = classStats.reduce((sum, cls) => sum + cls.excellentStudents, 0);
  const totalFailingStudents = classStats.reduce((sum, cls) => sum + cls.failingStudents, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Statistika
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Maktab faoliyati statistikasi va tahlili
            </p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors w-48">
              <SelectValue placeholder="Davrni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Joriy oy</SelectItem>
              <SelectItem value="current_quarter">Joriy chorak</SelectItem>
              <SelectItem value="current_year">Joriy yil</SelectItem>
              <SelectItem value="last_month">O'tgan oy</SelectItem>
              <SelectItem value="last_quarter">O'tgan chorak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami o'quvchilar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {classStats.length} ta sinfda
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha baho
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl md:text-4xl font-bold ${getGradeColor(overallAverageGrade)}`}>
              {overallAverageGrade.toFixed(1)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              5 baholik tizimda
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Davomatiyatlik
            </CardTitle>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl md:text-4xl font-bold ${getAttendanceColor(overallAttendanceRate)}`}>
              {overallAttendanceRate.toFixed(1)}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              O'rtacha davomatiyatlik
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              A'lo o'quvchilar
            </CardTitle>
            <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {totalExcellentStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {((totalExcellentStudents / totalStudents) * 100).toFixed(1)}% jami o'quvchilardan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Class Performance Chart */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Sinflar bo'yicha o'rtacha baho
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Har bir sinf uchun o'rtacha baholar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis domain={[0, 5]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="averageGrade" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Oylik davomatiyatlik
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              So'nggi 6 oy davomatiyatlik statistikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis domain={[80, 100]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendanceRate" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#82ca9d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Fanlar bo'yicha natijalar
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Har bir fan bo'yicha o'quvchilar ko'rsatkichlari
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                    {subject.subjectName}
                  </h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Jami: {subject.studentCount}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      A'lo: {subject.excellentCount}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      Qoniqarsiz: {subject.failingCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">O'rtacha baho</span>
                      <span className={`text-sm font-bold ${getGradeColor(subject.averageGrade)}`}>
                        {subject.averageGrade.toFixed(1)}
                      </span>
                    </div>
                    <Progress 
                      value={(subject.averageGrade / 5) * 100} 
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Muvaffaqiyat</span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {(((subject.studentCount - subject.failingCount) / subject.studentCount) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={((subject.studentCount - subject.failingCount) / subject.studentCount) * 100} 
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Class Statistics Table */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Sinflar statistikasi
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Har bir sinf bo'yicha batafsil ma'lumot
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {classStats.map((cls) => (
                <div 
                  key={cls.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{cls.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {cls.studentCount} o'quvchi
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`font-semibold px-3 py-1 rounded-full mb-1 ${getGradeBadgeClass(cls.averageGrade)}`}>
                      {cls.averageGrade.toFixed(1)} baho
                    </Badge>
                    <Badge className={`font-semibold px-3 py-1 rounded-full ${getAttendanceBadgeClass(cls.attendanceRate)}`}>
                      {cls.attendanceRate}% davomat
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2">
                      <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold">
                        A'lo: {cls.excellentStudents}
                      </Badge>
                      {cls.failingStudents > 0 && (
                        <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none font-semibold">
                          Qoniqarsiz: {cls.failingStudents}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Statistics Table */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
              O'qituvchilar statistikasi
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              O'qituvchilar faoliyati ko'rsatkichlari
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {teacherStats.map((teacher) => (
                <div 
                  key={teacher.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{teacher.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {teacher.subjectName} • {teacher.classCount} sinf
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col gap-1">
                      <Badge className={`font-semibold px-3 py-1 rounded-full ${getGradeBadgeClass(teacher.averageGrade)}`}>
                        {teacher.averageGrade.toFixed(1)} baho
                      </Badge>
                      <Badge className={`font-semibold px-3 py-1 rounded-full ${getAttendanceBadgeClass(teacher.attendanceRate)}`}>
                        {teacher.attendanceRate}% davomat
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage;