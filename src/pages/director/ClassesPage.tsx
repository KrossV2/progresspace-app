import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Users, Plus, GraduationCap, UserCheck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/ClassesPage.css";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  subject?: string;
}

interface ClassData {
  id: number;
  name: string;
  grade: number;
  shift: 'morning' | 'evening';
  classTeacherId?: number;
  classTeacherName?: string;
  studentCount: number;
}

const ClassesPage = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    shift: "" as 'morning' | 'evening' | "",
    classTeacherId: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const teachersData = [
        { id: 1, firstName: "Nilufar", lastName: "Karimova", subject: "Matematika" },
        { id: 2, firstName: "Bekzod", lastName: "Tursunov", subject: "Fizika" },
        { id: 3, firstName: "Sevara", lastName: "Norova", subject: "Ona tili" },
        { id: 4, firstName: "Davron", lastName: "Umarov", subject: "Ingliz tili" },
      ];

      const classesData = [
        { 
          id: 1, 
          name: "1-A", 
          grade: 1, 
          shift: "morning" as const, 
          classTeacherId: 1,
          classTeacherName: "Nilufar Karimova",
          studentCount: 25
        },
        { 
          id: 2, 
          name: "1-B", 
          grade: 1, 
          shift: "morning" as const, 
          classTeacherId: 3,
          classTeacherName: "Sevara Norova",
          studentCount: 28
        },
        { 
          id: 3, 
          name: "2-A", 
          grade: 2, 
          shift: "evening" as const, 
          studentCount: 22
        },
        { 
          id: 4, 
          name: "10-A", 
          grade: 10, 
          shift: "morning" as const, 
          classTeacherId: 2,
          classTeacherName: "Bekzod Tursunov",
          studentCount: 30
        },
      ];

      setTeachers(teachersData);
      setClasses(classesData);
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

  const handleDeleteClass = async (id: number) => {
    if (!confirm("Haqiqatan ham bu sinfni o'chirmoqchimisiz?")) return;

    try {
      setClasses(classes.filter(cls => cls.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Sinf muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Sinfni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveClass = async () => {
    if (!formData.name.trim() || !formData.grade || !formData.shift) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      const teacherName = formData.classTeacherId ? 
        teachers.find(t => t.id === parseInt(formData.classTeacherId))?.firstName + " " +
        teachers.find(t => t.id === parseInt(formData.classTeacherId))?.lastName : undefined;

      if (editingClass) {
        setClasses(classes.map(cls => 
          cls.id === editingClass.id 
            ? { 
                ...cls, 
                name: formData.name,
                grade: parseInt(formData.grade),
                shift: formData.shift as 'morning' | 'evening',
                classTeacherId: formData.classTeacherId ? parseInt(formData.classTeacherId) : undefined,
                classTeacherName: teacherName
              }
            : cls
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Sinf muvaffaqiyatli yangilandi",
        });
      } else {
        const newClass = { 
          id: Date.now(), 
          name: formData.name,
          grade: parseInt(formData.grade),
          shift: formData.shift as 'morning' | 'evening',
          classTeacherId: formData.classTeacherId ? parseInt(formData.classTeacherId) : undefined,
          classTeacherName: teacherName,
          studentCount: 0
        };
        setClasses([...classes, newClass]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi sinf muvaffaqiyatli yaratildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingClass ? "Sinfni yangilashda xatolik" : "Sinf yaratishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", grade: "", shift: "", classTeacherId: "" });
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade.toString(),
      shift: cls.shift,
      classTeacherId: cls.classTeacherId?.toString() || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingClass(null);
    setFormData({ name: "", grade: "", shift: "", classTeacherId: "" });
    setIsDialogOpen(true);
  };

  const getShiftBadge = (shift: string) => {
    const colors = {
      morning: "shift-badge-morning",
      evening: "shift-badge-evening"
    };
    
    const labels = {
      morning: "Ertalabgi",
      evening: "Kechgi"
    };

    const icons = {
      morning: <Clock className="shift-icon" />,
      evening: <Clock className="shift-icon" />
    };

    return (
      <Badge className={`shift-badge ${colors[shift as keyof typeof colors]}`}>
        <span className="shift-badge-content">
          {icons[shift as keyof typeof icons]}
          {labels[shift as keyof typeof labels]}
        </span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="classes-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classes-page">
      <div className="classes-header">
        <div>
          <h1 className="classes-title">Sinflar</h1>
          <p className="classes-subtitle">Maktabdagi barcha sinflarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <Plus className="btn-icon" />
              Yangi sinf
            </Button>
          </DialogTrigger>
          <DialogContent className="class-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingClass ? "Sinfni tahrirlash" : "Yangi sinf yaratish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Sinf ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="name" className="form-label">
                  Sinf nomi
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Masalan: 1-A"
                />
              </div>
              <div className="form-row">
                <Label htmlFor="grade" className="form-label">
                  Sinf darajasi
                </Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Sinfni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        {grade}-sinf
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-row">
                <Label htmlFor="shift" className="form-label">
                  Smena
                </Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value as 'morning' | 'evening' })}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Smenani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Ertalabgi</SelectItem>
                    <SelectItem value="evening">Kechgi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-row">
                <Label htmlFor="teacher" className="form-label">
                  Sinf rahbari
                </Label>
                <Select value={formData.classTeacherId} onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="O'qituvchini tanlang (ixtiyoriy)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sinf rahbari tayinlanmagan</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.firstName} {teacher.lastName} ({teacher.subject})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveClass} className="btn btn-primary">
                {editingClass ? "Yangilash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="classes-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami sinflar</CardTitle>
            <GraduationCap className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{classes.length}</div>
            <p className="stat-card-description">
              {classes.filter(c => c.shift === 'morning').length} ertalabgi, {classes.filter(c => c.shift === 'evening').length} kechgi
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami o'quvchilar</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-students">
              {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
            </div>
            <p className="stat-card-description">
              Barcha sinflardagi o'quvchilar soni
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Sinf rahbarlari</CardTitle>
            <UserCheck className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-teachers">
              {classes.filter(c => c.classTeacherId).length}
            </div>
            <p className="stat-card-description">
              {classes.filter(c => !c.classTeacherId).length} sinf rahbarsiz
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha o'quvchi</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + cls.studentCount, 0) / classes.length) : 0}
            </div>
            <p className="stat-card-description">
              Har bir sinfda o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="classes-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Sinflar ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {classes.length} ta sinf mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="classes-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Sinf nomi</TableHead>
                <TableHead className="table-header-cell">Daraja</TableHead>
                <TableHead className="table-header-cell">Smena</TableHead>
                <TableHead className="table-header-cell">Sinf rahbari</TableHead>
                <TableHead className="table-header-cell">O'quvchilar soni</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {classes.map((cls, index) => (
                <TableRow key={cls.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell font-medium">
                    <div className="class-name">
                      {cls.name}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className="grade-badge">
                      {cls.grade}-sinf
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    {getShiftBadge(cls.shift)}
                  </TableCell>
                  <TableCell className="table-cell">
                    {cls.classTeacherName ? (
                      <div className="teacher-info">
                        <UserCheck className="teacher-icon" />
                        <span className="teacher-name">{cls.classTeacherName}</span>
                      </div>
                    ) : (
                      <span className="no-teacher">Tayinlanmagan</span>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className="students-badge">
                      {cls.studentCount} o'quvchi
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to students list */}}
                        className="action-button action-button-sm action-students"
                      >
                        <Users className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cls)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id)}
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

export default ClassesPage;