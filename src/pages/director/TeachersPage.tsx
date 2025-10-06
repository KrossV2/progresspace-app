import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, BookOpen, UserPlus, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/TeachersPage.css";

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  subjects: Subject[];
  isClassTeacher: boolean;
  className?: string;
  isActive: boolean;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const subjectsData = [
        { id: 1, name: "Matematika" },
        { id: 2, name: "Fizika" },
        { id: 3, name: "Ona tili" },
        { id: 4, name: "Ingliz tili" },
        { id: 5, name: "Kimyo" },
        { id: 6, name: "Biologiya" },
        { id: 7, name: "Tarix" },
        { id: 8, name: "Geografiya" },
      ];

      const teachersData = [
        { 
          id: 1, 
          firstName: "Nilufar", 
          lastName: "Karimova", 
          email: "nilufar.karimova@school.uz",
          phoneNumber: "+998901234567",
          subjects: [{ id: 1, name: "Matematika" }],
          isClassTeacher: true,
          className: "1-A",
          isActive: true
        },
        { 
          id: 2, 
          firstName: "Bekzod", 
          lastName: "Tursunov", 
          email: "bekzod.tursunov@school.uz",
          phoneNumber: "+998912345678",
          subjects: [{ id: 2, name: "Fizika" }, { id: 1, name: "Matematika" }],
          isClassTeacher: true,
          className: "10-A",
          isActive: true
        },
        { 
          id: 3, 
          firstName: "Sevara", 
          lastName: "Norova", 
          email: "sevara.norova@school.uz",
          subjects: [{ id: 3, name: "Ona tili" }],
          isClassTeacher: true,
          className: "1-B",
          isActive: true
        },
        { 
          id: 4, 
          firstName: "Davron", 
          lastName: "Umarov", 
          email: "davron.umarov@school.uz",
          phoneNumber: "+998909876543",
          subjects: [{ id: 4, name: "Ingliz tili" }],
          isClassTeacher: false,
          isActive: true
        },
        { 
          id: 5, 
          firstName: "Gulnora", 
          lastName: "Sharipova", 
          email: "gulnora.sharipova@school.uz",
          subjects: [{ id: 5, name: "Kimyo" }, { id: 6, name: "Biologiya" }],
          isClassTeacher: false,
          isActive: false
        },
      ];

      setSubjects(subjectsData);
      setTeachers(teachersData);
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

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Haqiqatan ham bu o'qituvchini o'chirmoqchimisiz?")) return;

    try {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "O'qituvchi muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'qituvchini o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveTeacher = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Xatolik",
        description: "Ism, familiya va email majburiy",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTeacher) {
        setTeachers(teachers.map(teacher => 
          teacher.id === editingTeacher.id 
            ? { ...teacher, ...formData }
            : teacher
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "O'qituvchi muvaffaqiyatli yangilandi",
        });
      } else {
        const newTeacher = { 
          id: Date.now(), 
          ...formData,
          subjects: [],
          isClassTeacher: false,
          isActive: true
        };
        setTeachers([...teachers, newTeacher]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi o'qituvchi muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingTeacher ? "O'qituvchini yangilashda xatolik" : "O'qituvchi qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleAddSubject = async () => {
    if (!selectedSubjectId || !selectedTeacher) return;

    try {
      const subject = subjects.find(s => s.id === parseInt(selectedSubjectId));
      if (subject) {
        setTeachers(teachers.map(teacher => 
          teacher.id === selectedTeacher.id 
            ? { 
                ...teacher, 
                subjects: [...teacher.subjects, subject]
              }
            : teacher
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Fan muvaffaqiyatli qo'shildi",
        });
      }

      setSelectedSubjectId("");
      setIsSubjectDialogOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fan qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTeacher(null);
    setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    setIsDialogOpen(true);
  };

  const openSubjectDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setSelectedSubjectId("");
    setIsSubjectDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="teachers-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teachers-page">
      <div className="teachers-header">
        <div>
          <h1 className="teachers-title">O'qituvchilar</h1>
          <p className="teachers-subtitle">Maktabdagi barcha o'qituvchilarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <UserPlus className="btn-icon" />
              Yangi o'qituvchi
            </Button>
          </DialogTrigger>
          <DialogContent className="teacher-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                O'qituvchi ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="firstName" className="form-label">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-input"
                  placeholder="Ismni kiriting"
                />
              </div>
              <div className="form-row">
                <Label htmlFor="lastName" className="form-label">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-input"
                  placeholder="Familiyani kiriting"
                />
              </div>
              <div className="form-row">
                <Label htmlFor="email" className="form-label">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-row">
                <Label htmlFor="phoneNumber" className="form-label">
                  Telefon
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="form-input"
                  placeholder="+998901234567"
                />
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveTeacher} className="btn btn-primary">
                {editingTeacher ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="teachers-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami o'qituvchilar</CardTitle>
            <UserPlus className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{teachers.length}</div>
            <p className="stat-card-description">
              {teachers.filter(t => t.isActive).length} faol, {teachers.filter(t => !t.isActive).length} nofaol
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Sinf rahbarlari</CardTitle>
            <UserPlus className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-class-teacher">
              {teachers.filter(t => t.isClassTeacher).length}
            </div>
            <p className="stat-card-description">
              Sinf rahbarligi qiluvchi o'qituvchilar
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Fan o'qituvchilari</CardTitle>
            <BookOpen className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-subject-teacher">
              {teachers.filter(t => !t.isClassTeacher).length}
            </div>
            <p className="stat-card-description">
              Faqat fan o'qituvchilari
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha fanlar</CardTitle>
            <BookOpen className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.subjects.length, 0) / teachers.length * 10) / 10 : 0}
            </div>
            <p className="stat-card-description">
              Har bir o'qituvchi o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="teachers-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">O'qituvchilar ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {teachers.length} ta o'qituvchi mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="teachers-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Ism Familiya</TableHead>
                <TableHead className="table-header-cell">Email</TableHead>
                <TableHead className="table-header-cell">Telefon</TableHead>
                <TableHead className="table-header-cell">Fanlar</TableHead>
                <TableHead className="table-header-cell">Sinf rahbarligi</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {teachers.map((teacher, index) => (
                <TableRow key={teacher.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell font-medium">
                    <div className="teacher-name">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="contact-info">
                      <Mail className="contact-icon" />
                      {teacher.email}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="contact-info">
                      <Phone className="contact-icon" />
                      {teacher.phoneNumber || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="subjects-container">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject.id} variant="outline" className="subject-badge">
                          {subject.name}
                        </Badge>
                      ))}
                      {teacher.subjects.length === 0 && (
                        <span className="no-subjects">Fan tayinlanmagan</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    {teacher.isClassTeacher ? (
                      <Badge className="class-teacher-badge">
                        {teacher.className}
                      </Badge>
                    ) : (
                      <span className="no-class">-</span>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge ${teacher.isActive ? 'status-active' : 'status-inactive'}`}>
                      {teacher.isActive ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSubjectDialog(teacher)}
                        className="action-button action-button-sm action-subject"
                      >
                        <BookOpen className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(teacher)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
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

      {/* Add Subject Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="subject-dialog">
          <DialogHeader>
            <DialogTitle className="dialog-title">Fan qo'shish</DialogTitle>
            <DialogDescription className="dialog-description">
              {selectedTeacher?.firstName} {selectedTeacher?.lastName} uchun yangi fan qo'shing.
            </DialogDescription>
          </DialogHeader>
          <div className="dialog-form">
            <div className="form-row">
              <Label htmlFor="subject" className="form-label">
                Fan
              </Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Fanni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {subjects
                    .filter(subject => !selectedTeacher?.subjects.some(s => s.id === subject.id))
                    .map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="dialog-footer">
            <Button onClick={handleAddSubject} className="btn btn-primary">Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;