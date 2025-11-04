import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, TrendingUp, FileText, Download, RefreshCw, Plus, Users, Target } from "lucide-react";

interface HomeworkRow {
  id: number;
  title: string;
  subjectName: string;
  dueDate: string;
  status: "pending" | "submitted" | "late" | "graded";
  description: string;
  teacher: string;
  points?: number;
  maxPoints: number;
  submissionDate?: string;
  attachments?: string[];
  className: string;
  assignedDate: string;
}

const StudentHomeworksPage = () => {
  const [rows, setRows] = useState<HomeworkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHomeworks = () => {
    setLoading(true);
    try {
      const savedHomeworks = localStorage.getItem('teacher-homeworks');
      console.log('Loaded from localStorage:', savedHomeworks);
      
      if (savedHomeworks) {
        const teacherHomeworks: HomeworkRow[] = JSON.parse(savedHomeworks);
        console.log('Parsed homeworks:', teacherHomeworks);
        
        const defaultHomeworks: HomeworkRow[] = [
          { 
            id: 2, 
            title: "Adabiyot tanqidi", 
            subjectName: "Ona tili", 
            dueDate: "2024-01-22", 
            status: "submitted",
            description: "Berilgan hikoya asosida adabiy tahlil va tanqid yozish",
            teacher: "Toshmatova Zuhra",
            maxPoints: 15,
            submissionDate: "2024-01-21",
            attachments: ["tanqid.docx"],
            className: "10-A",
            assignedDate: "2024-01-10"
          },
          { 
            id: 5, 
            title: "Biologik tizimlar", 
            subjectName: "Biologiya", 
            dueDate: "2024-01-15", 
            status: "graded",
            description: "O'simlik va hayvonlar hujayralarining qiyosiy tahlili",
            teacher: "Xolmirzayeva Dilbar",
            maxPoints: 15,
            points: 14,
            submissionDate: "2024-01-14",
            attachments: ["tahlil.pdf"],
            className: "10-A",
            assignedDate: "2024-01-05"
          }
        ];

        const allHomeworks = [
          ...teacherHomeworks, 
          ...defaultHomeworks.filter(h => 
            !teacherHomeworks.some(th => th.id === h.id)
          )
        ];
        
        console.log('All homeworks to display:', allHomeworks);
        setRows(allHomeworks);
      } else {
        console.log('No data in localStorage, using default');
        setRows([
          { 
            id: 2, 
            title: "Adabiyot tanqidi", 
            subjectName: "Ona tili", 
            dueDate: "2024-01-22", 
            status: "submitted",
            description: "Berilgan hikoya asosida adabiy tahlil va tanqid yozish",
            teacher: "Toshmatova Zuhra",
            maxPoints: 15,
            submissionDate: "2024-01-21",
            attachments: ["tanqid.docx"],
            className: "10-A",
            assignedDate: "2024-01-10"
          },
          { 
            id: 5, 
            title: "Biologik tizimlar", 
            subjectName: "Biologiya", 
            dueDate: "2024-01-15", 
            status: "graded",
            description: "O'simlik va hayvonlar hujayralarining qiyosiy tahlili",
            teacher: "Xolmirzayeva Dilbar",
            maxPoints: 15,
            points: 14,
            submissionDate: "2024-01-14",
            attachments: ["tahlil.pdf"],
            className: "10-A",
            assignedDate: "2024-01-05"
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading homeworks:', error);
      setRows([
        { 
          id: 2, 
          title: "Adabiyot tanqidi", 
          subjectName: "Ona tili", 
          dueDate: "2024-01-22", 
          status: "submitted",
          description: "Berilgan hikoya asosida adabiy tahlil va tanqid yozish",
          teacher: "Toshmatova Zuhra",
          maxPoints: 15,
          submissionDate: "2024-01-21",
          attachments: ["tanqid.docx"],
          className: "10-A",
          assignedDate: "2024-01-10"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeworks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'teacher-homeworks') {
        console.log('Storage changed, reloading homeworks');
        loadHomeworks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      loadHomeworks();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted": return "default";
      case "graded": return "default";
      case "late": return "destructive";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return <CheckCircle className="h-4 w-4" />;
      case "graded": return <TrendingUp className="h-4 w-4" />;
      case "late": return <AlertCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted": return "Topshirildi";
      case "graded": return "Baholandi";
      case "late": return "Muddat o'tgan";
      case "pending": return "Kutilmoqda";
      default: return "Kutilmoqda";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === "submitted" || status === "graded") return "text-green-600";
    if (status === "late") return "text-red-600";
    
    const daysRemaining = getDaysRemaining(dueDate);
    if (daysRemaining < 0) return "text-red-600";
    if (daysRemaining <= 2) return "text-orange-600";
    return "text-blue-600";
  };

  const pendingHomeworks = rows.filter(h => h.status === "pending").length;
  const submittedHomeworks = rows.filter(h => h.status === "submitted" || h.status === "graded").length;
  const completionRate = rows.length > 0 ? Math.round((submittedHomeworks / rows.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
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
              Uy Vazifalari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha fanlar bo'yicha uy vazifalari va ularning holati
            </p>
          </div>
          
          <Button 
            onClick={loadHomeworks}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Vazifalar
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {rows.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha uy vazifalari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kutilayotgan
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {pendingHomeworks}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Topshirilmagan vazifalar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Bajarilgan
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {completionRate}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Umumiy progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Umumiy Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bajarilish darajasi</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3 bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {submittedHomeworks} ta topshirildi
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-500" />
                {pendingHomeworks} ta kutilmoqda
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homeworks Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            Vazifalar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {rows.length} ta uy vazifasi mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Vazifa Nomi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fan</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'qituvchi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Muddat</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Ball</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Hozircha uy vazifalari mavjud emas
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500 mb-4">
                        O'qituvchi yangi vazifa qo'shgach, bu yerda ko'rasiz
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((homework) => {
                    const daysRemaining = getDaysRemaining(homework.dueDate);
                    const isOverdue = daysRemaining < 0 && homework.status === "pending";
                    
                    return (
                      <TableRow 
                        key={homework.id} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-2">
                              {homework.title}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {homework.description}
                            </div>
                            {homework.attachments && homework.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {homework.attachments.map((file, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    {file}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              Berilgan: {homework.assignedDate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none font-semibold px-3 py-1 rounded-lg">
                            {homework.subjectName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {homework.teacher}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className={getDueDateColor(homework.dueDate, homework.status)}>
                              {homework.dueDate}
                              {isOverdue && (
                                <span className="text-xs ml-1 font-semibold">
                                  ({Math.abs(daysRemaining)} kun o'tgan)
                                </span>
                              )}
                              {!isOverdue && homework.status === "pending" && daysRemaining >= 0 && (
                                <span className="text-xs ml-1 font-semibold">
                                  ({daysRemaining} kun qoldi)
                                </span>
                              )}
                            </span>
                          </div>
                          {homework.submissionDate && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Topshirildi: {homework.submissionDate}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {homework.points ? (
                            <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                              {homework.points}/{homework.maxPoints}
                            </div>
                          ) : (
                            <div className="text-gray-500 dark:text-gray-400 font-semibold">
                              {homework.maxPoints} ball
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`
                            font-semibold px-3 py-1 rounded-full border-none flex items-center gap-1 w-fit
                            ${homework.status === "graded" ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : ''}
                            ${homework.status === "submitted" ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' : ''}
                            ${homework.status === "late" ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' : ''}
                            ${homework.status === "pending" ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' : ''}
                          `}>
                            {getStatusIcon(homework.status)}
                            {getStatusText(homework.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {homework.status === "pending" && (
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                Topshirish
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Yuklab olish
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Debug ma'lumot:</strong>
            <div>Yuklangan vazifalar: {rows.length}</div>
            <div>LocalStorage kaliti: teacher-homeworks</div>
            <Button 
              onClick={() => {
                const data = localStorage.getItem('teacher-homeworks');
                console.log('Current localStorage:', data);
                alert('Debug ma\'lumot uchun konsolni tekshiring');
              }}
              variant="outline"
              size="sm"
              className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              LocalStorage ni tekshirish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHomeworksPage;