import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, TrendingUp, FileText, Download } from "lucide-react";

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

  useEffect(() => {
    loadHomeworksFromStorage();
  }, []);

  const loadHomeworksFromStorage = () => {
    const savedHomeworks = localStorage.getItem('teacher-homeworks');
    if (savedHomeworks) {
      const teacherHomeworks: HomeworkRow[] = JSON.parse(savedHomeworks);
      
      // Добавляем статические данные, если в localStorage пусто
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

      // Объединяем домашние задания из localStorage и статические
      const allHomeworks = [...teacherHomeworks, ...defaultHomeworks.filter(h => 
        !teacherHomeworks.some(th => th.id === h.id)
      )];
      
      setRows(allHomeworks);
    } else {
      // Если в localStorage нет данных, используем статические
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
  };

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
  const completionRate = Math.round((submittedHomeworks / rows.length) * 100);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Uy Vazifalari
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Barcha fanlar bo'yicha uy vazifalari va ularning holati
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami Vazifalar</p>
                <p className="text-2xl font-bold text-blue-600">{rows.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Kutilayotgan</p>
                <p className="text-2xl font-bold text-orange-600">{pendingHomeworks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bajarilgan</p>
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Umumiy progress</span>
              <span className="text-sm font-bold text-gray-700">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{submittedHomeworks} ta topshirildi</span>
              <span>{pendingHomeworks} ta kutilmoqda</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homeworks Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Vazifalar Ro'yxati</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 hover:bg-blue-50">
                  <TableHead className="font-semibold text-blue-900 py-4">Vazifa Nomi</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Fan</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">O'qituvchi</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Muddat</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Ball</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Holat</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((homework) => {
                  const daysRemaining = getDaysRemaining(homework.dueDate);
                  const isOverdue = daysRemaining < 0 && homework.status === "pending";
                  
                  return (
                    <TableRow 
                      key={homework.id} 
                      className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-blue-100"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{homework.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{homework.description}</div>
                          {homework.attachments && homework.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {homework.attachments.map((file, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Berilgan: {homework.assignedDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {homework.subjectName}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600">
                        {homework.teacher}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className={getDueDateColor(homework.dueDate, homework.status)}>
                            {homework.dueDate}
                            {isOverdue && <span className="text-xs ml-1">({Math.abs(daysRemaining)} kun o'tgan)</span>}
                            {!isOverdue && homework.status === "pending" && daysRemaining >= 0 && (
                              <span className="text-xs ml-1">({daysRemaining} kun qoldi)</span>
                            )}
                          </span>
                        </div>
                        {homework.submissionDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Topshirildi: {homework.submissionDate}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {homework.points ? (
                          <div className="font-bold text-green-600">
                            {homework.points}/{homework.maxPoints}
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            {homework.maxPoints} ball
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant={getStatusVariant(homework.status)}
                          className={`
                            ${homework.status === "graded" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                            ${homework.status === "submitted" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                            ${homework.status === "late" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
                            ${homework.status === "pending" ? "bg-orange-100 text-orange-800 hover:bg-orange-200" : ""}
                            font-semibold px-3 py-1 rounded-full flex items-center space-x-1 w-fit
                          `}
                        >
                          {getStatusIcon(homework.status)}
                          <span>{getStatusText(homework.status)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex space-x-2">
                          {homework.status === "pending" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Topshirish
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Yuklab olish
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Topshirildi/Baholandi - Vazifa bajarildi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Kutilmoqda - Vazifa bajarilishi kerak</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Muddat o'tgan - Vazifa muddati o'tgan</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHomeworksPage;