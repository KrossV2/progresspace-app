import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, Edit, Plus, Upload, Eye, Calendar, Users, BookOpen, X, Save, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/teacher/HomeworkPage.css";

interface Homework {
  id: number;
  title: string;
  description: string;
  subjectName: string;
  className: string;
  dueDate: string;
  materialPath?: string;
  submissionsCount: number;
  totalStudents: number;
}

interface Grade {
  id: number;
  homeworkId: number;
  studentName: string;
  grade: number;
  comment: string;
  date: string;
}

const HomeworksPage = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [homeworkToDelete, setHomeworkToDelete] = useState<Homework | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectName: "",
    className: "",
    dueDate: ""
  });

  const [gradeForm, setGradeForm] = useState({
    studentName: "",
    grade: "",
    comment: ""
  });

  const { toast } = useToast();

  // Mock data for subjects and classes
  const subjects = [
    { id: "1", name: "Matematika" },
    { id: "2", name: "Ona tili" },
    { id: "3", name: "Fizika" },
    { id: "4", name: "Ingliz tili" }
  ];

  const classes = [
    { id: "1", name: "9-A" },
    { id: "2", name: "9-B" },
    { id: "3", name: "10-A" },
    { id: "4", name: "10-B" },
    { id: "5", name: "11-A" }
  ];

  const students = [
    { id: "1", name: "Ali Valiyev", className: "10-A" },
    { id: "2", name: "Dilshod Rajabov", className: "10-A" },
    { id: "3", name: "Mohira Alimova", className: "10-A" },
    { id: "4", name: "Sardor Qodirov", className: "9-B" },
    { id: "5", name: "Zarina Xolmirzayeva", className: "9-B" }
  ];

  // LocalStorage dan ma'lumotlarni o'qish
  useEffect(() => {
    fetchHomeworks();
    loadGradesFromStorage();
  }, []);

  const loadGradesFromStorage = () => {
    try {
      const savedGrades = localStorage.getItem('homework-grades');
      if (savedGrades) {
        setGrades(JSON.parse(savedGrades));
      }
    } catch (error) {
      console.error('LocalStorage dan baholarni yuklashda xatolik:', error);
    }
  };

  // Baholarni LocalStorage ga saqlash
  const saveGradesToStorage = (newGrades: Grade[]) => {
    try {
      localStorage.setItem('homework-grades', JSON.stringify(newGrades));
      setGrades(newGrades);
    } catch (error) {
      console.error('LocalStorage ga baholarni saqlashda xatolik:', error);
    }
  };

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      // Mock data - API chaqiruvi o'rniga
      setTimeout(() => {
        setHomeworks([
          {
            id: 1,
            title: "Algebraik ifodalar",
            description: "17-18 betdagi masalalarni yeching",
            subjectName: "Matematika",
            className: "10-A",
            dueDate: "2024-01-20",
            submissionsCount: 25,
            totalStudents: 30
          },
          {
            id: 2,
            title: "Insho yozing",
            description: "Qish mavzusida insha yozing",
            subjectName: "Ona tili",
            className: "9-B",
            dueDate: "2024-01-22",
            submissionsCount: 18,
            totalStudents: 28
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Uy vazifalari ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // CREATE - Yangi uy vazifasi qo'shish
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newHomework: Homework = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        subjectName: formData.subjectName,
        className: formData.className,
        dueDate: formData.dueDate,
        submissionsCount: 0,
        totalStudents: 25 // Default qiymat
      };

      setHomeworks(prev => [newHomework, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi uy vazifasi qo'shildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Uy vazifasini qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  // UPDATE - Uy vazifasini tahrirlash
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomework) return;

    try {
      setHomeworks(prev => prev.map(hw => 
        hw.id === editingHomework.id 
          ? { ...hw, ...formData }
          : hw
      ));
      
      setIsEditDialogOpen(false);
      setEditingHomework(null);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Uy vazifasi tahrirlandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Uy vazifasini tahrirlashda xatolik",
        variant: "destructive",
      });
    }
  };

  // DELETE - Uy vazifasini o'chirish
  const handleDelete = async () => {
    if (!homeworkToDelete) return;

    try {
      setHomeworks(prev => prev.filter(hw => hw.id !== homeworkToDelete.id));
      setIsDeleteDialogOpen(false);
      setHomeworkToDelete(null);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Uy vazifasi o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Uy vazifasini o'chirishda xatolik",
        variant: "destructive",
      });
    }
  };

  // BAHO QO'SHISH
  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomework) return;

    try {
      const newGrade: Grade = {
        id: Date.now(),
        homeworkId: selectedHomework.id,
        studentName: gradeForm.studentName,
        grade: parseInt(gradeForm.grade),
        comment: gradeForm.comment,
        date: new Date().toISOString().split('T')[0]
      };

      const updatedGrades = [...grades, newGrade];
      saveGradesToStorage(updatedGrades);
      
      setIsGradeDialogOpen(false);
      resetGradeForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Baholash qo'shildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Baholash qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  // Vazifa bo'yicha baholarni olish
  const getHomeworkGrades = (homeworkId: number) => {
    return grades.filter(grade => grade.homeworkId === homeworkId);
  };

  // O'rtacha bahoni hisoblash
  const getAverageGrade = (homeworkId: number) => {
    const homeworkGrades = getHomeworkGrades(homeworkId);
    if (homeworkGrades.length === 0) return 0;
    
    const sum = homeworkGrades.reduce((acc, grade) => acc + grade.grade, 0);
    return Math.round(sum / homeworkGrades.length);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subjectName: "",
      className: "",
      dueDate: ""
    });
  };

  const resetGradeForm = () => {
    setGradeForm({
      studentName: "",
      grade: "",
      comment: ""
    });
  };

  const openEditDialog = (homework: Homework) => {
    setEditingHomework(homework);
    setFormData({
      title: homework.title,
      description: homework.description,
      subjectName: homework.subjectName,
      className: homework.className,
      dueDate: homework.dueDate
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (homework: Homework) => {
    setHomeworkToDelete(homework);
    setIsDeleteDialogOpen(true);
  };

  const openGradeDialog = (homework: Homework) => {
    setSelectedHomework(homework);
    setIsGradeDialogOpen(true);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return "text-green-600 bg-green-100";
    if (grade >= 70) return "text-blue-600 bg-blue-100";
    if (grade >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Uy Vazifalari
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              O'quvchilar uchun uy vazifalarini boshqaring va baholang
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi Vazifa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami Vazifalar</p>
                <p className="text-2xl font-bold text-slate-900">{homeworks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">O'rtacha Topshirish</p>
                <p className="text-2xl font-bold text-slate-900">
                  {homeworks.length > 0 
                    ? Math.round(homeworks.reduce((acc, hw) => acc + (hw.submissionsCount / hw.totalStudents), 0) / homeworks.length * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Tugashiga Yaquin</p>
                <p className="text-2xl font-bold text-slate-900">
                  {homeworks.filter(hw => isDueSoon(hw.dueDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami Baholar</p>
                <p className="text-2xl font-bold text-slate-900">{grades.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {homeworks.map((homework) => {
          const progressPercentage = (homework.submissionsCount / homework.totalStudents) * 100;
          const homeworkGrades = getHomeworkGrades(homework.id);
          const averageGrade = getAverageGrade(homework.id);
          
          return (
            <Card 
              key={homework.id} 
              className={`bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isDueSoon(homework.dueDate) ? 'border-orange-200 bg-orange-50/50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {homework.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {homework.description}
                    </CardDescription>
                  </div>
                  {isDueSoon(homework.dueDate) && (
                    <Badge variant="destructive" className="animate-pulse ml-2">
                      Tez orada
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex justify-between text-sm text-slate-600">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {homework.subjectName}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {homework.className}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(homework.dueDate)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Topshirganlar:</span>
                    <span className="font-medium text-slate-900">
                      {homework.submissionsCount}/{homework.totalStudents}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className={`h-2 ${getProgressColor(progressPercentage)}`}
                  />
                  <div className="text-right text-sm font-medium text-slate-700">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>

                {/* Grades Summary */}
                {homeworkGrades.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Baholar:</span>
                      <Badge className={getGradeColor(averageGrade)}>
                        <Star className="h-3 w-3 mr-1" />
                        O'rtacha: {averageGrade}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      {homeworkGrades.length} ta baho qo'shilgan
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openGradeDialog(homework)}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Baholash
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditDialog(homework)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteDialog(homework)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CREATE Homework Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yangi Uy Vazifasi</DialogTitle>
            <DialogDescription>
              Yangi uy vazifasi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Vazifa nomi</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Vazifa nomini kiriting"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Tavsif</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Vazifa tavsifini kiriting"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Fan</Label>
                  <Select value={formData.subjectName} onValueChange={(value) => setFormData({...formData, subjectName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fan tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Sinf</Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Muddat</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD GRADE Dialog */}
      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Baholash Qo'shish</DialogTitle>
            <DialogDescription>
              {selectedHomework?.title} vazifasi uchun baho qo'shing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGrade}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="student">O'quvchi</Label>
                <Select value={gradeForm.studentName} onValueChange={(value) => setGradeForm({...gradeForm, studentName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="O'quvchi tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {students
                      .filter(student => student.className === selectedHomework?.className)
                      .map((student) => (
                        <SelectItem key={student.id} value={student.name}>
                          {student.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade">Baho (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                  placeholder="Baho kiriting"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comment">Izoh</Label>
                <Textarea
                  id="comment"
                  value={gradeForm.comment}
                  onChange={(e) => setGradeForm({...gradeForm, comment: e.target.value})}
                  placeholder="Qo'shimcha izoh"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit">
                <Award className="h-4 w-4 mr-2" />
                Baholash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT Homework Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Uy Vazifasini Tahrirlash</DialogTitle>
            <DialogDescription>
              Uy vazifasi ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Vazifa nomi</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Tavsif</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-subject">Fan</Label>
                  <Select value={formData.subjectName} onValueChange={(value) => setFormData({...formData, subjectName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fan tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-class">Sinf</Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">Muddat</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Uy Vazifasini O'chirish</DialogTitle>
            <DialogDescription>
              Bu vazifani o'chirishni istaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          {homeworkToDelete && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-semibold">{homeworkToDelete.title}</p>
              <p className="text-sm text-slate-600">{homeworkToDelete.subjectName} • {homeworkToDelete.className}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {homeworks.length === 0 && !loading && (
        <Card className="text-center py-12 border-dashed border-2 border-slate-200 bg-transparent">
          <CardContent>
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Hali hech qanday uy vazifasi yo'q
            </h3>
            <p className="text-slate-600 mb-4">
              Birinchi uy vazifasini yaratish uchun quyidagi tugmani bosing
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi Vazifa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeworksPage;