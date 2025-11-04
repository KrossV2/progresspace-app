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
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
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
              O'qituvchilar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Maktabdagi barcha o'qituvchilarni boshqaring
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Yangi o'qituvchi
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  O'qituvchi ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Ismni kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Familiyani kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="+998901234567"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveTeacher}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingTeacher ? "Yangilash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami o'qituvchilar
            </CardTitle>
            <UserPlus className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {teachers.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {teachers.filter(t => t.isActive).length} faol, {teachers.filter(t => !t.isActive).length} nofaol
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sinf rahbarlari
            </CardTitle>
            <UserPlus className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {teachers.filter(t => t.isClassTeacher).length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Sinf rahbarligi qiluvchi o'qituvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Fan o'qituvchilari
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {teachers.filter(t => !t.isClassTeacher).length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faqat fan o'qituvchilari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha fanlar
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.subjects.length, 0) / teachers.length * 10) / 10 : 0}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Har bir o'qituvchi o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            O'qituvchilar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {teachers.length} ta o'qituvchi mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Ism Familiya</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Telefon</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fanlar</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf rahbarligi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher, index) => (
                <TableRow 
                  key={teacher.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {teacher.email}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {teacher.phoneNumber || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge 
                          key={subject.id} 
                          variant="outline"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 font-medium px-2 py-1 rounded-lg text-xs"
                        >
                          {subject.name}
                        </Badge>
                      ))}
                      {teacher.subjects.length === 0 && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Fan tayinlanmagan</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {teacher.isClassTeacher ? (
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-none font-semibold px-3 py-1 rounded-full">
                        {teacher.className}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
                      teacher.isActive 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                    }`}>
                      {teacher.isActive ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSubjectDialog(teacher)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(teacher)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
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
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Fan qo'shish
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              {selectedTeacher?.firstName} {selectedTeacher?.lastName} uchun yangi fan qo'shing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Fan
              </Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
                  <SelectValue placeholder="Fanni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                  {subjects
                    .filter(subject => !selectedTeacher?.subjects.some(s => s.id === subject.id))
                    .map((subject) => (
                    <SelectItem 
                      key={subject.id} 
                      value={subject.id.toString()}
                      className="text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleAddSubject}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
            >
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;