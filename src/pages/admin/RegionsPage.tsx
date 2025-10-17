import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, BookOpen, Users, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/admin/RegionsPage.css";

interface Subject {
  id: number;
  name: string;
  description: string;
  hoursPerWeek: number;
  category: 'science' | 'humanities' | 'languages' | 'arts' | 'sports';
  status: 'active' | 'inactive';
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hoursPerWeek: "",
    category: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'science', label: 'Tabiiy fanlar', color: 'blue' },
    { value: 'humanities', label: 'Ijtimoiy fanlar', color: 'green' },
    { value: 'languages', label: 'Tillar', color: 'purple' },
    { value: 'arts', label: 'San\'at', color: 'orange' },
    { value: 'sports', label: 'Sport', color: 'red' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const subjectsData: Subject[] = [
        {
          id: 1,
          name: "Matematika",
          description: "Raqamlar va hisoblash fanı",
          hoursPerWeek: 5,
          category: 'science',
          status: 'active'
        },
        {
          id: 2,
          name: "Ona tili",
          description: "O'zbek tili grammatikasi va adabiyoti",
          hoursPerWeek: 4,
          category: 'languages',
          status: 'active'
        },
        {
          id: 3,
          name: "Ingliz tili",
          description: "Chet tili o'qitish",
          hoursPerWeek: 3,
          category: 'languages',
          status: 'active'
        },
        {
          id: 4,
          name: "Fizika",
          description: "Tabiat qonuniyatlari fanı",
          hoursPerWeek: 2,
          category: 'science',
          status: 'active'
        },
        {
          id: 5,
          name: "Tarix",
          description: "O'tmish davrlari va voqealar",
          hoursPerWeek: 2,
          category: 'humanities',
          status: 'active'
        },
        {
          id: 6,
          name: "Jismoniy tarbiya",
          description: "Sport mashg'ulotlari",
          hoursPerWeek: 2,
          category: 'sports',
          status: 'active'
        },
      ];

      setSubjects(subjectsData);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Haqiqatan ham bu fanni o'chirmoqchimisiz?")) return;

    try {
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Fan muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fanni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveSubject = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.hoursPerWeek || !formData.category) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubject) {
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id 
            ? { 
                ...subject, 
                name: formData.name,
                description: formData.description,
                hoursPerWeek: parseInt(formData.hoursPerWeek),
                category: formData.category as Subject['category']
              }
            : subject
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Fan muvaffaqiyatli yangilandi",
        });
      } else {
        const newSubject: Subject = { 
          id: Date.now(), 
          name: formData.name,
          description: formData.description,
          hoursPerWeek: parseInt(formData.hoursPerWeek),
          category: formData.category as Subject['category'],
          status: 'active'
        };
        setSubjects([...subjects, newSubject]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi fan muvaffaqiyatli qo'shildi",
        });
      }

      setFormData({
        name: "",
        description: "",
        hoursPerWeek: "",
        category: "",
      });
      setEditingSubject(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingSubject ? "Fanni yangilashda xatolik" : "Fan qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      hoursPerWeek: subject.hoursPerWeek.toString(),
      category: subject.category,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      description: "",
      hoursPerWeek: "",
      category: "",
    });
    setIsDialogOpen(true);
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    subjects.forEach(subject => {
      const categoryName = categories.find(c => c.value === subject.category)?.label || "Noma'lum";
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });
    return stats;
  };

  const getCategoryColor = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig?.color || 'gray';
  };

  const getCategoryLabel = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig?.label || 'Noma\'lum';
  };

  if (loading) {
    return (
      <div className="subjects-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hoursPerWeek, 0);

  return (
    <div className="subjects-page">
      <div className="subjects-header">
        <div>
          <h1 className="subjects-title">Fanlar Boshqaruvi</h1>
          <p className="subjects-subtitle">Barcha fanlarni boshqaring va dasturni sozlang</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <Plus className="btn-icon" />
              Yangi fan
            </Button>
          </DialogTrigger>
          <DialogContent className="subject-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingSubject ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Fan ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="name" className="form-label">
                  Fan nomi *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Fan nomini kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="description" className="form-label">
                  Tavsif *
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  placeholder="Fan haqida qisqacha ma'lumot"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="hoursPerWeek" className="form-label">
                  Haftalik soat *
                </Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
                  className="form-input"
                  placeholder="Haftasiga soat soni"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="category" className="form-label">
                  Kategoriya *
                </Label>
                <select 
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-input"
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveSubject} className="btn btn-primary">
                {editingSubject ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="subjects-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami Fanlar</CardTitle>
            <BookOpen className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{subjects.length}</div>
            <p className="stat-card-description">
              Barcha ro'yxatga olingan fanlar
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Haftalik Soat</CardTitle>
            <Clock className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-hours">{totalHours}</div>
            <p className="stat-card-description">
              Jami dars soatlari
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Kategoriyalar</CardTitle>
            <Target className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-categories">
              {new Set(subjects.map(s => s.category)).size}
            </div>
            <p className="stat-card-description">
              Fan kategoriyalari
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha Soat</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {subjects.length > 0 ? Math.round(totalHours / subjects.length * 10) / 10 : 0}
            </div>
            <p className="stat-card-description">
              Har fanda o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Distribution */}
      <Card className="categories-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Kategoriyalar Bo'yicha Taqsimot</CardTitle>
          <CardDescription className="table-card-description">
            Har bir kategoriyadagi fanlar soni
          </CardDescription>
        </CardHeader>
        <CardContent className="categories-content">
          <div className="categories-grid">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <BookOpen className="category-icon" />
                  <span className="category-name">{category}</span>
                </div>
                <Badge className="category-count">
                  {count} ta fan
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="subjects-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Fanlar Ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {subjects.length} ta fan mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="subjects-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Fan Nomi</TableHead>
                <TableHead className="table-header-cell">Tavsif</TableHead>
                <TableHead className="table-header-cell">Haftalik Soat</TableHead>
                <TableHead className="table-header-cell">Kategoriya</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {subjects.map((subject, index) => (
                <TableRow key={subject.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell">
                    <div className="subject-info">
                      <BookOpen className="subject-icon" />
                      <span className="subject-name">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <span className="subject-description">{subject.description}</span>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge variant="outline" className="hours-badge">
                      <Clock className="hours-icon" />
                      {subject.hoursPerWeek} soat
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`category-badge category-${getCategoryColor(subject.category)}`}>
                      {getCategoryLabel(subject.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge status-${subject.status}`}>
                      {subject.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="action-button action-button-sm action-delete"
                      >
                        <Trash2 className="action-icon" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectsPage;