import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Clock, Calendar, BookOpen, Users, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
  id: number;
  name: string;
  grade: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  subjects: Subject[];
}

interface TimetableEntry {
  id: number;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dayOfWeek: number;
  lessonNumber: number;
  room?: string;
}

const TimetablesPage = () => {
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [formData, setFormData] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    dayOfWeek: "",
    lessonNumber: "",
    room: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const days = [
    { id: 1, name: "Dushanba" },
    { id: 2, name: "Seshanba" },
    { id: 3, name: "Chorshanba" },
    { id: 4, name: "Payshanba" },
    { id: 5, name: "Juma" },
    { id: 6, name: "Shanba" }
  ];

  const lessons = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1}-dars`,
    time: [
      "08:00-08:45",
      "08:55-09:40",
      "09:50-10:35",
      "10:55-11:40",
      "11:50-12:35",
      "12:45-13:30",
      "13:40-14:25",
      "14:35-15:20"
    ][i]
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const classesData = [
        { id: 1, name: "1-A", grade: 1 },
        { id: 2, name: "1-B", grade: 1 },
        { id: 3, name: "2-A", grade: 2 },
        { id: 4, name: "10-A", grade: 10 },
      ];

      const subjectsData = [
        { id: 1, name: "Matematika" },
        { id: 2, name: "Fizika" },
        { id: 3, name: "Ona tili" },
        { id: 4, name: "Ingliz tili" },
        { id: 5, name: "Kimyo" },
      ];

      const teachersData = [
        { id: 1, firstName: "Nilufar", lastName: "Karimova", subjects: [{ id: 1, name: "Matematika" }] },
        { id: 2, firstName: "Bekzod", lastName: "Tursunov", subjects: [{ id: 2, name: "Fizika" }] },
        { id: 3, firstName: "Sevara", lastName: "Norova", subjects: [{ id: 3, name: "Ona tili" }] },
        { id: 4, firstName: "Davron", lastName: "Umarov", subjects: [{ id: 4, name: "Ingliz tili" }] },
      ];

      const timetablesData = [
        {
          id: 1,
          classId: 1,
          className: "1-A",
          subjectId: 1,
          subjectName: "Matematika",
          teacherId: 1,
          teacherName: "Nilufar Karimova",
          dayOfWeek: 1,
          lessonNumber: 1,
          room: "101"
        },
        {
          id: 2,
          classId: 1,
          className: "1-A",
          subjectId: 3,
          subjectName: "Ona tili",
          teacherId: 3,
          teacherName: "Sevara Norova",
          dayOfWeek: 1,
          lessonNumber: 2,
          room: "102"
        },
        {
          id: 3,
          classId: 4,
          className: "10-A",
          subjectId: 2,
          subjectName: "Fizika",
          teacherId: 2,
          teacherName: "Bekzod Tursunov",
          dayOfWeek: 2,
          lessonNumber: 3,
          room: "Physics Lab"
        },
      ];

      setClasses(classesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setTimetables(timetablesData);
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

  const handleDeleteEntry = async (id: number) => {
    if (!confirm("Haqiqatan ham bu dars jadvalini o'chirmoqchimisiz?")) return;

    try {
      setTimetables(timetables.filter(entry => entry.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Dars jadvali muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Dars jadvalini o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = async () => {
    if (!formData.classId || !formData.subjectId || !formData.teacherId || 
        !formData.dayOfWeek || !formData.lessonNumber) {
      toast({
        title: "Xatolik",
        description: "Barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    const existingEntry = timetables.find(entry => 
      entry.classId === parseInt(formData.classId) &&
      entry.dayOfWeek === parseInt(formData.dayOfWeek) &&
      entry.lessonNumber === parseInt(formData.lessonNumber) &&
      entry.id !== editingEntry?.id
    );

    if (existingEntry) {
      toast({
        title: "Xatolik",
        description: "Bu vaqtda bu sinf uchun boshqa dars mavjud",
        variant: "destructive",
      });
      return;
    }

    try {
      const className = classes.find(c => c.id === parseInt(formData.classId))?.name || "";
      const subjectName = subjects.find(s => s.id === parseInt(formData.subjectId))?.name || "";
      const teacher = teachers.find(t => t.id === parseInt(formData.teacherId));
      const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "";

      if (editingEntry) {
        setTimetables(timetables.map(entry => 
          entry.id === editingEntry.id 
            ? { 
                ...entry, 
                classId: parseInt(formData.classId),
                className,
                subjectId: parseInt(formData.subjectId),
                subjectName,
                teacherId: parseInt(formData.teacherId),
                teacherName,
                dayOfWeek: parseInt(formData.dayOfWeek),
                lessonNumber: parseInt(formData.lessonNumber),
                room: formData.room
              }
            : entry
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Dars jadvali muvaffaqiyatli yangilandi",
        });
      } else {
        const newEntry = { 
          id: Date.now(), 
          classId: parseInt(formData.classId),
          className,
          subjectId: parseInt(formData.subjectId),
          subjectName,
          teacherId: parseInt(formData.teacherId),
          teacherName,
          dayOfWeek: parseInt(formData.dayOfWeek),
          lessonNumber: parseInt(formData.lessonNumber),
          room: formData.room
        };
        setTimetables([...timetables, newEntry]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi dars jadvali muvaffaqiyatli yaratildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingEntry ? "Dars jadvalini yangilashda xatolik" : "Dars jadvali yaratishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ classId: "", subjectId: "", teacherId: "", dayOfWeek: "", lessonNumber: "", room: "" });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      classId: entry.classId.toString(),
      subjectId: entry.subjectId.toString(),
      teacherId: entry.teacherId.toString(),
      dayOfWeek: entry.dayOfWeek.toString(),
      lessonNumber: entry.lessonNumber.toString(),
      room: entry.room || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEntry(null);
    setFormData({ classId: "", subjectId: "", teacherId: "", dayOfWeek: "", lessonNumber: "", room: "" });
    setIsDialogOpen(true);
  };

  const getFilteredTimetables = () => {
    if (!selectedClass || selectedClass === "all") return timetables;
    return timetables.filter(entry => entry.classId === parseInt(selectedClass));
  };

  const getAvailableTeachers = () => {
    if (!formData.subjectId) return [];
    return teachers.filter(teacher => 
      teacher.subjects.some(subject => subject.id === parseInt(formData.subjectId))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
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
              Dars Jadvali
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha sinflar uchun dars jadvalini boshqaring
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi dars
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingEntry ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Dars jadvaliga yangi dars qo'shing yoki mavjudini tahrirlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf
                  </Label>
                  <Select 
                    value={formData.classId} 
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Sinfni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Fan
                  </Label>
                  <Select 
                    value={formData.subjectId} 
                    onValueChange={(value) => setFormData({ ...formData, subjectId: value, teacherId: "" })}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacher" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    O'qituvchi
                  </Label>
                  <Select 
                    value={formData.teacherId} 
                    onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                    disabled={!formData.subjectId}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder={formData.subjectId ? "O'qituvchini tanlang" : "Avval fanni tanlang"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTeachers().map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="day" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kun
                  </Label>
                  <Select 
                    value={formData.dayOfWeek} 
                    onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Kunni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.id} value={day.id.toString()}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lesson" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Dars raqami
                  </Label>
                  <Select 
                    value={formData.lessonNumber} 
                    onValueChange={(value) => setFormData({ ...formData, lessonNumber: value })}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Dars raqamini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id.toString()}>
                          {lesson.name} ({lesson.time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Xona
                  </Label>
                  <input
                    id="room"
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                    placeholder="Xona raqami (ixtiyoriy)"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveEntry}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingEntry ? "Yangilash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter by class */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Label htmlFor="classFilter" className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sinf bo'yicha filtr:
            </Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors w-48">
                <SelectValue placeholder="Barcha sinflar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha sinflar</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami darslar
            </CardTitle>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {getFilteredTimetables().length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {selectedClass && selectedClass !== "all" 
                ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun` 
                : "Barcha sinflar uchun"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Haftada darslar
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {selectedClass && selectedClass !== "all" 
                ? getFilteredTimetables().length 
                : Math.round(timetables.length / Math.max(classes.length, 1))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {selectedClass && selectedClass !== "all" ? "Jami haftalik darslar" : "O'rtacha har bir sinf uchun"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol kunlar
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {new Set(getFilteredTimetables().map(t => t.dayOfWeek)).size}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Darslar boradigan kunlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Turli fanlar
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(getFilteredTimetables().map(t => t.subjectId)).size}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Jadvalda mavjud fanlar soni
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Dars Jadvali
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            {selectedClass && selectedClass !== "all"
              ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun ${getFilteredTimetables().length} ta dars`
              : `Jami ${getFilteredTimetables().length} ta dars mavjud`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fan</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'qituvchi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Kun</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Dars vaqti</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Xona</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredTimetables()
                  .sort((a, b) => {
                    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
                    if (a.lessonNumber !== b.lessonNumber) return a.lessonNumber - b.lessonNumber;
                    return a.className.localeCompare(b.className);
                  })
                  .map((entry, index) => (
                  <TableRow key={entry.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4 font-bold text-gray-800 dark:text-gray-200">
                      {entry.className}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none font-semibold px-3 py-1 rounded-lg">
                        {entry.subjectName}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-gray-700 dark:text-gray-300">
                      {entry.teacherName}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-none font-semibold px-3 py-1 rounded-lg">
                        {days.find(d => d.id === entry.dayOfWeek)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">
                        <div className="font-bold text-gray-800 dark:text-gray-200">{entry.lessonNumber}-dars</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {lessons.find(l => l.id === entry.lessonNumber)?.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 dark:text-gray-400">
                      {entry.room || "-"}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(entry)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetablesPage;