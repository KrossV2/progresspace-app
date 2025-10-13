import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, School, Calendar, Edit, Trash2, Phone, Mail, MapPin, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/parent/ChildrenPage.css";

interface Child {
  id: number;
  name: string;
  grade: string;
  school: string;
  birthDate: string;
  avatar?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  performance: {
    averageGrade: number;
    attendance: number;
    behaviorPoints: number;
  };
  subjects: string[];
}

const MyChildrenPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    school: "",
    birthDate: "",
    phone: "",
    email: "",
    address: ""
  });
  const { toast } = useToast();

  const grades = [
    "1-sinf", "2-sinf", "3-sinf", "4-sinf", "5-sinf", "6-sinf",
    "7-sinf", "8-sinf", "9-sinf", "10-sinf", "11-sinf"
  ];

  const subjects = [
    "Matematika", "Fizika", "Ona tili", "Ingliz tili", "Tarix",
    "Biologiya", "Kimyo", "Geografiya", "Informatika", "Adabiyot"
  ];

  useEffect(() => {
    fetchChildrenData();
  }, []);

  const fetchChildrenData = async () => {
    try {
      setLoading(true);
      
      const mockData: Child[] = [
        {
          id: 1,
          name: "Farid Karimov",
          grade: "5-sinf",
          school: "25-sonli maktab",
          birthDate: "2015-03-15",
          avatar: "/avatars/farid.jpg",
          contact: {
            phone: "+99890 123 45 67",
            email: "farid.karimov@school.uz",
            address: "Toshkent sh., Yunusobod tumani"
          },
          performance: {
            averageGrade: 4.8,
            attendance: 95,
            behaviorPoints: 87
          },
          subjects: ["Matematika", "Ona tili", "Ingliz tili", "Tarix", "Informatika"]
        },
        {
          id: 2,
          name: "Sevara Karimova",
          grade: "3-sinf",
          school: "25-sonli maktab",
          birthDate: "2017-07-22",
          avatar: "/avatars/sevara.jpg",
          contact: {
            phone: "+99891 234 56 78",
            email: "sevara.karimova@school.uz",
            address: "Toshkent sh., Yunusobod tumani"
          },
          performance: {
            averageGrade: 5.0,
            attendance: 98,
            behaviorPoints: 95
          },
          subjects: ["Matematika", "Ona tili", "Ingliz tili", "Tabiiy fan", "San'at"]
        }
      ];

      setChildren(mockData);
    } catch (error) {
      console.error('Error fetching children data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingChild(null);
    setFormData({
      name: "",
      grade: "",
      school: "",
      birthDate: "",
      phone: "",
      email: "",
      address: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (child: Child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      grade: child.grade,
      school: child.school,
      birthDate: child.birthDate,
      phone: child.contact.phone,
      email: child.contact.email,
      address: child.contact.address
    });
    setIsDialogOpen(true);
  };

  const handleSaveChild = () => {
    if (!formData.name || !formData.grade || !formData.school || !formData.birthDate) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingChild) {
        const updatedChildren = children.map(child =>
          child.id === editingChild.id
            ? {
                ...child,
                name: formData.name,
                grade: formData.grade,
                school: formData.school,
                birthDate: formData.birthDate,
                contact: {
                  phone: formData.phone,
                  email: formData.email,
                  address: formData.address
                }
              }
            : child
        );
        setChildren(updatedChildren);
        toast({
          title: "Muvaffaqiyat",
          description: "Farzand ma'lumotlari yangilandi",
        });
      } else {
        const newChild: Child = {
          id: Date.now(),
          name: formData.name,
          grade: formData.grade,
          school: formData.school,
          birthDate: formData.birthDate,
          contact: {
            phone: formData.phone,
            email: formData.email,
            address: formData.address
          },
          performance: {
            averageGrade: 0,
            attendance: 0,
            behaviorPoints: 0
          },
          subjects: []
        };
        setChildren(prev => [...prev, newChild]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi farzand qo'shildi",
        });
      }

      setIsDialogOpen(false);
      setEditingChild(null);
    } catch (error) {
      console.error('Error saving child:', error);
      toast({
        title: "Xatolik",
        description: editingChild ? "Yangilashda xatolik" : "Qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = (id: number) => {
    if (!confirm("Haqiqatan ham bu farzandni ro'yxatdan o'chirmoqchimisiz?")) return;

    try {
      setChildren(prev => prev.filter(child => child.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Farzand ro'yxatdan o'chirildi",
      });
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "text-green-600";
    if (grade >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="children-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="children-page">
      <div className="children-header">
        <div>
          <h1 className="children-title">Mening Farzandlarim</h1>
          <p className="children-subtitle">
            Barcha farzandlaringizning ma'lumotlari va natijalari
          </p>
        </div>
        
        <Button onClick={openCreateDialog} className="add-btn">
          <UserPlus className="btn-icon" />
          Farzand qo'shish
        </Button>
      </div>

      {/* Children Grid */}
      <div className="children-grid">
        {children.map((child) => (
          <Card key={child.id} className="child-card">
            <CardHeader className="child-card-header">
              <div className="child-info">
                <Avatar className="child-avatar">
                  <AvatarImage src={child.avatar} />
                  <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
                </Avatar>
                <div className="child-details">
                  <CardTitle className="child-name">{child.name}</CardTitle>
                  <CardDescription className="child-grade">
                    {child.grade} • {calculateAge(child.birthDate)} yosh
                  </CardDescription>
                </div>
              </div>
              <div className="child-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(child)}
                  className="action-btn edit-btn"
                >
                  <Edit className="action-icon" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteChild(child.id)}
                  className="action-btn delete-btn"
                >
                  <Trash2 className="action-icon" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="child-card-content">
              {/* School Info */}
              <div className="info-section">
                <div className="info-item">
                  <School className="info-icon" />
                  <div>
                    <div className="info-label">Maktab</div>
                    <div className="info-value">{child.school}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <div>
                    <div className="info-label">Tug'ilgan sana</div>
                    <div className="info-value">
                      {new Date(child.birthDate).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="info-section">
                <div className="info-item">
                  <Phone className="info-icon" />
                  <div>
                    <div className="info-label">Telefon</div>
                    <div className="info-value">{child.contact.phone}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">{child.contact.email}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div>
                    <div className="info-label">Manzil</div>
                    <div className="info-value">{child.contact.address}</div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="performance-section">
                <h4 className="performance-title">Natijalar</h4>
                <div className="performance-stats">
                  <div className="performance-item">
                    <div className="performance-value">
                      <span className={getGradeColor(child.performance.averageGrade)}>
                        {child.performance.averageGrade}
                      </span>
                    </div>
                    <div className="performance-label">O'rtacha baho</div>
                  </div>
                  
                  <div className="performance-item">
                    <div className="performance-value">
                      {child.performance.attendance}%
                    </div>
                    <div className="performance-label">Davomat</div>
                  </div>
                  
                  <div className="performance-item">
                    <div className="performance-value">
                      {child.performance.behaviorPoints}
                    </div>
                    <div className="performance-label">Xulq-atvor</div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              {child.subjects.length > 0 && (
                <div className="subjects-section">
                  <h4 className="subjects-title">
                    <BookOpen className="subjects-icon" />
                    Fanlar
                  </h4>
                  <div className="subjects-list">
                    {child.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="subject-badge">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Child Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="children-dialog">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {editingChild ? "Farzandni tahrirlash" : "Yangi farzand qo'shish"}
            </DialogTitle>
            <DialogDescription className="dialog-description">
              Farzandning ma'lumotlarini kiriting va saqlang.
            </DialogDescription>
          </DialogHeader>
          
          <div className="dialog-form">
            <div className="form-row">
              <Label htmlFor="name" className="form-label">
                Ism Familiya *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="Farzandning ismi va familiyasi"
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="grade" className="form-label">
                Sinf *
              </Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Sinfni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-row">
              <Label htmlFor="school" className="form-label">
                Maktab *
              </Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="form-input"
                placeholder="Maktab nomi"
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="birthDate" className="form-label">
                Tug'ilgan sana *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="form-input"
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="phone" className="form-label">
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                placeholder="+99890 123 45 67"
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="email" className="form-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="farzand@email.uz"
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="address" className="form-label">
                Manzil
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
                placeholder="Yashash manzili"
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
              onClick={handleSaveChild} 
              className="btn btn-primary"
            >
              {editingChild ? "Yangilash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {children.length === 0 && !loading && (
        <div className="empty-state">
          <Users className="empty-icon" />
          <h3>Farzandlar mavjud emas</h3>
          <p>Biror farzand qo'shing va ularning maktab hayotini kuzatishingiz mumkin</p>
          <Button onClick={openCreateDialog} className="add-btn">
            <UserPlus className="btn-icon" />
            Birinchi farzandni qo'shish
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyChildrenPage;