import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, BookOpen, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

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

  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // const [teachersResponse, subjectsResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/director/teachers`),
      //   fetch(`${API_BASE_URL}/api/admin/subjects`)
      // ]);
      // const teachersData = await teachersResponse.json();
      // const subjectsData = await subjectsResponse.json();
      
      // Mock data for now
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/teachers/${id}`, {
      //   method: 'DELETE',
      // });
      
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/director/teachers/${editingTeacher.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/director/teachers`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        // });
        // const newTeacher = await response.json();
        
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/teachers/${selectedTeacher.id}/subjects`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ subjectId: parseInt(selectedSubjectId) }),
      // });

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">O'qituvchilar</h1>
          <p className="text-muted-foreground">Maktabdagi barcha o'qituvchilarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Yangi o'qituvchi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
              </DialogTitle>
              <DialogDescription>
                O'qituvchi ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="col-span-3"
                  placeholder="Ismni kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="col-span-3"
                  placeholder="Familiyani kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Telefon
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="+998901234567"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveTeacher}>
                {editingTeacher ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami o'qituvchilar</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.filter(t => t.isActive).length} faol, {teachers.filter(t => !t.isActive).length} nofaol
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinf rahbarlari</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => t.isClassTeacher).length}</div>
            <p className="text-xs text-muted-foreground">
              Sinf rahbarligi qiluvchi o'qituvchilar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fan o'qituvchilari</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => !t.isClassTeacher).length}</div>
            <p className="text-xs text-muted-foreground">
              Faqat fan o'qituvchilari
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha fanlar</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.subjects.length, 0) / teachers.length * 10) / 10 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Har bir o'qituvchi o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>O'qituvchilar ro'yxati</CardTitle>
          <CardDescription>
            Jami {teachers.length} ta o'qituvchi mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Ism Familiya</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Fanlar</TableHead>
                <TableHead>Sinf rahbarligi</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher, index) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{teacher.firstName} {teacher.lastName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phoneNumber || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject.id} variant="outline" className="text-xs">
                          {subject.name}
                        </Badge>
                      ))}
                      {teacher.subjects.length === 0 && (
                        <span className="text-muted-foreground text-sm">Fan tayinlanmagan</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {teacher.isClassTeacher ? (
                      <Badge className="bg-green-100 text-green-800">
                        {teacher.className}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={teacher.isActive ? "default" : "secondary"}>
                      {teacher.isActive ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSubjectDialog(teacher)}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fan qo'shish</DialogTitle>
            <DialogDescription>
              {selectedTeacher?.firstName} {selectedTeacher?.lastName} uchun yangi fan qo'shing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Fan
              </Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="col-span-3">
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
          <DialogFooter>
            <Button onClick={handleAddSubject}>Qo'shish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;