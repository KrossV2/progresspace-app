import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Clock, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

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
  dayOfWeek: number; // 1-6 (Monday-Saturday)
  lessonNumber: number; // 1-8
  room?: string;
}

const TimetablesPage = () => {
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
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

  // TODO: Replace with actual API URL
  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

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
      // TODO: Implement actual API calls
      // const [timetablesResponse, classesResponse, subjectsResponse, teachersResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/director/timetables`),
      //   fetch(`${API_BASE_URL}/api/director/classes`),
      //   fetch(`${API_BASE_URL}/api/admin/subjects`),
      //   fetch(`${API_BASE_URL}/api/director/teachers`)
      // ]);
      
      // Mock data for now
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/director/timetables/${id}`, {
      //   method: 'DELETE',
      // });
      
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

    // Check for conflicts
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/director/timetables/${editingEntry.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     classId: parseInt(formData.classId),
        //     subjectId: parseInt(formData.subjectId),
        //     teacherId: parseInt(formData.teacherId),
        //     dayOfWeek: parseInt(formData.dayOfWeek),
        //     lessonNumber: parseInt(formData.lessonNumber),
        //     room: formData.room
        //   }),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/director/timetables`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     classId: parseInt(formData.classId),
        //     subjectId: parseInt(formData.subjectId),
        //     teacherId: parseInt(formData.teacherId),
        //     dayOfWeek: parseInt(formData.dayOfWeek),
        //     lessonNumber: parseInt(formData.lessonNumber),
        //     room: formData.room
        //   }),
        // });
        // const newEntry = await response.json();
        
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
    if (!selectedClass) return timetables;
    return timetables.filter(entry => entry.classId === parseInt(selectedClass));
  };

  const getAvailableTeachers = () => {
    if (!formData.subjectId) return teachers;
    return teachers.filter(teacher => 
      teacher.subjects.some(subject => subject.id === parseInt(formData.subjectId))
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
          <h1 className="text-3xl font-bold">Dars jadvali</h1>
          <p className="text-muted-foreground">Barcha sinflar uchun dars jadvalini boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi dars
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Dars jadvaliga yangi dars qo'shing yoki mavjudini tahrirlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Sinf
                </Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Fan
                </Label>
                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value, teacherId: "" })}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  O'qituvchi
                </Label>
                <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="O'qituvchini tanlang" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day" className="text-right">
                  Kun
                </Label>
                <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson" className="text-right">
                  Dars raqami
                </Label>
                <Select value={formData.lessonNumber} onValueChange={(value) => setFormData({ ...formData, lessonNumber: value })}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Xona
                </Label>
                <input
                  id="room"
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Xona raqami (ixtiyoriy)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveEntry}>
                {editingEntry ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter by class */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Label htmlFor="classFilter">Sinf bo'yicha filtr:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Barcha sinflar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Barcha sinflar</SelectItem>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami darslar</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getFilteredTimetables().length}</div>
            <p className="text-xs text-muted-foreground">
              {selectedClass ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun` : "Barcha sinflar uchun"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Haftada darslar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedClass ? getFilteredTimetables().length : Math.round(timetables.length / classes.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedClass ? "Jami haftalik darslar" : "O'rtacha har bir sinf uchun"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol kunlar</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(getFilteredTimetables().map(t => t.dayOfWeek)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Darslar boradigan kunlar soni
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turli fanlar</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(getFilteredTimetables().map(t => t.subjectId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Jadvalda mavjud fanlar soni
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dars jadvali</CardTitle>
          <CardDescription>
            {selectedClass 
              ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun ${getFilteredTimetables().length} ta dars`
              : `Jami ${getFilteredTimetables().length} ta dars mavjud`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Sinf</TableHead>
                <TableHead>Fan</TableHead>
                <TableHead>O'qituvchi</TableHead>
                <TableHead>Kun</TableHead>
                <TableHead>Dars vaqti</TableHead>
                <TableHead>Xona</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
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
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{entry.className}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.subjectName}</Badge>
                  </TableCell>
                  <TableCell>{entry.teacherName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {days.find(d => d.id === entry.dayOfWeek)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{entry.lessonNumber}-dars</div>
                      <div className="text-muted-foreground">
                        {lessons.find(l => l.id === entry.lessonNumber)?.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{entry.room || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
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

export default TimetablesPage;