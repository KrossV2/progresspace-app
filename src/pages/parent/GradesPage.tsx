import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, BookOpen, Star, Plus, Edit, Trash2, Target, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/parent/GradesPage.css";

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

    // Calculate subject averages
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
        // UPDATE
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
        // CREATE
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

  const getGradeColor = (grade: number) => {
    if (grade === 5) return "grade-excellent";
    if (grade === 4) return "grade-good";
    if (grade === 3) return "grade-satisfactory";
    return "grade-poor";
  };

  const getGradeBadge = (grade: number) => {
    return (
      <Badge className={`grade-badge ${getGradeColor(grade)}`}>
        <Star className="grade-icon" />
        {grade}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      test: { bg: "type-test", text: "Test" },
      homework: { bg: "type-homework", text: "Uy vazifasi" },
      classwork: { bg: "type-classwork", text: "Dars ishi" },
      exam: { bg: "type-exam", text: "Imtihon" }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    return (
      <Badge variant="outline" className={`type-badge ${config.bg}`}>
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
      <div className="grades-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grades-page">
      <div className="grades-header">
        <div>
          <h1 className="grades-title">O'quvchi Baholari</h1>
          <p className="grades-subtitle">
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
      <div className="grades-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha Baho</CardTitle>
            <TrendingUp className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {stats.average}
            </div>
            <p className="stat-card-description">
              {stats.total} ta baho
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">A'lo Baholar</CardTitle>
            <Award className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-excellent">
              {stats.excellent}
            </div>
            <p className="stat-card-description">
              5 baholar
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Yaxshi Baholar</CardTitle>
            <Star className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-good">
              {stats.good}
            </div>
            <p className="stat-card-description">
              4 baholar
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Qoniqarli</CardTitle>
            <Target className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-satisfactory">
              {stats.satisfactory}
            </div>
            <p className="stat-card-description">
              3 baholar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      {stats.subjectAverages.length > 0 && (
        <Card className="subject-averages-card">
          <CardHeader>
            <CardTitle className="subject-averages-title">
              <BookOpen className="title-icon" />
              Fanlar bo'yicha o'rtacha baholar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="subject-averages-list">
              {stats.subjectAverages.map((item, index) => (
                <div key={index} className="subject-average-item">
                  <span className="subject-name">{item.subject}</span>
                  <div className="average-value">
                    <Star className="average-icon" />
                    {item.average}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grades Actions */}
      <div className="grades-actions">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="add-btn">
              <Plus className="btn-icon" />
              Baho qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="grades-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingRecord ? "Bahoni tahrirlash" : "Yangi baho qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Baho ma'lumotlarini kiriting va saqlang.
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
                <Label htmlFor="subject" className="form-label">
                  Fan *
                </Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="form-select">
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
                <Label htmlFor="grade" className="form-label">
                  Baho
                </Label>
                <Select 
                  value={formData.grade.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, grade: parseInt(value) })}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="type" className="form-label">
                  Baho turi
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'test' | 'homework' | 'classwork' | 'exam') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="topic" className="form-label">
                  Mavzu *
                </Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="form-input"
                  placeholder="Baholangan mavzu"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="notes" className="form-label">
                  Izoh (ixtiyoriy)
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  placeholder="Qo'shimcha izoh"
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

      {/* Grades Details */}
      <Card className="grades-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Kunlik Baholar</CardTitle>
          <CardDescription className="table-card-description">
            {formatDate(selectedDate)} sanasidagi barcha baholar
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          {filteredGrades.length === 0 ? (
            <div className="empty-state">
              <BookOpen className="empty-icon" />
              <h3>Baholar yo'q</h3>
              <p>Ushbu sana uchun baholar kiritilmagan</p>
              <Button onClick={openCreateDialog} className="add-btn">
                <Plus className="btn-icon" />
                Birinchi bahoni qo'shish
              </Button>
            </div>
          ) : (
            <div className="grades-list">
              {filteredGrades.map((record) => (
                <div key={record.id} className="grade-item">
                  <div className="grade-main">
                    <div className="grade-info">
                      <div className="subject-grade">
                        {getGradeBadge(record.grade)}
                      </div>
                      
                      <div className="grade-details">
                        <div className="subject-name">{record.subject}</div>
                        <div className="topic">{record.topic}</div>
                        <div className="meta-info">
                          <span className="teacher">{record.teacher}</span>
                          <span className="type">• {getTypeBadge(record.type)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grade-actions">
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
                  
                  {record.notes && (
                    <div className="grade-notes">
                      <span>{record.notes}</span>
                    </div>
                  )}
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