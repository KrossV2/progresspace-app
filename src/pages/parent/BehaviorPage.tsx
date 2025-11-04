import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, TrendingUp, Users, AlertCircle, CheckCircle2, XCircle, Plus, Edit, Trash2, Star, Target, ChevronLeft, ChevronRight, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BehaviorRecord {
  id: number;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  teacher: string;
  description: string;
  points: number;
  subject?: string;
}

interface BehaviorStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  totalPoints: number;
  averagePoints: number;
}

const BehaviorsPage = () => {
  const [behaviors, setBehaviors] = useState<BehaviorRecord[]>([]);
  const [filteredBehaviors, setFilteredBehaviors] = useState<BehaviorRecord[]>([]);
  const [stats, setStats] = useState<BehaviorStats>({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    totalPoints: 0,
    averagePoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BehaviorRecord | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    type: "positive" as 'positive' | 'negative' | 'neutral',
    category: "",
    teacher: "",
    description: "",
    points: 1,
    subject: ""
  });
  const { toast } = useToast();

  const behaviorCategories = [
    "Darsda faollik",
    "Uy vazifasi",
    "Jamoaviy ish",
    "Intizom",
    "Xulq-atvor",
    "Yordamchilik",
    "Ijodiy yondashuv",
    "Sport",
    "San'at",
    "Boshqalar"
  ];

  const teachers = [
    "Nilufar Karimova",
    "Bekzod Tursunov",
    "Sevara Norova",
    "Davron Umarov",
    "Malika Tosheva",
    "Aziz Karimov"
  ];

  const subjects = [
    "Matematika",
    "Fizika",
    "Ona tili",
    "Ingliz tili",
    "Tarix",
    "Biologiya",
    "Kimyo",
    "Geografiya",
    "Informatika"
  ];

  useEffect(() => {
    fetchBehaviorsData();
  }, []);

  useEffect(() => {
    filterBehaviorsByDate();
    calculateStats(behaviors);
  }, [behaviors, selectedDate]);

  const fetchBehaviorsData = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0];

      const mockData: BehaviorRecord[] = [
        {
          id: 1,
          date: today,
          type: "positive",
          category: "Darsda faollik",
          teacher: "Nilufar Karimova",
          description: "Darsda juda faol ishtirok etdi, murakkab masalalarni yechdi",
          points: 3,
          subject: "Matematika"
        },
        {
          id: 2,
          date: today,
          type: "positive",
          category: "Yordamchilik",
          teacher: "Bekzod Tursunov",
          description: "Sinfdoshlariga fizika darsida yordam berdi",
          points: 2,
          subject: "Fizika"
        },
        {
          id: 3,
          date: yesterday,
          type: "negative",
          category: "Intizom",
          teacher: "Sevara Norova",
          description: "Dars vaqtida telefon bilan o'ynagan",
          points: -2,
          subject: "Ona tili"
        },
        {
          id: 4,
          date: yesterday,
          type: "neutral",
          category: "Uy vazifasi",
          teacher: "Davron Umarov",
          description: "Uy vazifasini vaqtida topshirdi",
          points: 1,
          subject: "Ingliz tili"
        }
      ];

      setBehaviors(mockData);
    } catch (error) {
      console.error('Error fetching behaviors data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBehaviorsByDate = () => {
    const filtered = behaviors.filter(record => record.date === selectedDate);
    setFilteredBehaviors(filtered);
  };

  const calculateStats = (data: BehaviorRecord[]) => {
    const filteredData = data.filter(record => record.date === selectedDate);
    const positive = filteredData.filter(record => record.type === 'positive').length;
    const negative = filteredData.filter(record => record.type === 'negative').length;
    const neutral = filteredData.filter(record => record.type === 'neutral').length;
    const total = filteredData.length;
    const totalPoints = filteredData.reduce((sum, record) => sum + record.points, 0);
    const averagePoints = total > 0 ? Math.round((totalPoints / total) * 10) / 10 : 0;

    setStats({
      total,
      positive,
      negative,
      neutral,
      totalPoints,
      averagePoints
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
      type: "positive",
      category: "",
      teacher: "",
      description: "",
      points: 1,
      subject: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: BehaviorRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      type: record.type,
      category: record.category,
      teacher: record.teacher,
      description: record.description,
      points: record.points,
      subject: record.subject || ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!formData.category || !formData.teacher || !formData.description) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecord) {
        const updatedBehaviors = behaviors.map(record =>
          record.id === editingRecord.id
            ? {
                ...record,
                date: formData.date,
                type: formData.type,
                category: formData.category,
                teacher: formData.teacher,
                description: formData.description,
                points: formData.points,
                subject: formData.subject || undefined
              }
            : record
        );
        setBehaviors(updatedBehaviors);
        toast({
          title: "Muvaffaqiyat",
          description: "Xulq-atvor yozuvi yangilandi",
        });
      } else {
        const newRecord: BehaviorRecord = {
          id: Date.now(),
          date: formData.date,
          type: formData.type,
          category: formData.category,
          teacher: formData.teacher,
          description: formData.description,
          points: formData.points,
          subject: formData.subject || undefined
        };
        setBehaviors(prev => [...prev, newRecord]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi xulq-atvor yozuvi qo'shildi",
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
    if (!confirm("Haqiqatan ham bu xulq-atvor yozuvini o'chirmoqchimisiz?")) return;

    try {
      setBehaviors(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Xulq-atvor yozuvi o'chirildi",
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      positive: {
        bg: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none",
        icon: CheckCircle2,
        text: "Ijobiy"
      },
      negative: {
        bg: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none",
        icon: XCircle,
        text: "Salbiy"
      },
      neutral: {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-none",
        icon: AlertCircle,
        text: "Neytral"
      }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full ${config.bg}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getPointsBadge = (points: number) => {
    const isPositive = points > 0;
    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
        isPositive 
          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' 
          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
      }`}>
        <TrendingUp className="h-4 w-4 mr-1" />
        {points > 0 ? `+${points}` : points}
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
              O'quvchi Xulq-atvori
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
              Jami Yozuvlar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Kunlik xulq-atvor yozuvlari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Ijobiy
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.positive}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Ijobiy xulq-atvorlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Ballar
            </CardTitle>
            <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.totalPoints}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Jami to'plangan ballar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {stats.averagePoints}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              O'rtacha ball
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2" />
              Xulq-atvor qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {editingRecord ? "Xulq-atvorni tahrirlash" : "Yangi xulq-atvor qo'shish"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                Xulq-atvor ma'lumotlarini kiriting va saqlang.
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
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Turi
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'positive' | 'negative' | 'neutral') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Xulq-atvor turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Ijobiy</SelectItem>
                    <SelectItem value="negative">Salbiy</SelectItem>
                    <SelectItem value="neutral">Neytral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Kategoriya *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {behaviorCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fan (ixtiyoriy)
                </Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Fanni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Fan tanlanmagan</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ballar
                </Label>
                <Select 
                  value={formData.points.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, points: parseInt(value) })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                    <SelectValue placeholder="Ballarni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">+5 (A'lo)</SelectItem>
                    <SelectItem value="4">+4 (Yaxshi)</SelectItem>
                    <SelectItem value="3">+3 (Qoniqarli)</SelectItem>
                    <SelectItem value="2">+2</SelectItem>
                    <SelectItem value="1">+1</SelectItem>
                    <SelectItem value="-1">-1</SelectItem>
                    <SelectItem value="-2">-2</SelectItem>
                    <SelectItem value="-3">-3</SelectItem>
                    <SelectItem value="-4">-4</SelectItem>
                    <SelectItem value="-5">-5 (Jiddiy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tavsif *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors resize-none"
                  placeholder="Xulq-atvor haqida batafsil ma'lumot..."
                  rows={4}
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

      {/* Behaviors List */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Kunlik Xulq-atvor
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            {formatDate(selectedDate)} sanasidagi barcha xulq-atvor yozuvlari
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {filteredBehaviors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Xulq-atvor yozuvlari yo'q
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Ushbu sana uchun xulq-atvor yozuvlari kiritilmagan
              </p>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Birinchi yozuvni qo'shish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBehaviors.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none font-semibold px-3 py-1 rounded-lg">
                            {record.category}
                          </Badge>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-200 font-medium mb-2 leading-relaxed">
                            {record.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {record.teacher}
                              </span>
                            </div>
                            
                            {record.subject && (
                              <>
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {record.subject}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end gap-3 flex-shrink-0">
                      <div className="flex gap-2">
                        {getTypeBadge(record.type)}
                        {getPointsBadge(record.points)}
                      </div>
                      
                      <div className="flex gap-2">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorsPage;