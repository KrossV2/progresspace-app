import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, BookOpen, Star, Plus, Edit, Trash2, Target, Award, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GradeRecord {
  id: number;
  date: string;
  subject: string;
  teacher: string;
  grade: number;
  type: 'test' | 'homework' | 'classwork' | 'exam';
  topic: string;
  notes?: string;
}

interface GradeStats {
  total: number;
  average: number;
  excellent: number;
  good: number;
  satisfactory: number;
  subjectAverages: { subject: string; average: number }[];
}

const GradesPage = () => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<GradeRecord[]>([]);
  const [stats, setStats] = useState<GradeStats>({
    total: 0,
    average: 0,
    excellent: 0,
    good: 0,
    satisfactory: 0,
    subjectAverages: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GradeRecord | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    teacher: "",
    grade: 5,
    type: "test" as 'test' | 'homework' | 'classwork' | 'exam',
    topic: "",
    notes: ""
  });
  const { toast } = useToast();

  const subjects = [
    "Matematika",
    "Fizika",
    "Ona tili",
    "Ingliz tili",
    "Tarix",
    "Biologiya",
    "Kimyo",
    "Geografiya",
    "Informatika",
    "Adabiyot"
  ];

  const teachers = [
    "Nilufar Karimova",
    "Bekzod Tursunov",
    "Sevara Norova",
    "Davron Umarov",
    "Malika Tosheva",
    "Aziz Karimov"
  ];

  const gradeTypes = [
    { value: "test", label: "Test" },
    { value: "homework", label: "Uy vazifasi" },
    { value: "classwork", label: "Dars ishi" },
    { value: "exam", label: "Imtihon" }
  ];

  useEffect(() => {
    fetchGradesData();
  }, []);

  useEffect(() => {
    filterGradesByDate();
    calculateStats(grades);
  }, [grades, selectedDate]);

  const fetchGradesData = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 604800000).toISOString().split('T')[0];

      const mockData: GradeRecord[] = [
        {
          id: 1,
          date: today,
          subject: "Matematika",
          teacher: "Nilufar Karimova",
          grade: 5,
          type: "test",
          topic: "Algebraik ifodalar",
          notes: "A'lo natija"
        },
        {
          id: 2,
          date: today,
          subject: "Fizika",
          teacher: "Bekzod Tursunov",
          grade: 4,
          type: "classwork",
          topic: "Mexanika",
          notes: "Yaxshi ishlagan"
        },
        {
          id: 3,
          date: yesterday,
          subject: "Ona tili",
          teacher: "Sevara Norova",
          grade: 5,
          type: "homework",
          topic: "Imlo qoidalari"
        },
        {
          id: 4,
          date: yesterday,
          subject: "Ingliz tili",
          teacher: "Davron Umarov",
          grade: 3,
          type: "test",
          topic: "Grammar",
          notes: "Qo'shimcha mashq kerak"
        },
        {
          id: 5,
          date: lastWeek,
          subject: "Tarix",
          teacher: "Malika Tosheva",
          grade: 5,
          type: "exam",
          topic: "O'zbekiston tarixi",
          notes: "Mukammal bilim"
        },
        {
          id: 6,
          date: lastWeek,
          subject: "Biologiya",
          teacher: "Aziz Karimov",
          grade: 4,
          type: "classwork",
          topic: "Hujayra qurilishi"
        }
      ];

      setGrades(mockData);
    } catch (error) {
      console.error('Error fetching grades data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterGradesByDate = () => {
    const filtered = grades.filter(record => record.date === selectedDate);
    setFilteredGrades(filtered);
  };

  const calculateStats = (data: GradeRecord[]) => {
    const filteredData = data.filter(record => record.date === selectedDate);
    const total = filteredData.length;
    const average = total > 0 ? 
      Math.round((filteredData.reduce((sum, record) => sum + record.grade, 0) / total) * 10) / 10 : 0;
    
    const excellent = filteredData.filter(record => record.grade === 5).length;
    const good = filteredData.filter(record => record.grade === 4).length;
    const satisfactory = filteredData.filter(record => record.grade === 3).length;

    const subjectAverages = subjects.map(subject => {
      const subjectGrades = filteredData.filter(record => record.subject === subject);
      const subjectAverage = subjectGrades.length > 0 ?
        Math.round((subjectGrades.reduce((sum, record) => sum + record.grade, 0) / subjectGrades.length) * 10) / 10 : 0;
      return { subject, average: subjectAverage };
    }).filter(item => item.average > 0);

    setStats({
      total,
      average,
      excellent,
      good,
      satisfactory,
      subjectAverages
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const openCreateDialog = () => {
    setEditingRecord(null);
    setFormData({
      date: selectedDate,
      subject: "",
      teacher: "",
      grade: 5,
      type: "test",
      topic: "",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: GradeRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      subject: record.subject,
      teacher: record.teacher,
      grade: record.grade,
      type: record.type,
      topic: record.topic,
      notes: record.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!formData.subject || !formData.teacher || !formData.topic) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecord) {
        const updatedGrades = grades.map(record =>
          record.id === editingRecord.id
            ? {
                ...record,
                date: formData.date,
                subject: formData.subject,
                teacher: formData.teacher,
                grade: formData.grade,
                type: formData.type,
                topic: formData.topic,
                notes: formData.notes || undefined
              }
            : record
        );
        setGrades(updatedGrades);
        toast({
          title: "Muvaffaqiyat",
          description: "Baholar yozuvi yangilandi",
        });
      } else {
        const newRecord: GradeRecord = {
          id: Date.now(),
          date: formData.date,
          subject: formData.subject,
          teacher: formData.teacher,
          grade: formData.grade,
          type: formData.type,
          topic: formData.topic,
          notes: formData.notes || undefined
        };
        setGrades(prev => [...prev, newRecord]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi baholar yozuvi qo'shildi",
        });
      }

      setIsDialogOpen(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Xatolik",
        description: editingRecord ? "Yangilashda xatolik" : "Qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = (id: number) => {
    if (!confirm("Haqiqatan ham bu bahoni o'chirmoqchimisiz?")) return;

    try {
      setGrades(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Baholar yozuvi o'chirildi",
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const getGradeBadge = (grade: number) => {
    const gradeConfig = {
      5: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
      4: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
      3: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
      2: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
    };

    const bgClass = gradeConfig[grade as keyof typeof gradeConfig] || 'bg-gray-100 text-gray-800';

    return (
      <Badge className={`font-bold text-lg px-4 py-2 rounded-xl border-none ${bgClass}`}>
        <Star className="h-4 w-4 mr-1" />
        {grade}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      test: { 
        bg: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
        text: "Test" 
      },
      homework: { 
        bg: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
        text: "Uy vazifasi" 
      },
      classwork: { 
        bg: 'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800',
        text: "Dars ishi" 
      },
      exam: { 
        bg: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
        text: "Imtihon" 
      }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${config.bg}`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="text-center">
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
              O'quvchi Baholari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Farid Karimov - 5-A sinf
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className={`font-semibold text-gray-700 dark:text-gray-200 ${isToday(selectedDate) ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                {formatDate(selectedDate)}
              </span>
              {isToday(selectedDate) && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-semibold px-2 py-1 text-xs">
                  Bugun
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha Baho
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {stats.average}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {stats.total} ta baho
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              A'lo Baholar
            </CardTitle>
            <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.excellent}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              5 baholar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Yaxshi Baholar
            </CardTitle>
            <Star className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.good}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              4 baholar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Qoniqarli
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {stats.satisfactory}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              3 baholar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      {stats.subjectAverages.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Fanlar bo'yicha o'rtacha baholar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.subjectAverages.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{item.subject}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-bold px-3 py-1 rounded-lg text-lg">
                    {item.average}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2" />
              Baho qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {editingRecord ? "Bahoni tahrirlash" : "Yangi baho qo'shish"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                Baho ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sana
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fan *
                </Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Fanni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacher" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  O'qituvchi *
                </Label>
                <Select 
                  value={formData.teacher} 
                  onValueChange={(value) => setFormData({ ...formData, teacher: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="O'qituvchini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Baho
                </Label>
                <Select 
                  value={formData.grade.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, grade: parseInt(value) })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Bahoni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 (A'lo)</SelectItem>
                    <SelectItem value="4">4 (Yaxshi)</SelectItem>
                    <SelectItem value="3">3 (Qoniqarli)</SelectItem>
                    <SelectItem value="2">2 (Qoniqarsiz)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Baho turi
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'test' | 'homework' | 'classwork' | 'exam') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Baho turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Mavzu *
                </Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Baholangan mavzu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Izoh (ixtiyoriy)
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Qo'shimcha izoh"
                />
              </div>
            </div>
            
            <DialogFooter className="flex gap-3">
              <Button 
                onClick={() => setIsDialogOpen(false)} 
                variant="outline"
                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={handleSaveRecord} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {editingRecord ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grades List */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Kunlik Baholar
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            {formatDate(selectedDate)} sanasidagi barcha baholar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {filteredGrades.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Baholar yo'q
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Ushbu sana uchun baholar kiritilmagan
              </p>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Birinchi bahoni qo'shish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrades.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getGradeBadge(record.grade)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                              {record.subject}
                            </h4>
                            {getTypeBadge(record.type)}
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                            {record.topic}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {record.teacher}
                              </span>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                {record.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(record)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradesPage;