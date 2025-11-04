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
              Mening Farzandlarim
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha farzandlaringizning ma'lumotlari va natijalari
            </p>
          </div>
          
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Farzand qo'shish
          </Button>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {children.map((child) => (
          <Card 
            key={child.id} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-14 h-14 border-3 border-gray-200 dark:border-gray-600">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(child.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                      {child.name}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {child.grade} • {calculateAge(child.birthDate)} yosh
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(child)}
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChild(child.id)}
                    className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 pt-0 space-y-6">
              {/* School Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <School className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Maktab
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {child.school}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Tug'ilgan sana
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {new Date(child.birthDate).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Telefon
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {child.contact.phone}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Email
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {child.contact.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Manzil
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {child.contact.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                  Natijalar
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getGradeColor(child.performance.averageGrade)} mb-1`}>
                      {child.performance.averageGrade}
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      O'rtacha baho
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {child.performance.attendance}%
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Davomat
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {child.performance.behaviorPoints}
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Xulq-atvor
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              {child.subjects.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    <BookOpen className="h-4 w-4" />
                    Fanlar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {child.subjects.map((subject, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 font-medium px-3 py-1 rounded-lg"
                      >
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
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {editingChild ? "Farzandni tahrirlash" : "Yangi farzand qo'shish"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Farzandning ma'lumotlarini kiriting va saqlang.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ism Familiya *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Farzandning ismi va familiyasi"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sinf *
              </Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
              >
                <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
                  <SelectValue placeholder="Sinfni tanlang" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                  {grades.map((grade) => (
                    <SelectItem 
                      key={grade} 
                      value={grade}
                      className="text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="school" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Maktab *
              </Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Maktab nomi"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tug'ilgan sana *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="+99890 123 45 67"
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
                placeholder="farzand@email.uz"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Manzil
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Yashash manzili"
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button 
              onClick={() => setIsDialogOpen(false)} 
              variant="outline"
              className="flex-1 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Bekor qilish
            </Button>
            <Button 
              onClick={handleSaveChild} 
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {editingChild ? "Yangilash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {children.length === 0 && !loading && (
        <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Farzandlar mavjud emas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Biror farzand qo'shing va ularning maktab hayotini kuzatishingiz mumkin
          </p>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Birinchi farzandni qo'shish
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyChildrenPage;