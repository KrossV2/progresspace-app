import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, BookOpen, Users, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: number;
  name: string;
  description: string;
  hoursPerWeek: number;
  category: 'science' | 'humanities' | 'languages' | 'arts' | 'sports';
  status: 'active' | 'inactive';
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hoursPerWeek: "",
    category: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'science', label: 'Tabiiy fanlar', color: 'blue' },
    { value: 'humanities', label: 'Ijtimoiy fanlar', color: 'green' },
    { value: 'languages', label: 'Tillar', color: 'purple' },
    { value: 'arts', label: 'San\'at', color: 'orange' },
    { value: 'sports', label: 'Sport', color: 'red' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const subjectsData: Subject[] = [
        {
          id: 1,
          name: "Matematika",
          description: "Raqamlar va hisoblash fanı",
          hoursPerWeek: 5,
          category: 'science',
          status: 'active'
        },
        {
          id: 2,
          name: "Ona tili",
          description: "O'zbek tili grammatikasi va adabiyoti",
          hoursPerWeek: 4,
          category: 'languages',
          status: 'active'
        },
        {
          id: 3,
          name: "Ingliz tili",
          description: "Chet tili o'qitish",
          hoursPerWeek: 3,
          category: 'languages',
          status: 'active'
        },
        {
          id: 4,
          name: "Fizika",
          description: "Tabiat qonuniyatlari fanı",
          hoursPerWeek: 2,
          category: 'science',
          status: 'active'
        },
        {
          id: 5,
          name: "Tarix",
          description: "O'tmish davrlari va voqealar",
          hoursPerWeek: 2,
          category: 'humanities',
          status: 'active'
        },
        {
          id: 6,
          name: "Jismoniy tarbiya",
          description: "Sport mashg'ulotlari",
          hoursPerWeek: 2,
          category: 'sports',
          status: 'active'
        },
      ];

      setSubjects(subjectsData);
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

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Haqiqatan ham bu fanni o'chirmoqchimisiz?")) return;

    try {
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Fan muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fanni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveSubject = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.hoursPerWeek || !formData.category) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubject) {
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id 
            ? { 
                ...subject, 
                name: formData.name,
                description: formData.description,
                hoursPerWeek: parseInt(formData.hoursPerWeek),
                category: formData.category as Subject['category']
              }
            : subject
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Fan muvaffaqiyatli yangilandi",
        });
      } else {
        const newSubject: Subject = { 
          id: Date.now(), 
          name: formData.name,
          description: formData.description,
          hoursPerWeek: parseInt(formData.hoursPerWeek),
          category: formData.category as Subject['category'],
          status: 'active'
        };
        setSubjects([...subjects, newSubject]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi fan muvaffaqiyatli qo'shildi",
        });
      }

      setFormData({
        name: "",
        description: "",
        hoursPerWeek: "",
        category: "",
      });
      setEditingSubject(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingSubject ? "Fanni yangilashda xatolik" : "Fan qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      hoursPerWeek: subject.hoursPerWeek.toString(),
      category: subject.category,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      description: "",
      hoursPerWeek: "",
      category: "",
    });
    setIsDialogOpen(true);
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    subjects.forEach(subject => {
      const categoryName = categories.find(c => c.value === subject.category)?.label || "Noma'lum";
      stats[categoryName] = (stats[categoryName] || 0) + 1;
    });
    return stats;
  };

  const getCategoryColor = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig?.color || 'gray';
  };

  const getCategoryLabel = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    return categoryConfig?.label || 'Noma\'lum';
  };

  const getCategoryBadgeClass = (category: string) => {
    const color = getCategoryColor(category);
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const categoryStats = getCategoryStats();
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hoursPerWeek, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Fanlar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha fanlarni boshqaring va dasturni sozlang
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi fan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingSubject ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Fan ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Fan nomi *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Fan nomini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tavsif *
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Fan haqida qisqacha ma'lumot"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Haftalik soat *
                  </Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Haftasiga soat soni"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kategoriya *
                  </Label>
                  <select 
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveSubject}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingSubject ? "Yangilash" : "Qo'shish"}
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
              Jami Fanlar
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {subjects.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan fanlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Haftalik Soat
            </CardTitle>
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalHours}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Jami dars soatlari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Kategoriyalar
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(subjects.map(s => s.category)).size}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Fan kategoriyalari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha Soat
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {subjects.length > 0 ? Math.round(totalHours / subjects.length * 10) / 10 : 0}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Har fanda o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Distribution */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Kategoriyalar Bo'yicha Taqsimot
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Har bir kategoriyadagi fanlar soni
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div 
                key={category} 
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{category}</span>
                </div>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-semibold px-3 py-1 rounded-lg">
                  {count} ta fan
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Fanlar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {subjects.length} ta fan mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fan Nomi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Tavsif</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Haftalik Soat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Kategoriya</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow 
                  key={subject.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-gray-600 dark:text-gray-400">{subject.description}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                      <Clock className="h-4 w-4 mr-1" />
                      {subject.hoursPerWeek} soat
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-semibold px-3 py-1 rounded-full border ${getCategoryBadgeClass(subject.category)}`}>
                      {getCategoryLabel(subject.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
                      subject.status === 'active' 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                    }`}>
                      {subject.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
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

export default SubjectsPage;