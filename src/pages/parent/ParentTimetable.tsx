import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, BookOpen, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/parent/ParentTimetable.css";

interface TimetableRecord {
  id: number;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'lecture' | 'practice' | 'lab' | 'seminar';
}

interface TimetableDay {
  day: string;
  records: TimetableRecord[];
}

const TimetablePage = () => {
  const [timetable, setTimetable] = useState<TimetableRecord[]>([]);
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TimetableRecord | null>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: "monday" as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday',
    startTime: "08:00",
    endTime: "08:45",
    subject: "",
    teacher: "",
    room: "",
    type: "lecture" as 'lecture' | 'practice' | 'lab' | 'seminar'
  });
  const { toast } = useToast();

  const subjects = [
    "Matematika",
    "Fizika",
    "Ona tili",
    "Ingliz tili",
    "Tarix",
    "Biologiya",
    "Kimyo",
    "Geografiya",
    "Informatika",
    "Adabiyot",
    "Jismoniy tarbiya",
    "Tasviriy san'at"
  ];

  const teachers = [
    "Nilufar Karimova",
    "Bekzod Tursunov",
    "Sevara Norova",
    "Davron Umarov",
    "Malika Tosheva",
    "Aziz Karimov",
    "Rustam Jabbarov",
    "Dilnoza Ismoilova"
  ];

  const classTypes = [
    { value: "lecture", label: "Ma'ruza" },
    { value: "practice", label: "Amaliyot" },
    { value: "lab", label: "Laboratoriya" },
    { value: "seminar", label: "Seminar" }
  ];

  const dayNames = {
    monday: "Dushanba",
    tuesday: "Seshanba",
    wednesday: "Chorshanba",
    thursday: "Payshanba",
    friday: "Juma",
    saturday: "Shanba"
  };

  useEffect(() => {
    fetchTimetableData();
  }, []);

  useEffect(() => {
    organizeTimetableByDays();
  }, [timetable]);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);

      const mockData: TimetableRecord[] = [
        {
          id: 1,
          dayOfWeek: "monday",
          startTime: "08:00",
          endTime: "08:45",
          subject: "Matematika",
          teacher: "Nilufar Karimova",
          room: "201",
          type: "lecture"
        },
        {
          id: 2,
          dayOfWeek: "monday",
          startTime: "09:00",
          endTime: "09:45",
          subject: "Ona tili",
          teacher: "Sevara Norova",
          room: "305",
          type: "lecture"
        },
        {
          id: 3,
          dayOfWeek: "monday",
          startTime: "10:00",
          endTime: "10:45",
          subject: "Ingliz tili",
          teacher: "Davron Umarov",
          room: "412",
          type: "practice"
        },
        {
          id: 4,
          dayOfWeek: "tuesday",
          startTime: "08:00",
          endTime: "08:45",
          subject: "Fizika",
          teacher: "Bekzod Tursunov",
          room: "215",
          type: "lab"
        },
        {
          id: 5,
          dayOfWeek: "tuesday",
          startTime: "09:00",
          endTime: "09:45",
          subject: "Tarix",
          teacher: "Malika Tosheva",
          room: "104",
          type: "lecture"
        },
        {
          id: 6,
          dayOfWeek: "wednesday",
          startTime: "08:00",
          endTime: "08:45",
          subject: "Biologiya",
          teacher: "Aziz Karimov",
          room: "318",
          type: "lab"
        },
        {
          id: 7,
          dayOfWeek: "wednesday",
          startTime: "10:00",
          endTime: "10:45",
          subject: "Jismoniy tarbiya",
          teacher: "Rustam Jabbarov",
          room: "Sport zal",
          type: "practice"
        },
        {
          id: 8,
          dayOfWeek: "thursday",
          startTime: "09:00",
          endTime: "09:45",
          subject: "Informatika",
          teacher: "Dilnoza Ismoilova",
          room: "Kompyuter klassi",
          type: "practice"
        },
        {
          id: 9,
          dayOfWeek: "friday",
          startTime: "08:00",
          endTime: "08:45",
          subject: "Geografiya",
          teacher: "Malika Tosheva",
          room: "209",
          type: "lecture"
        },
        {
          id: 10,
          dayOfWeek: "friday",
          startTime: "11:00",
          endTime: "11:45",
          subject: "Tasviriy san'at",
          teacher: "Sevara Norova",
          room: "San'at studiyasi",
          type: "practice"
        }
      ];

      setTimetable(mockData);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const organizeTimetableByDays = () => {
    const daysOrder: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday')[] = 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const organizedDays = daysOrder.map(day => ({
      day: dayNames[day],
      records: timetable
        .filter(record => record.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));

    setDays(organizedDays);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(currentWeek.getDate() - 7);
    } else {
      newDate.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 5);

    return {
      start: start.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }),
      end: end.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })
    };
  };

  const openCreateDialog = () => {
    setEditingRecord(null);
    setFormData({
      dayOfWeek: "monday",
      startTime: "08:00",
      endTime: "08:45",
      subject: "",
      teacher: "",
      room: "",
      type: "lecture"
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: TimetableRecord) => {
    setEditingRecord(record);
    setFormData({
      dayOfWeek: record.dayOfWeek,
      startTime: record.startTime,
      endTime: record.endTime,
      subject: record.subject,
      teacher: record.teacher,
      room: record.room,
      type: record.type
    });
    setIsDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!formData.subject || !formData.teacher || !formData.room) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    // Check for time conflicts
    const hasConflict = timetable.some(record => 
      record.dayOfWeek === formData.dayOfWeek &&
      record.id !== editingRecord?.id &&
      ((formData.startTime >= record.startTime && formData.startTime < record.endTime) ||
       (formData.endTime > record.startTime && formData.endTime <= record.endTime) ||
       (formData.startTime <= record.startTime && formData.endTime >= record.endTime))
    );

    if (hasConflict) {
      toast({
        title: "Xatolik",
        description: "Ushbu vaqtda boshqa dars mavjud",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecord) {
        // UPDATE
        const updatedTimetable = timetable.map(record =>
          record.id === editingRecord.id
            ? {
                ...record,
                dayOfWeek: formData.dayOfWeek,
                startTime: formData.startTime,
                endTime: formData.endTime,
                subject: formData.subject,
                teacher: formData.teacher,
                room: formData.room,
                type: formData.type
              }
            : record
        );
        setTimetable(updatedTimetable);
        toast({
          title: "Muvaffaqiyat",
          description: "Dars jadvali yangilandi",
        });
      } else {
        // CREATE
        const newRecord: TimetableRecord = {
          id: Date.now(),
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime,
          subject: formData.subject,
          teacher: formData.teacher,
          room: formData.room,
          type: formData.type
        };
        setTimetable(prev => [...prev, newRecord]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi dars qo'shildi",
        });
      }

      setIsDialogOpen(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Xatolik",
        description: editingRecord ? "Yangilashda xatolik" : "Qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = (id: number) => {
    if (!confirm("Haqiqatan ham bu darsni jadvaldan o'chirmoqchimisiz?")) return;

    try {
      setTimetable(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Dars jadvaldan o'chirildi",
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      lecture: { bg: "type-lecture", text: "Ma'ruza" },
      practice: { bg: "type-practice", text: "Amaliyot" },
      lab: { bg: "type-lab", text: "Laboratoriya" },
      seminar: { bg: "type-seminar", text: "Seminar" }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    return (
      <Badge variant="outline" className={`type-badge ${config.bg}`}>
        {config.text}
      </Badge>
    );
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="timetable-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const weekRange = getWeekRange(currentWeek);

  return (
    <div className="timetable-page">
      <div className="timetable-header">
        <div>
          <h1 className="timetable-title">Dars Jadvali</h1>
          <p className="timetable-subtitle">
            Farid Karimov - 5-A sinf
          </p>
        </div>
        
        <div className="week-navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
            className="nav-btn"
          >
            <ChevronLeft className="nav-icon" />
          </Button>
          
          <div className="week-display">
            <Calendar className="week-icon" />
            <span className="week-text">
              {weekRange.start} - {weekRange.end}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
            className="nav-btn"
          >
            <ChevronRight className="nav-icon" />
          </Button>
        </div>
      </div>

      {/* Timetable Actions */}
      <div className="timetable-actions">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="add-btn">
              <Plus className="btn-icon" />
              Dars qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="timetable-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingRecord ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Dars ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="dayOfWeek" className="form-label">
                  Hafta kuni
                </Label>
                <Select 
                  value={formData.dayOfWeek} 
                  onValueChange={(value: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday') => 
                    setFormData({ ...formData, dayOfWeek: value })
                  }
                >
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Hafta kunini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Dushanba</SelectItem>
                    <SelectItem value="tuesday">Seshanba</SelectItem>
                    <SelectItem value="wednesday">Chorshanba</SelectItem>
                    <SelectItem value="thursday">Payshanba</SelectItem>
                    <SelectItem value="friday">Juma</SelectItem>
                    <SelectItem value="saturday">Shanba</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="time-row">
                <div className="time-input">
                  <Label htmlFor="startTime" className="form-label">
                    Boshlanish vaqti
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="time-input">
                  <Label htmlFor="endTime" className="form-label">
                    Tugash vaqti
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <Label htmlFor="subject" className="form-label">
                  Fan *
                </Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Fanni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="form-row">
                <Label htmlFor="teacher" className="form-label">
                  O'qituvchi *
                </Label>
                <Select 
                  value={formData.teacher} 
                  onValueChange={(value) => setFormData({ ...formData, teacher: value })}
                >
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="O'qituvchini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="form-row">
                <Label htmlFor="room" className="form-label">
                  Xona *
                </Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="form-input"
                  placeholder="Xona raqami"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="type" className="form-label">
                  Dars turi
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'lecture' | 'practice' | 'lab' | 'seminar') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Dars turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {classTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="dialog-footer">
              <Button 
                onClick={() => setIsDialogOpen(false)} 
                variant="outline"
                className="btn btn-secondary"
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={handleSaveRecord} 
                className="btn btn-primary"
              >
                {editingRecord ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Grid */}
      <div className="timetable-grid">
        {days.map((day, index) => (
          <Card key={index} className="day-card">
            <CardHeader className="day-card-header">
              <CardTitle className="day-card-title">{day.day}</CardTitle>
              <CardDescription className="day-card-description">
                {day.records.length} ta dars
              </CardDescription>
            </CardHeader>
            
            <CardContent className="day-card-content">
              {day.records.length === 0 ? (
                <div className="empty-day">
                  <BookOpen className="empty-icon" />
                  <p>Darslar yo'q</p>
                </div>
              ) : (
                <div className="lessons-list">
                  {day.records.map((record) => (
                    <div key={record.id} className="lesson-item">
                      <div className="lesson-time">
                        <Clock className="time-icon" />
                        <span className="time-range">
                          {formatTime(record.startTime)} - {formatTime(record.endTime)}
                        </span>
                      </div>
                      
                      <div className="lesson-info">
                        <div className="subject-teacher">
                          <span className="subject">{record.subject}</span>
                          <span className="teacher">{record.teacher}</span>
                        </div>
                        
                        <div className="lesson-meta">
                          <div className="room-type">
                            <MapPin className="meta-icon" />
                            <span>{record.room}</span>
                            <span className="type-badge-wrapper">
                              {getTypeBadge(record.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lesson-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(record)}
                          className="action-btn edit-btn"
                        >
                          <Edit className="action-icon" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          className="action-btn delete-btn"
                        >
                          <Trash2 className="action-icon" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {timetable.length === 0 && !loading && (
        <div className="empty-state">
          <Calendar className="empty-icon" />
          <h3>Dars jadvali mavjud emas</h3>
          <p>Biror dars qo'shing va haftalik jadvalingizni tuzing</p>
          <Button onClick={openCreateDialog} className="add-btn">
            <Plus className="btn-icon" />
            Birinchi darsni qo'shish
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;