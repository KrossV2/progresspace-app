import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, TrendingUp, Users, AlertCircle, CheckCircle2, XCircle, Plus, Edit, Trash2, Star, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/parent/BehaviorPage.css";

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
    calculateStats(behaviors); // Пересчитываем статистику для всех данных
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
    // Валидация формы
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
        // UPDATE - обновление существующей записи
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
        // CREATE - создание новой записи
        const newRecord: BehaviorRecord = {
          id: Date.now(), // Генерируем уникальный ID
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
    // DELETE - удаление записи
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
        bg: "type-positive",
        icon: CheckCircle2,
        text: "Ijobiy"
      },
      negative: {
        bg: "type-negative",
        icon: XCircle,
        text: "Salbiy"
      },
      neutral: {
        bg: "type-neutral",
        icon: AlertCircle,
        text: "Neytral"
      }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <Badge className={`type-badge ${config.bg}`}>
        <IconComponent className="type-icon" />
        {config.text}
      </Badge>
    );
  };

  const getPointsBadge = (points: number) => {
    const isPositive = points > 0;
    return (
      <Badge className={`points-badge ${isPositive ? 'points-positive' : 'points-negative'}`}>
        <TrendingUp className="points-icon" />
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
      <div className="behaviors-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="behaviors-page">
      <div className="behaviors-header">
        <div>
          <h1 className="behaviors-title">O'quvchi Xulq-atvori</h1>
          <p className="behaviors-subtitle">
            Farid Karimov - 5-A sinf
          </p>
        </div>
        
        <div className="date-navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="nav-btn"
          >
            <ChevronLeft className="nav-icon" />
          </Button>
          
          <div className="date-display">
            <Calendar className="date-icon" />
            <span className={`date-text ${isToday(selectedDate) ? 'today' : ''}`}>
              {formatDate(selectedDate)}
              {isToday(selectedDate) && <span className="today-badge">Bugun</span>}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
            className="nav-btn"
          >
            <ChevronRight className="nav-icon" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="behaviors-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami Yozuvlar</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-total">
              {stats.total}
            </div>
            <p className="stat-card-description">
              Kunlik xulq-atvor yozuvlari
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Ijobiy</CardTitle>
            <CheckCircle2 className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-positive">
              {stats.positive}
            </div>
            <p className="stat-card-description">
              Ijobiy xulq-atvorlar
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Ballar</CardTitle>
            <Star className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-points">
              {stats.totalPoints}
            </div>
            <p className="stat-card-description">
              Jami to'plangan ballar
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha</CardTitle>
            <Target className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {stats.averagePoints}
            </div>
            <p className="stat-card-description">
              O'rtacha ball
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Behaviors Actions */}
      <div className="behaviors-actions">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="add-btn">
              <Plus className="btn-icon" />
              Xulq-atvor qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="behaviors-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingRecord ? "Xulq-atvorni tahrirlash" : "Yangi xulq-atvor qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Xulq-atvor ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="date" className="form-label">
                  Sana
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="type" className="form-label">
                  Turi
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'positive' | 'negative' | 'neutral') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Xulq-atvor turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Ijobiy</SelectItem>
                    <SelectItem value="negative">Salbiy</SelectItem>
                    <SelectItem value="neutral">Neytral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="form-row">
                <Label htmlFor="category" className="form-label">
                  Kategoriya *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="teacher" className="form-label">
                  O'qituvchi *
                </Label>
                <Select 
                  value={formData.teacher} 
                  onValueChange={(value) => setFormData({ ...formData, teacher: value })}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="subject" className="form-label">
                  Fan (ixtiyoriy)
                </Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="points" className="form-label">
                  Ballar
                </Label>
                <Select 
                  value={formData.points.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, points: parseInt(value) })}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="description" className="form-label">
                  Tavsif *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Xulq-atvor haqida batafsil ma'lumot..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="dialog-footer">
              <Button 
                onClick={() => setIsDialogOpen(false)} 
                variant="outline"
                className="btn btn-secondary"
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={handleSaveRecord} 
                className="btn btn-primary"
              >
                {editingRecord ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Behaviors Details */}
      <Card className="behaviors-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Kunlik Xulq-atvor</CardTitle>
          <CardDescription className="table-card-description">
            {formatDate(selectedDate)} sanasidagi barcha xulq-atvor yozuvlari
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          {filteredBehaviors.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <h3>Xulq-atvor yozuvlari yo'q</h3>
              <p>Ushbu sana uchun xulq-atvor yozuvlari kiritilmagan</p>
              <Button onClick={openCreateDialog} className="add-btn">
                <Plus className="btn-icon" />
                Birinchi yozuvni qo'shish
              </Button>
            </div>
          ) : (
            <div className="behaviors-list">
              {filteredBehaviors.map((record) => (
                <div key={record.id} className="behavior-item">
                  <div className="behavior-main">
                    <div className="behavior-info">
                      <div className="behavior-category">
                        <div className="category-badge">{record.category}</div>
                      </div>
                      
                      <div className="behavior-details">
                        <div className="description">{record.description}</div>
                        <div className="meta-info">
                          <span className="teacher">{record.teacher}</span>
                          {record.subject && <span className="subject">• {record.subject}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="behavior-status">
                      {getTypeBadge(record.type)}
                      {getPointsBadge(record.points)}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(record)}
                      className="action-btn edit-btn"
                    >
                      <Edit className="action-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                      className="action-btn delete-btn"
                    >
                      <Trash2 className="action-icon" />
                    </Button>
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