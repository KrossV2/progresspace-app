import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, Clock, AlertCircle, CheckCircle2, XCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight, User, BookOpen, School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: number;
  date: string;
  subject: string;
  teacher: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time?: string;
  notes?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    teacher: "",
    status: "present" as 'present' | 'absent' | 'late' | 'excused',
    time: "",
    notes: ""
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
    "Informatika"
  ];

  const teachers = [
    "Nilufar Karimova",
    "Bekzod Tursunov",
    "Sevara Norova",
    "Davron Umarov",
    "Malika Tosheva",
    "Aziz Karimov"
  ];

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    filterAttendanceByDate();
  }, [attendance, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0];

      const mockData: AttendanceRecord[] = [
        {
          id: 1,
          date: today,
          subject: "Matematika",
          teacher: "Nilufar Karimova",
          status: "present",
          time: "08:30"
        },
        {
          id: 2,
          date: today,
          subject: "Fizika",
          teacher: "Bekzod Tursunov",
          status: "late",
          time: "09:15",
          notes: "10 daqiqa kechikdi"
        },
        {
          id: 3,
          date: yesterday,
          subject: "Ona tili",
          teacher: "Sevara Norova",
          status: "present",
          time: "08:30"
        },
        {
          id: 4,
          date: yesterday,
          subject: "Ingliz tili",
          teacher: "Davron Umarov",
          status: "absent",
          notes: "Kasallik"
        },
        {
          id: 5,
          date: dayBeforeYesterday,
          subject: "Tarix",
          teacher: "Malika Tosheva",
          status: "present",
          time: "08:30"
        },
        {
          id: 6,
          date: dayBeforeYesterday,
          subject: "Biologiya",
          teacher: "Aziz Karimov",
          status: "excused",
          notes: "Oilaviy sabablar"
        }
      ];

      setAttendance(mockData);
      calculateStats(mockData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAttendanceByDate = () => {
    const filtered = attendance.filter(record => record.date === selectedDate);
    setFilteredAttendance(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (data: AttendanceRecord[]) => {
    const present = data.filter(record => record.status === 'present').length;
    const absent = data.filter(record => record.status === 'absent').length;
    const late = data.filter(record => record.status === 'late').length;
    const total = data.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    setStats({
      total,
      present,
      absent,
      late,
      attendanceRate
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const openCreateDialog = () => {
    setEditingRecord(null);
    setFormData({
      date: selectedDate,
      subject: "",
      teacher: "",
      status: "present",
      time: "08:30",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      subject: record.subject,
      teacher: record.teacher,
      status: record.status,
      time: record.time || "08:30",
      notes: record.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!formData.subject || !formData.teacher || !formData.date) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecord) {
        const updatedAttendance = attendance.map(record =>
          record.id === editingRecord.id
            ? {
                ...record,
                date: formData.date,
                subject: formData.subject,
                teacher: formData.teacher,
                status: formData.status,
                time: formData.time || undefined,
                notes: formData.notes || undefined
              }
            : record
        );
        setAttendance(updatedAttendance);
        toast({
          title: "Muvaffaqiyat",
          description: "Davomat ma'lumoti yangilandi",
        });
      } else {
        const newRecord: AttendanceRecord = {
          id: Date.now(),
          date: formData.date,
          subject: formData.subject,
          teacher: formData.teacher,
          status: formData.status,
          time: formData.time || undefined,
          notes: formData.notes || undefined
        };
        setAttendance(prev => [...prev, newRecord]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi davomat qo'shildi",
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
    if (!confirm("Haqiqatan ham bu davomat yozuvini o'chirmoqchimisiz?")) return;

    try {
      setAttendance(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Davomat yozuvi o'chirildi",
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: {
        bg: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200",
        icon: CheckCircle2,
        text: "Darsda"
      },
      absent: {
        bg: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200",
        icon: XCircle,
        text: "Darsda yo'q"
      },
      late: {
        bg: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-200",
        icon: Clock,
        text: "Kechikdi"
      },
      excused: {
        bg: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200",
        icon: AlertCircle,
        text: "Sababli"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border ${config.bg}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              O'quvchi Davomati
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Farid Karimov - 5-A sinf
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 p-2 shadow-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 rounded-xl border border-gray-200 dark:border-gray-500 min-w-[180px] justify-center">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className={`font-medium text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2 ${isToday(selectedDate) ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                {formatDate(selectedDate)}
                {isToday(selectedDate) && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Bugun
                  </span>
                )}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 h-10 w-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kunlik Davomat
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.attendanceRate}%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              {stats.present} ta darsda / {stats.total} ta dars
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Darslarda
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.present}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Darslarda qatnashgan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kechikishlar
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
              {stats.late}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Kechikib kirgan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Qatnashmagan
            </CardTitle>
            <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {stats.absent}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Darsda bo'lmagan
            </p>
          </CardContent>
        </Card>
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
              Davomat qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {editingRecord ? "Davomatni tahrirlash" : "Yangi davomat qo'shish"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                Davomat ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sana *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                />
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
                <Label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Holat
                </Label>
                <select 
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'present' | 'absent' | 'late' | 'excused' }))}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                >
                  <option value="present">Darsda</option>
                  <option value="absent">Darsda yo'q</option>
                  <option value="late">Kechikdi</option>
                  <option value="excused">Sababli</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vaqt (ixtiyoriy)
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Izoh (ixtiyoriy)
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Qo'shimcha ma'lumot"
                />
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

      {/* Attendance Details */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Kunlik Davomat
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            {formatDate(selectedDate)} sanasidagi barcha darslar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Davomat ma'lumotlari yo'q
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Ushbu sana uchun davomat ma'lumotlari kiritilmagan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {record.time && (
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-xl font-semibold text-sm border border-blue-200 dark:border-blue-700 min-w-[70px] text-center">
                          {record.time}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                            {record.subject}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {record.teacher}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getStatusBadge(record.status)}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(record)}
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-amber-800 dark:text-amber-300 text-sm">
                        {record.notes}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;