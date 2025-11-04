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
import { Trash2, Edit, Plus, Upload, Eye, Calendar, Users, BookOpen, X, Save, Star, Award, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const API_BASE_URL = "/api/teacher";

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
  const [uploadingMaterial, setUploadingMaterial] = useState<number | null>(null);
  
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

  useEffect(() => {
    fetchHomeworks();
    loadGradesFromStorage();
  }, []);

  // API functions
  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/homeworks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHomeworks(data);
    } catch (error) {
      console.error('Uy vazifalarini yuklashda xatolik:', error);
      toast({
        title: "Xatolik",
        description: "Uy vazifalari ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
      
      // Fallback to mock data if API fails
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
    } finally {
      setLoading(false);
    }
  };

  const createHomework = async (homeworkData: Omit<Homework, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homeworks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeworkData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newHomework = await response.json();
      return newHomework;
    } catch (error) {
      console.error('Uy vazifasini yaratishda xatolik:', error);
      throw error;
    }
  };

  const updateHomework = async (id: number, homeworkData: Partial<Homework>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homeworks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homeworkData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedHomework = await response.json();
      return updatedHomework;
    } catch (error) {
      console.error('Uy vazifasini yangilashda xatolik:', error);
      throw error;
    }
  };

  const deleteHomework = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homeworks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Uy vazifasini o\'chirishda xatolik:', error);
      throw error;
    }
  };

  const uploadMaterial = async (homeworkId: number, file: File) => {
    try {
      setUploadingMaterial(homeworkId);
      
      const formData = new FormData();
      formData.append('material', file);

      const response = await fetch(`${API_BASE_URL}/homeworks/${homeworkId}/materials`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Material yuklashda xatolik:', error);
      throw error;
    } finally {
      setUploadingMaterial(null);
    }
  };

  const handleMaterialUpload = async (homeworkId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadMaterial(homeworkId, file);
      
      // Update homework in local state
      setHomeworks(prev => prev.map(hw => 
        hw.id === homeworkId 
          ? { ...hw, materialPath: URL.createObjectURL(file) }
          : hw
      ));

      toast({
        title: "Muvaffaqiyatli",
        description: "Material muvaffaqiyatli yuklandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Material yuklashda xatolik",
        variant: "destructive",
      });
    }
  };

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

  const saveGradesToStorage = (newGrades: Grade[]) => {
    try {
      localStorage.setItem('homework-grades', JSON.stringify(newGrades));
      setGrades(newGrades);
    } catch (error) {
      console.error('LocalStorage ga baholarni saqlashda xatolik:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const homeworkData = {
        title: formData.title,
        description: formData.description,
        subjectName: formData.subjectName,
        className: formData.className,
        dueDate: formData.dueDate,
        submissionsCount: 0,
        totalStudents: 25
      };

      const newHomework = await createHomework(homeworkData);
      
      setHomeworks(prev => [newHomework, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi uy vazifasi qo'shildi",
      });
    } catch (error) {
      // Fallback to local state if API fails
      const newHomework: Homework = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        subjectName: formData.subjectName,
        className: formData.className,
        dueDate: formData.dueDate,
        submissionsCount: 0,
        totalStudents: 25
      };

      setHomeworks(prev => [newHomework, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi uy vazifasi qo'shildi (offline)",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHomework) return;

    try {
      const updatedHomework = await updateHomework(editingHomework.id, formData);
      
      setHomeworks(prev => prev.map(hw => 
        hw.id === editingHomework.id 
          ? { ...hw, ...updatedHomework }
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
      // Fallback to local state if API fails
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
        description: "Uy vazifasi tahrirlandi (offline)",
      });
    }
  };

  const handleDelete = async () => {
    if (!homeworkToDelete) return;

    try {
      await deleteHomework(homeworkToDelete.id);
      
      setHomeworks(prev => prev.filter(hw => hw.id !== homeworkToDelete.id));
      setIsDeleteDialogOpen(false);
      setHomeworkToDelete(null);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Uy vazifasi o'chirildi",
      });
    } catch (error) {
      // Fallback to local state if API fails
      setHomeworks(prev => prev.filter(hw => hw.id !== homeworkToDelete.id));
      setIsDeleteDialogOpen(false);
      setHomeworkToDelete(null);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Uy vazifasi o'chirildi (offline)",
      });
    }
  };

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

  const getHomeworkGrades = (homeworkId: number) => {
    return grades.filter(grade => grade.homeworkId === homeworkId);
  };

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
    if (grade >= 85) return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
    if (grade >= 70) return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
    if (grade >= 60) return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800";
    return "bg-gradient-to-r from-red-100 to-red-200 text-red-800";
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

  const getStats = () => {
    const totalHomeworks = homeworks.length;
    const averageSubmission = homeworks.length > 0 
      ? Math.round(homeworks.reduce((acc, hw) => acc + (hw.submissionsCount / hw.totalStudents), 0) / homeworks.length * 100)
      : 0;
    const dueSoonCount = homeworks.filter(hw => isDueSoon(hw.dueDate)).length;
    const totalGrades = grades.length;

    return { totalHomeworks, averageSubmission, dueSoonCount, totalGrades };
  };

  const stats = getStats();

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
              Uy Vazifalari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              O'quvchilar uchun uy vazifalarini boshqaring va baholang
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi Vazifa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              {stats.totalHomeworks}
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
              O'rtacha Topshirish
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.averageSubmission}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Topshirish darajasi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tugashiga Yaquin
            </CardTitle>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {stats.dueSoonCount}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Tez orada tugaydigan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Baholar
            </CardTitle>
            <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalGrades}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Berilgan baholar
            </p>
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                      {homework.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                      {homework.description}
                    </CardDescription>
                  </div>
                  {isDueSoon(homework.dueDate) && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none font-semibold animate-pulse">
                      Tez orada
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    {homework.subjectName}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    {homework.className}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {formatDate(homework.dueDate)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Topshirganlar:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {homework.submissionsCount}/{homework.totalStudents}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className={`h-2 bg-gray-200 dark:bg-gray-700 ${getProgressColor(progressPercentage)}`}
                  />
                  <div className="text-right text-sm font-bold text-gray-700 dark:text-gray-300">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>

                {/* Material Upload */}
                <div className="flex items-center gap-2">
                  <Label htmlFor={`material-${homework.id}`} className="cursor-pointer">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Material
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id={`material-${homework.id}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleMaterialUpload(homework.id, e)}
                    disabled={uploadingMaterial === homework.id}
                  />
                  {homework.materialPath && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => window.open(homework.materialPath, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ko'rish
                    </Button>
                  )}
                  {uploadingMaterial === homework.id && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Grades Summary */}
                {homeworkGrades.length > 0 && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Baholar:</span>
                      <Badge className={`font-bold px-3 py-1 rounded-full border-none ${getGradeColor(averageGrade)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        O'rtacha: {averageGrade}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {homeworkGrades.length} ta baho qo'shilgan
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200"
                    onClick={() => openGradeDialog(homework)}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Baholash
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
                    onClick={() => openEditDialog(homework)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 px-3"
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
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Yangi Uy Vazifasi
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Yangi uy vazifasi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vazifa nomi
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Vazifa nomini kiriting"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tavsif
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors resize-none"
                  placeholder="Vazifa tavsifini kiriting"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Fan
                  </Label>
                  <Select value={formData.subjectName} onValueChange={(value) => setFormData({...formData, subjectName: value})}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
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
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf
                  </Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
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
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Muddat
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD GRADE Dialog */}
      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Baholash Qo'shish
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              {selectedHomework?.title} vazifasi uchun baho qo'shing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGrade}>
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="student" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  O'quvchi
                </Label>
                <Select value={gradeForm.studentName} onValueChange={(value) => setGradeForm({...gradeForm, studentName: value})}>
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
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
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Baho (0-100)
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Baho kiriting"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Izoh
                </Label>
                <Textarea
                  id="comment"
                  value={gradeForm.comment}
                  onChange={(e) => setGradeForm({...gradeForm, comment: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors resize-none"
                  placeholder="Qo'shimcha izoh"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsGradeDialogOpen(false)}
                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Award className="h-4 w-4 mr-2" />
                Baholash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {homeworks.length === 0 && !loading && (
        <Card className="text-center py-12 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-transparent">
          <CardContent>
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Hali hech qanday uy vazifasi yo'q
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Birinchi uy vazifasini yaratish uchun quyidagi tugmani bosing
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
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