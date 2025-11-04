import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, BookOpen, Users, ChevronLeft, ChevronRight, School, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    { value: "lecture", label: "Ma'ruza", color: "blue" },
    { value: "practice", label: "Amaliyot", color: "green" },
    { value: "lab", label: "Laboratoriya", color: "purple" },
    { value: "seminar", label: "Seminar", color: "orange" }
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
      lecture: { 
        bg: "bg-blue-100 text-blue-800 border-blue-200", 
        text: "Ma'ruza" 
      },
      practice: { 
        bg: "bg-green-100 text-green-800 border-green-200", 
        text: "Amaliyot" 
      },
      lab: { 
        bg: "bg-purple-100 text-purple-800 border-purple-200", 
        text: "Laboratoriya" 
      },
      seminar: { 
        bg: "bg-orange-100 text-orange-800 border-orange-200", 
        text: "Seminar" 
      }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border ${config.bg}`}>
        {config.text}
      </Badge>
    );
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

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

  const weekRange = getWeekRange(currentWeek);

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
              Farid Karimov - 5-A sinf
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 p-2 shadow-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 rounded-xl border border-gray-200 dark:border-gray-500 min-w-[200px] justify-center">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                {weekRange.start} - {weekRange.end}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Plus className="h-5 w-5 mr-2" />
              Dars qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {editingRecord ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                Dars ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Hafta kuni
                </Label>
                <select 
                  id="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' }))}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                >
                  <option value="monday">Dushanba</option>
                  <option value="tuesday">Seshanba</option>
                  <option value="wednesday">Chorshanba</option>
                  <option value="thursday">Payshanba</option>
                  <option value="friday">Juma</option>
                  <option value="saturday">Shanba</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Boshlanish vaqti
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tugash vaqti
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fan *
                </Label>
                <select 
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                >
                  <option value="">Fanni tanlang</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacher" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  O'qituvchi *
                </Label>
                <select 
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                >
                  <option value="">O'qituvchini tanlang</option>
                  {teachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Xona *
                </Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Xona raqami"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Dars turi
                </Label>
                <select 
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'lecture' | 'practice' | 'lab' | 'seminar' }))}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                >
                  {classTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleSaveRecord}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
              >
                {editingRecord ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {day.day}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {day.records.length} ta dars
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {day.records.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Darslar yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {day.records.map((record) => (
                    <div 
                      key={record.id} 
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {formatTime(record.startTime)} - {formatTime(record.endTime)}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                                {record.subject}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {record.teacher}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {record.room}
                              </span>
                            </div>
                            {getTypeBadge(record.type)}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(record)}
                            className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                            className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
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
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Dars jadvali mavjud emas
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Biror dars qo'shing va haftalik jadvalingizni tuzing
          </p>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Birinchi darsni qo'shish
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;