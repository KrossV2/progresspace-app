import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

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

  // TODO: Replace with actual API URL
  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // const [classesResponse, teachersResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/director/classes`),
      //   fetch(`${API_BASE_URL}/api/director/teachers`)
      // ]);
      // const classesData = await classesResponse.json();
      // const teachersData = await teachersResponse.json();
      
      // Mock data for now
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/classes/${id}`, {
      //   method: 'DELETE',
      // });
      
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/director/classes/${editingClass.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     grade: parseInt(formData.grade),
        //     shift: formData.shift,
        //     classTeacherId: formData.classTeacherId ? parseInt(formData.classTeacherId) : null
        //   }),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/director/classes`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     grade: parseInt(formData.grade),
        //     shift: formData.shift,
        //     classTeacherId: formData.classTeacherId ? parseInt(formData.classTeacherId) : null
        //   }),
        // });
        // const newClass = await response.json();
        
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
    return (
      <Badge variant={shift === 'morning' ? 'default' : 'secondary'}>
        {shift === 'morning' ? 'Ertalabgi' : 'Kechgi'}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold">Sinflar</h1>
          <p className="text-muted-foreground">Maktabdagi barcha sinflarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi sinf
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Sinfni tahrirlash" : "Yangi sinf yaratish"}
              </DialogTitle>
              <DialogDescription>
                Sinf ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Sinf nomi
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Masalan: 1-A"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">
                  Sinf darajasi
                </Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift" className="text-right">
                  Smena
                </Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value as 'morning' | 'evening' })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Smenani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Ertalabgi</SelectItem>
                    <SelectItem value="evening">Kechgi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  Sinf rahbari
                </Label>
                <Select value={formData.classTeacherId} onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}>
                  <SelectTrigger className="col-span-3">
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
            <DialogFooter>
              <Button onClick={handleSaveClass}>
                {editingClass ? "Yangilash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami sinflar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              {classes.filter(c => c.shift === 'morning').length} ertalabgi, {classes.filter(c => c.shift === 'evening').length} kechgi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami o'quvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((sum, cls) => sum + cls.studentCount, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Barcha sinflardagi o'quvchilar soni
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinf rahbarlari</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.filter(c => c.classTeacherId).length}</div>
            <p className="text-xs text-muted-foreground">
              {classes.filter(c => !c.classTeacherId).length} sinf rahbarsiz
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha o'quvchi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + cls.studentCount, 0) / classes.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Har bir sinfda o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sinflar ro'yxati</CardTitle>
          <CardDescription>
            Jami {classes.length} ta sinf mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Sinf nomi</TableHead>
                <TableHead>Daraja</TableHead>
                <TableHead>Smena</TableHead>
                <TableHead>Sinf rahbari</TableHead>
                <TableHead>O'quvchilar soni</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls, index) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.grade}-sinf</TableCell>
                  <TableCell>{getShiftBadge(cls.shift)}</TableCell>
                  <TableCell>
                    {cls.classTeacherName ? (
                      <span className="text-green-600">{cls.classTeacherName}</span>
                    ) : (
                      <span className="text-amber-600">Tayinlanmagan</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {cls.studentCount} o'quvchi
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to students list */}}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id)}
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
    </div>
  );
};

export default ClassesPage;