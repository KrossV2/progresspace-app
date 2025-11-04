import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Users, Plus, GraduationCap, UserCheck, Clock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [searchTerm, setSearchTerm] = useState("");
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
    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
        shift === 'morning' 
          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800" 
          : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
      }`}>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {shift === 'morning' ? "Ertalabgi" : "Kechgi"}
        </span>
      </Badge>
    );
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculations
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const morningClasses = classes.filter(c => c.shift === 'morning').length;
  const eveningClasses = classes.filter(c => c.shift === 'evening').length;
  const classesWithTeachers = classes.filter(c => c.classTeacherId).length;
  const averageStudents = classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;

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
              Sinflar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Maktabdagi barcha sinflarni boshqaring
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi sinf
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingClass ? "Sinfni tahrirlash" : "Yangi sinf yaratish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Sinf ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf nomi *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    placeholder="Masalan: 1-A"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf darajasi *
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
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
                
                <div className="space-y-2">
                  <Label htmlFor="shift" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Smena *
                  </Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value as 'morning' | 'evening' })}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
                      <SelectValue placeholder="Smenani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Ertalabgi</SelectItem>
                      <SelectItem value="evening">Kechgi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf rahbari
                  </Label>
                  <Select value={formData.classTeacherId} onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
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
                <Button 
                  onClick={handleSaveClass}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingClass ? "Yangilash" : "Yaratish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Sinflar
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {classes.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {morningClasses} ertalabgi, {eveningClasses} kechgi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami O'quvchilar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {totalStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha sinflardagi o'quvchilar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sinf Rahbarlari
            </CardTitle>
            <UserCheck className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {classesWithTeachers}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {classes.length - classesWithTeachers} sinf rahbarsiz
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha O'quvchi
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {averageStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Har bir sinfda o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Qidiruv va Filtrlash
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sinf nomi yoki sinf rahbari bo'yicha qidirish
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Sinf nomi yoki sinf rahbari bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredClasses.length} ta natija
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Sinflar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {classes.length} ta sinf mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf Nomi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Daraja</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Smena</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf Rahbari</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'quvchilar Soni</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls, index) => (
                <TableRow 
                  key={cls.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{cls.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold">
                      {cls.grade}-sinf
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {getShiftBadge(cls.shift)}
                  </TableCell>
                  <TableCell className="py-4">
                    {cls.classTeacherName ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400">{cls.classTeacherName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic">Tayinlanmagan</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                      {cls.studentCount} o'quvchi
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(cls)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id)}
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
    </div>
  );
};

export default ClassesPage;