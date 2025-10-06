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
import "@/styles/TimetablesPage.css";

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
      <div className="timetables-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timetables-page">
      <div className="timetables-header">
        <div>
          <h1 className="timetables-title">Dars jadvali</h1>
          <p className="timetables-subtitle">Barcha sinflar uchun dars jadvalini boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <Plus className="action-icon mr-2" />
              Yangi dars
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingEntry ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Dars jadvaliga yangi dars qo'shing yoki mavjudini tahrirlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="class" className="form-label">
                  Sinf
                </Label>
                <Select 
                  value={formData.classId} 
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                >
                  <SelectTrigger className="form-select">
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
              <div className="form-row">
                <Label htmlFor="subject" className="form-label">
                  Fan
                </Label>
                <Select 
                  value={formData.subjectId} 
                  onValueChange={(value) => setFormData({ ...formData, subjectId: value, teacherId: "" })}
                >
                  <SelectTrigger className="form-select">
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
              <div className="form-row">
                <Label htmlFor="teacher" className="form-label">
                  O'qituvchi
                </Label>
                <Select 
                  value={formData.teacherId} 
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                  disabled={!formData.subjectId}
                >
                  <SelectTrigger className="form-select">
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
              <div className="form-row">
                <Label htmlFor="day" className="form-label">
                  Kun
                </Label>
                <Select 
                  value={formData.dayOfWeek} 
                  onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                >
                  <SelectTrigger className="form-select">
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
              <div className="form-row">
                <Label htmlFor="lesson" className="form-label">
                  Dars raqami
                </Label>
                <Select 
                  value={formData.lessonNumber} 
                  onValueChange={(value) => setFormData({ ...formData, lessonNumber: value })}
                >
                  <SelectTrigger className="form-select">
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
              <div className="form-row">
                <Label htmlFor="room" className="form-label">
                  Xona
                </Label>
                <input
                  id="room"
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="form-input"
                  placeholder="Xona raqami (ixtiyoriy)"
                />
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveEntry} className="btn btn-primary">
                {editingEntry ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter by class */}
      <Card className="timetables-filter">
        <CardContent className="filter-content">
          <div className="filter-content">
            <Label htmlFor="classFilter" className="filter-label">Sinf bo'yicha filtr:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="form-select w-48">
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
      <div className="timetables-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami darslar</CardTitle>
            <Calendar className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{getFilteredTimetables().length}</div>
            <p className="stat-card-description">
              {selectedClass && selectedClass !== "all" 
                ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun` 
                : "Barcha sinflar uchun"}
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Haftada darslar</CardTitle>
            <Clock className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">
              {selectedClass && selectedClass !== "all" 
                ? getFilteredTimetables().length 
                : Math.round(timetables.length / Math.max(classes.length, 1))}
            </div>
            <p className="stat-card-description">
              {selectedClass && selectedClass !== "all" ? "Jami haftalik darslar" : "O'rtacha har bir sinf uchun"}
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Faol kunlar</CardTitle>
            <Calendar className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">
              {new Set(getFilteredTimetables().map(t => t.dayOfWeek)).size}
            </div>
            <p className="stat-card-description">
              Darslar boradigan kunlar soni
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Turli fanlar</CardTitle>
            <BookOpen className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">
              {new Set(getFilteredTimetables().map(t => t.subjectId)).size}
            </div>
            <p className="stat-card-description">
              Jadvalda mavjud fanlar soni
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="timetables-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Dars jadvali</CardTitle>
          <CardDescription className="table-card-description">
            {selectedClass && selectedClass !== "all"
              ? `${classes.find(c => c.id === parseInt(selectedClass))?.name} sinfi uchun ${getFilteredTimetables().length} ta dars`
              : `Jami ${getFilteredTimetables().length} ta dars mavjud`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="timetables-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Sinf</TableHead>
                <TableHead className="table-header-cell">Fan</TableHead>
                <TableHead className="table-header-cell">O'qituvchi</TableHead>
                <TableHead className="table-header-cell">Kun</TableHead>
                <TableHead className="table-header-cell">Dars vaqti</TableHead>
                <TableHead className="table-header-cell">Xona</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {getFilteredTimetables()
                .sort((a, b) => {
                  if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
                  if (a.lessonNumber !== b.lessonNumber) return a.lessonNumber - b.lessonNumber;
                  return a.className.localeCompare(b.className);
                })
                .map((entry, index) => (
                <TableRow key={entry.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell font-medium">{entry.className}</TableCell>
                  <TableCell className="table-cell">
                    <Badge variant="outline" className="badge">{entry.subjectName}</Badge>
                  </TableCell>
                  <TableCell className="table-cell">{entry.teacherName}</TableCell>
                  <TableCell className="table-cell">
                    <Badge variant="secondary" className="badge badge-secondary">
                      {days.find(d => d.id === entry.dayOfWeek)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="text-sm">
                      <div className="font-medium">{entry.lessonNumber}-dars</div>
                      <div className="text-muted-foreground">
                        {lessons.find(l => l.id === entry.lessonNumber)?.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">{entry.room || "-"}</TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(entry)}
                        className="action-button action-button-sm"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="action-button action-button-sm"
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

export default TimetablesPage;