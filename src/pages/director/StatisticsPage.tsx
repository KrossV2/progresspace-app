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
  AlertTriangle
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
import { API_BASE_URL } from "@/config/api";

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

  // TODO: Replace with actual API URL
  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // const [classResponse, teacherResponse, attendanceResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/director/statistics/classes?period=${selectedPeriod}`),
      //   fetch(`${API_BASE_URL}/api/director/statistics/teachers?period=${selectedPeriod}`),
      //   fetch(`${API_BASE_URL}/api/director/statistics/attendance?period=${selectedPeriod}`)
      // ]);
      
      // Mock data for now
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
    if (grade >= 4.5) return "text-green-600";
    if (grade >= 4.0) return "text-blue-600";
    if (grade >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 90) return "text-blue-600";
    if (rate >= 85) return "text-yellow-600";
    return "text-red-600";
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Statistika</h1>
          <p className="text-muted-foreground">Maktab faoliyati statistikasi va tahlili</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
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

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami o'quvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {classStats.length} ta sinfda
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha baho</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(overallAverageGrade)}`}>
              {overallAverageGrade.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              5 baholik tizimda
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Davomatiyatlik</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(overallAttendanceRate)}`}>
              {overallAttendanceRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              O'rtacha davomatiyatlik
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A'lo o'quvchilar</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalExcellentStudents}</div>
            <p className="text-xs text-muted-foreground">
              {((totalExcellentStudents / totalStudents) * 100).toFixed(1)}% jami o'quvchilardan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Class Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sinflar bo'yicha o'rtacha baho</CardTitle>
            <CardDescription>Har bir sinf uchun o'rtacha baholar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="averageGrade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Oylik davomatiyatlik</CardTitle>
            <CardDescription>So'nggi 6 oy davomatiyatlik statistikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendanceRate" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Fanlar bo'yicha natijalar</CardTitle>
          <CardDescription>Har bir fan bo'yicha o'quvchilar ko'rsatkichlari</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{subject.subjectName}</h4>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Jami: {subject.studentCount}</span>
                      <span className="text-green-600">A'lo: {subject.excellentCount}</span>
                      <span className="text-red-600">Qoniqarsiz: {subject.failingCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">O'rtacha baho</span>
                        <span className={`text-sm font-medium ${getGradeColor(subject.averageGrade)}`}>
                          {subject.averageGrade.toFixed(1)}
                        </span>
                      </div>
                      <Progress value={(subject.averageGrade / 5) * 100} className="h-2" />
                    </div>
                    <div className="w-24">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Muvaffaqiyat</span>
                        <span className="text-sm font-medium">
                          {(((subject.studentCount - subject.failingCount) / subject.studentCount) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={((subject.studentCount - subject.failingCount) / subject.studentCount) * 100} 
                        className="h-2" 
                      />
                    </div>
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
        <Card>
          <CardHeader>
            <CardTitle>Sinflar statistikasi</CardTitle>
            <CardDescription>Har bir sinf bo'yicha batafsil ma'lumot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classStats.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {cls.studentCount} o'quvchi
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getGradeColor(cls.averageGrade)}`}>
                      {cls.averageGrade.toFixed(1)} baho
                    </div>
                    <div className={`text-sm ${getAttendanceColor(cls.attendanceRate)}`}>
                      {cls.attendanceRate}% davomat
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-green-600">
                      A'lo: {cls.excellentStudents}
                    </Badge>
                    {cls.failingStudents > 0 && (
                      <Badge variant="outline" className="text-red-600 ml-1">
                        Qoniqarsiz: {cls.failingStudents}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>O'qituvchilar statistikasi</CardTitle>
            <CardDescription>O'qituvchilar faoliyati ko'rsatkichlari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherStats.map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.subjectName} • {teacher.classCount} sinf
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getGradeColor(teacher.averageGrade)}`}>
                      {teacher.averageGrade.toFixed(1)} baho
                    </div>
                    <div className={`text-sm ${getAttendanceColor(teacher.attendanceRate)}`}>
                      {teacher.attendanceRate}% davomat
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