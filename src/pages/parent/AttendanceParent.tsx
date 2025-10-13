import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, Clock, AlertCircle, CheckCircle2, XCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/parent/AttendanceParent.css";

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
      
      // Mock data - исправлено для избежания ошибок с датами
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
    // Валидация формы
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
        // Update existing record
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
        // Create new record
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
        bg: "status-present",
        icon: CheckCircle2,
        text: "Darsda"
      },
      absent: {
        bg: "status-absent",
        icon: XCircle,
        text: "Darsda yo'q"
      },
      late: {
        bg: "status-late",
        icon: Clock,
        text: "Kechikdi"
      },
      excused: {
        bg: "status-excused",
        icon: AlertCircle,
        text: "Sababli"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <Badge className={`status-badge ${config.bg}`}>
        <IconComponent className="status-icon" />
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
      <div className="attendance-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1 className="attendance-title">O'quvchi Davomati</h1>
          <p className="attendance-subtitle">
            Farid Karimov - 5-A sinf
          </p>
        </div>
        
        <div className="date-navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="nav-btn"
          >
            <ChevronLeft className="nav-icon" />
          </Button>
          
          <div className="date-display">
            <Calendar className="date-icon" />
            <span className={`date-text ${isToday(selectedDate) ? 'today' : ''}`}>
              {formatDate(selectedDate)}
              {isToday(selectedDate) && <span className="today-badge">Bugun</span>}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
            className="nav-btn"
          >
            <ChevronRight className="nav-icon" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="attendance-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Kunlik Davomat</CardTitle>
            <TrendingUp className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-total">
              {stats.attendanceRate}%
            </div>
            <p className="stat-card-description">
              {stats.present} ta darsda / {stats.total} ta dars
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Darslarda</CardTitle>
            <CheckCircle2 className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-present">
              {stats.present}
            </div>
            <p className="stat-card-description">
              Darslarda qatnashgan
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Kechikishlar</CardTitle>
            <Clock className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-late">
              {stats.late}
            </div>
            <p className="stat-card-description">
              Kechikib kirgan
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Qatnashmagan</CardTitle>
            <XCircle className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-absent">
              {stats.absent}
            </div>
            <p className="stat-card-description">
              Darsda bo'lmagan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Actions */}
      <div className="attendance-actions">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="add-btn">
              <Plus className="btn-icon" />
              Davomat qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="attendance-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingRecord ? "Davomatni tahrirlash" : "Yangi davomat qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Davomat ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="date" className="form-label">
                  Sana
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="form-input"
                />
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
  <Label htmlFor="status" className="form-label">
    Holat
  </Label>
  <Select 
    value={formData.status} 
    onValueChange={(value: 'present' | 'absent' | 'late' | 'excused') => 
      setFormData({ ...formData, status: value })
    }
  >
    <SelectTrigger className="form-select">
      <SelectValue placeholder="Holatni tanlang" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="present">Darsda</SelectItem>
      <SelectItem value="absent">Darsda yo'q</SelectItem>
      <SelectItem value="late">Kechikdi</SelectItem>
      <SelectItem value="excused">Sababli</SelectItem>
    </SelectContent>
  </Select>
</div>
              
              <div className="form-row">
                <Label htmlFor="time" className="form-label">
                  Vaqt (ixtiyoriy)
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="notes" className="form-label">
                  Izoh (ixtiyoriy)
                </Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  placeholder="Qo'shimcha ma'lumot"
                />
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

      {/* Attendance Details */}
      <Card className="attendance-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Kunlik Davomat</CardTitle>
          <CardDescription className="table-card-description">
            {formatDate(selectedDate)} sanasidagi barcha darslar
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          {filteredAttendance.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-icon" />
              <h3>Davomat ma'lumotlari yo'q</h3>
              <p>Ushbu sana uchun davomat ma'lumotlari kiritilmagan</p>
            </div>
          ) : (
            <div className="attendance-list">
              {filteredAttendance.map((record) => (
                <div key={record.id} className="attendance-item">
                  <div className="attendance-info">
                    <div className="attendance-time">
                      {record.time && <div className="time-badge">{record.time}</div>}
                    </div>
                    
                    <div className="attendance-details">
                      <div className="subject-name">{record.subject}</div>
                      <div className="teacher-name">{record.teacher}</div>
                    </div>
                    
                    <div className="attendance-status">
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="attendance-notes">
                      <AlertCircle className="notes-icon" />
                      <span>{record.notes}</span>
                    </div>
                  )}
                  
                  <div className="attendance-actions">
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
    </div>
  );
};

export default AttendancePage;