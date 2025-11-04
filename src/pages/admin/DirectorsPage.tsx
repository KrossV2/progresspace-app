import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserPlus, Eye, Users, Mail, Phone, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface School {
  id: number;
  name: string;
  address: string;
  cityName: string;
}

interface Director {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  schoolId?: number;
  schoolName?: string;
  isActive: boolean;
  phoneNumber?: string;
}

const DirectorsPage = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [availableSchools, setAvailableSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    schoolId: "",
    phoneNumber: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter schools that don't have directors assigned
    const assignedSchoolIds = directors.map(d => d.schoolId).filter(Boolean);
    setAvailableSchools(schools.filter(s => !assignedSchoolIds.includes(s.id)));
  }, [directors, schools]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock data for schools
      const schoolsData: School[] = [
        { id: 1, name: "1-umumiy o'rta ta'lim maktabi", address: "Shayxontohur tumani", cityName: "Toshkent shahri" },
        { id: 2, name: "120-maktab", address: "Yunusobod tumani", cityName: "Toshkent shahri" },
        { id: 3, name: "5-umumiy o'rta ta'lim maktabi", address: "Markaz ko'chasi", cityName: "Samarqand shahri" },
        { id: 4, name: "15-maktab", address: "Navoi ko'chasi", cityName: "Buxoro shahri" },
        { id: 5, name: "25-sonli maktab", address: "Yunusobod tumani", cityName: "Toshkent shahri" },
        { id: 6, name: "3-sonli litsey", address: "Mirzo Ulug'bek tumani", cityName: "Toshkent shahri" },
      ];

      const directorsData: Director[] = [
        { 
          id: 1, 
          firstName: "Malika", 
          lastName: "Usmanova", 
          email: "malika.usmanova@school.uz", 
          schoolId: 1,
          schoolName: "1-umumiy o'rta ta'lim maktabi",
          isActive: true,
          phoneNumber: "+998901234567"
        },
        { 
          id: 2, 
          firstName: "Bobur", 
          lastName: "Karimov", 
          email: "bobur.karimov@school.uz", 
          schoolId: 3,
          schoolName: "5-umumiy o'rta ta'lim maktabi",
          isActive: true,
          phoneNumber: "+998912345678"
        },
        { 
          id: 3, 
          firstName: "Nargiza", 
          lastName: "Tursunova", 
          email: "nargiza.tursunova@school.uz", 
          schoolId: 4,
          schoolName: "15-maktab",
          isActive: true,
          phoneNumber: "+998901122334"
        },
        { 
          id: 4, 
          firstName: "Javohir", 
          lastName: "Rasulov", 
          email: "javohir.rasulov@school.uz", 
          isActive: false,
          phoneNumber: "+998903344556"
        },
      ];

      setSchools(schoolsData);
      setDirectors(directorsData);
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

  const handleDeleteDirector = async (id: number) => {
    if (!confirm("Haqiqatan ham bu direktorni o'chirmoqchimisiz?")) return;

    try {
      setDirectors(directors.filter(director => director.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Direktor muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Direktorni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveDirector = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Xatolik",
        description: "Ism, familiya va email majburiy",
        variant: "destructive",
      });
      return;
    }

    try {
      const schoolName = formData.schoolId ? schools.find(s => s.id === parseInt(formData.schoolId))?.name : undefined;

      if (editingDirector) {
        setDirectors(directors.map(director => 
          director.id === editingDirector.id 
            ? { 
                ...director, 
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                schoolId: formData.schoolId ? parseInt(formData.schoolId) : undefined,
                schoolName,
                phoneNumber: formData.phoneNumber
              }
            : director
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Direktor muvaffaqiyatli yangilandi",
        });
      } else {
        const newDirector: Director = { 
          id: Date.now(), 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          schoolId: formData.schoolId ? parseInt(formData.schoolId) : undefined,
          schoolName,
          isActive: true,
          phoneNumber: formData.phoneNumber
        };
        setDirectors([...directors, newDirector]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi direktor muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingDirector ? "Direktorni yangilashda xatolik" : "Direktor qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", schoolId: "", phoneNumber: "" });
    setEditingDirector(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (director: Director) => {
    setEditingDirector(director);
    setFormData({
      firstName: director.firstName,
      lastName: director.lastName,
      email: director.email,
      schoolId: director.schoolId?.toString() || "",
      phoneNumber: director.phoneNumber || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingDirector(null);
    setFormData({ firstName: "", lastName: "", email: "", schoolId: "", phoneNumber: "" });
    setIsDialogOpen(true);
  };

  const getStats = () => {
    const activeDirectors = directors.filter(d => d.isActive).length;
    const assignedDirectors = directors.filter(d => d.schoolId).length;
    const unassignedDirectors = directors.filter(d => !d.schoolId).length;
    
    return {
      total: directors.length,
      active: activeDirectors,
      assigned: assignedDirectors,
      unassigned: unassignedDirectors
    };
  };

  const getSchoolStats = () => {
    const stats: { [key: string]: number } = {};
    directors.forEach(director => {
      if (director.schoolName) {
        stats[director.schoolName] = (stats[director.schoolName] || 0) + 1;
      }
    });
    return stats;
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

  const stats = getStats();
  const schoolStats = getSchoolStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Direktorlar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha maktab direktorlarini boshqaring va tayinlang
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Yangi direktor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingDirector ? "Direktorni tahrirlash" : "Yangi direktor qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Direktor ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Ismni kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Familiyani kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="+998901234567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Maktab
                  </Label>
                  <Select value={formData.schoolId} onValueChange={(value) => setFormData({ ...formData, schoolId: value })}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
                      <SelectValue placeholder="Maktabni tanlang (ixtiyoriy)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                      <SelectItem value="" className="text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer">
                        Maktab tayinlanmagan
                      </SelectItem>
                      {(editingDirector ? schools : availableSchools).map((school) => (
                        <SelectItem 
                          key={school.id} 
                          value={school.id.toString()}
                          className="text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {school.name} ({school.cityName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveDirector}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingDirector ? "Yangilash" : "Qo'shish"}
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
              Jami Direktorlar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {stats.total}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan direktorlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol Direktorlar
            </CardTitle>
            <UserPlus className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.active}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faol ishlayotgan direktorlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tayinlangan
            </CardTitle>
            <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {stats.assigned}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Maktabga tayinlangan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tayinlanmagan
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {stats.unassigned}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Maktab tayinlanmagan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schools Distribution */}
      {Object.keys(schoolStats).length > 0 && (
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Maktablar Bo'yicha Taqsimot
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
              Har bir maktabdagi direktorlar soni
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(schoolStats).map(([school, count]) => (
                <div 
                  key={school} 
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{school}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-semibold px-3 py-1 rounded-lg">
                    {count} ta direktor
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Directors Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Direktorlar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {directors.length} ta direktor mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Direktor</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aloqa</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Maktab</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directors.map((director, index) => (
                <TableRow 
                  key={director.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-200 block">
                          {director.firstName} {director.lastName}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>{director.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {director.phoneNumber ? (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{director.phoneNumber}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {director.schoolName ? (
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 block">
                            {director.schoolName}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">
                            Tayinlangan
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 opacity-70">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 block">
                            Maktab tayinlanmagan
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">
                            Kutilyapti
                          </span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
                      director.isActive 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                    }`}>
                      {director.isActive ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to director details */}}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(director)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDirector(director.id)}
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

export default DirectorsPage;