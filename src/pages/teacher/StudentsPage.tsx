import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, User, Users, BookOpen, Edit, Trash2, X, Save, Phone, Mail, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentRow {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  className: string;
  birthDate: string;
  isActive: boolean;
  parentName: string;
  parentPhone: string;
}

const TeacherStudentsPage = () => {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<StudentRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentRow | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    className: "",
    birthDate: "",
    isActive: true,
    parentName: "",
    parentPhone: ""
  });

  const { toast } = useToast();

  // Mock data for classes
  const classes = [
    { id: "1", name: "9-A" },
    { id: "2", name: "9-B" },
    { id: "3", name: "10-A" },
    { id: "4", name: "10-B" },
    { id: "5", name: "11-A" },
    { id: "6", name: "11-B" }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, rows]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Mock data - API call replacement
      setTimeout(() => {
        const mockData: StudentRow[] = [
          { 
            id: 1, 
            firstName: "Aziz", 
            lastName: "Karimov", 
            phoneNumber: "+998901234567",
            email: "aziz@student.example.com",
            className: "10-A", 
            birthDate: "2007-05-15",
            isActive: true,
            parentName: "Rustam Karimov",
            parentPhone: "+998901234567"
          },
          { 
            id: 2, 
            firstName: "Malika", 
            lastName: "Tosheva", 
            phoneNumber: "+998907654321",
            email: "malika@student.example.com",
            className: "9-B", 
            birthDate: "2008-08-22",
            isActive: true,
            parentName: "Dilnoza Tosheva",
            parentPhone: "+998907654321"
          },
          { 
            id: 3, 
            firstName: "Rustam", 
            lastName: "Saidov", 
            phoneNumber: "+998912345678",
            email: "rustam@student.example.com",
            className: "10-A", 
            birthDate: "2007-12-03",
            isActive: false,
            parentName: "Shavkat Saidov",
            parentPhone: "+998912345678"
          },
          { 
            id: 4, 
            firstName: "Zarina", 
            lastName: "Xolmirzayeva", 
            phoneNumber: "+998935678901",
            email: "zarina@student.example.com",
            className: "9-B", 
            birthDate: "2008-03-18",
            isActive: true,
            parentName: "Gulnora Xolmirzayeva",
            parentPhone: "+998935678901"
          },
          { 
            id: 5, 
            firstName: "Sardor", 
            lastName: "Rahimov", 
            phoneNumber: "+998945678912",
            email: "sardor@student.example.com",
            className: "11-A", 
            birthDate: "2006-07-30",
            isActive: true,
            parentName: "Jamshid Rahimov",
            parentPhone: "+998945678912"
          }
        ];
        setRows(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'quvchilar ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  // CREATE - Yangi o'quvchi qo'shish
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStudent: StudentRow = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        className: formData.className,
        birthDate: formData.birthDate,
        isActive: formData.isActive,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone
      };

      setRows(prev => [newStudent, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi o'quvchi qo'shildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'quvchini qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  // UPDATE - O'quvchini tahrirlash
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      setRows(prev => prev.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData }
          : student
      ));
      
      setIsEditDialogOpen(false);
      setEditingStudent(null);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "O'quvchi ma'lumotlari tahrirlandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'quvchini tahrirlashda xatolik",
        variant: "destructive",
      });
    }
  };

  // DELETE - O'quvchini o'chirish
  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      setRows(prev => prev.filter(student => student.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "O'quvchi ro'yxatdan o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'quvchini o'chirishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      className: "",
      birthDate: "",
      isActive: true,
      parentName: "",
      parentPhone: ""
    });
  };

  const openEditDialog = (student: StudentRow) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      phoneNumber: student.phoneNumber,
      email: student.email,
      className: student.className,
      birthDate: student.birthDate,
      isActive: student.isActive,
      parentName: student.parentName,
      parentPhone: student.parentPhone
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (student: StudentRow) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
        isActive 
          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800" 
          : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
      }`}>
        {isActive ? "Faol" : "Nofaol"}
      </Badge>
    );
  };

  const getClassBadge = (className: string) => {
    const classColors: { [key: string]: string } = {
      "9-A": "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
      "9-B": "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
      "10-A": "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
      "10-B": "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800",
      "11-A": "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
      "11-B": "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800"
    };
    
    return (
      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${classColors[className] || "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"}`}>
        {className}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
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

  // Statistics calculations
  const totalStudents = rows.length;
  const activeStudents = rows.filter(s => s.isActive).length;
  const inactiveStudents = rows.filter(s => !s.isActive).length;
  const classesCount = [...new Set(rows.map(s => s.className))].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              O'quvchilar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Sinf o'quvchilari ro'yxati va ma'lumotlari
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi O'quvchi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami O'quvchilar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan o'quvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol O'quvchilar
            </CardTitle>
            <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {activeStudents}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faol ishlayotgan o'quvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sinflar
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {classesCount}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              O'quvchilar joylashgan sinflar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha Yosh
            </CardTitle>
            <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {rows.length > 0 
                ? Math.round(rows.reduce((acc, student) => acc + calculateAge(student.birthDate), 0) / rows.length)
                : 0
              }
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              O'quvchilarning o'rtacha yoshi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Qidiruv va Filtrlash
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            O'quvchi, sinf, telefon yoki ota-ona bo'yicha qidirish
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="O'quvchi, sinf, telefon yoki ota-ona bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredRows.length} ta natija
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            O'quvchilar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Barcha sinf o'quvchilari va ularning ma'lumotlari
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">O'quvchi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aloqa</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinf</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Yosh</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Ota-Ona</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Ma'lumotlar yuklanmoqda...</p>
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Hech qanday natija topilmadi</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-semibold text-gray-700 dark:text-gray-200">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{student.phoneNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getClassBadge(student.className)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{calculateAge(student.birthDate)} yosh</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(student.birthDate)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{student.parentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{student.parentPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(student.isActive)}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(student)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(student)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE Student Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Yangi O'quvchi
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Yangi o'quvchi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-6 my-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Ism"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Familiya"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="+998901234567"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf *
                  </Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tug'ilgan sana *
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ota-Ona Ismi *
                </Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  placeholder="Ota-ona ismi"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ota-Ona Telefoni *
                </Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  placeholder="+998901234567"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <Label htmlFor="isActive" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Faol o'quvchi
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              O'quvchi Ma'lumotlarini Tahrirlash
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              O'quvchi ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-6 my-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism *
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya *
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon *
                  </Label>
                  <Input
                    id="edit-phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-className" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sinf *
                  </Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birthDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tug'ilgan sana *
                  </Label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parentName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ota-Ona Ismi *
                </Label>
                <Input
                  id="edit-parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parentPhone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Ota-Ona Telefoni *
                </Label>
                <Input
                  id="edit-parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <Label htmlFor="edit-isActive" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Faol o'quvchi
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              O'quvchini O'chirish
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Bu o'quvchini ro'yxatdan o'chirishni istaysizmi?
            </DialogDescription>
          </DialogHeader>
          {studentToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {studentToDelete.firstName} {studentToDelete.lastName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {studentToDelete.className} • {studentToDelete.phoneNumber}
              </p>
            </div>
          )}
          <DialogFooter className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Bekor qilish
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherStudentsPage;