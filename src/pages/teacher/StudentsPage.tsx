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
import "@/styles/teacher/StudentsPage.css"

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
    if (isActive) {
      return <Badge className="badge-grade-excellent">Faol</Badge>;
    } else {
      return <Badge variant="outline">Nofaol</Badge>;
    }
  };

  const getClassBadge = (className: string) => {
    const classColors: { [key: string]: string } = {
      "9-A": "bg-blue-100 text-blue-800 border-blue-200",
      "9-B": "bg-green-100 text-green-800 border-green-200",
      "10-A": "bg-purple-100 text-purple-800 border-purple-200",
      "10-B": "bg-orange-100 text-orange-800 border-orange-200",
      "11-A": "bg-red-100 text-red-800 border-red-200",
      "11-B": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    
    return (
      <Badge variant="outline" className={classColors[className] || "bg-gray-100 text-gray-800 border-gray-200"}>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              O'quvchilar
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Sinf o'quvchilari ro'yxati va ma'lumotlari
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="gradient-button text-white shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi O'quvchi
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="stats-card-parents">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="parents-icon-container parents-icon-blue mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami O'quvchilar</p>
                <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-parents">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="parents-icon-container parents-icon-green mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Faol O'quvchilar</p>
                <p className="text-2xl font-bold text-slate-900">{activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-parents">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="parents-icon-container parents-icon-orange mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Sinflar</p>
                <p className="text-2xl font-bold text-slate-900">{classesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card-parents">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="parents-icon-container parents-icon-purple mr-4">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">O'rtacha Yosh</p>
                <p className="text-2xl font-bold text-slate-900">
                  {rows.length > 0 
                    ? Math.round(rows.reduce((acc, student) => acc + calculateAge(student.birthDate), 0) / rows.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 parents-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="parents-search-container flex-1 w-full">
              <Search className="parents-search-icon h-4 w-4" />
              <Input
                placeholder="O'quvchi, sinf, telefon yoki ota-ona bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="parents-search-input"
              />
            </div>
            <div className="text-sm text-slate-600">
              {filteredRows.length} ta natija
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="parents-card">
        <CardHeader>
          <CardTitle>O'quvchilar Ro'yxati</CardTitle>
          <CardDescription>
            Barcha sinf o'quvchilari va ularning ma'lumotlari
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto parents-scrollbar">
            <Table className="parents-table">
              <TableHeader className="parents-table-header">
                <TableRow>
                  <TableHead className="parents-table-cell">O'quvchi</TableHead>
                  <TableHead className="parents-table-cell">Aloqa</TableHead>
                  <TableHead className="parents-table-cell">Sinf</TableHead>
                  <TableHead className="parents-table-cell">Yosh</TableHead>
                  <TableHead className="parents-table-cell">Ota-Ona</TableHead>
                  <TableHead className="parents-table-cell">Holat</TableHead>
                  <TableHead className="parents-table-cell text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-slate-600 mt-2">Ma'lumotlar yuklanmoqda...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Hech qanday natija topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((student) => (
                    <TableRow key={student.id} className="parents-table-row">
                      <TableCell className="parents-table-cell">
                        <div>
                          <p className="font-medium text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-slate-600">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        <div className="contact-info">
                          <div className="contact-item">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{student.phoneNumber}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        {getClassBadge(student.className)}
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm">{calculateAge(student.birthDate)} yosh</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDate(student.birthDate)}
                        </div>
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        <div>
                          <p className="text-sm font-medium">{student.parentName}</p>
                          <p className="text-xs text-slate-600">{student.parentPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        {getStatusBadge(student.isActive)}
                      </TableCell>
                      <TableCell className="parents-table-cell">
                        <div className="parents-action-buttons">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(student)}
                            className="parents-btn-edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="parents-btn-delete"
                            onClick={() => openDeleteDialog(student)}
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
          </div>
        </CardContent>
      </Card>

      {/* CREATE Student Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="parents-dialog-content sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yangi O'quvchi</DialogTitle>
            <DialogDescription>
              Yangi o'quvchi ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Ism</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Ism"
                    className="parents-form-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Familiya</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Familiya"
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Telefon</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="+998901234567"
                    className="parents-form-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>

              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="className">Sinf</Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger className="parents-select-trigger">
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent className="parents-select-content">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Tug'ilgan sana</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parentName">Ota-Ona Ismi</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  placeholder="Ota-ona ismi"
                  className="parents-form-input"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parentPhone">Ota-Ona Telefoni</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  placeholder="+998901234567"
                  className="parents-form-input"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Faol o'quvchi</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit" className="gradient-button">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="parents-dialog-content sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>O'quvchi Ma'lumotlarini Tahrirlash</DialogTitle>
            <DialogDescription>
              O'quvchi ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">Ism</Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">Familiya</Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phoneNumber">Telefon</Label>
                  <Input
                    id="edit-phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>

              <div className="parents-form-grid parents-form-grid-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-className">Sinf</Label>
                  <Select value={formData.className} onValueChange={(value) => setFormData({...formData, className: value})}>
                    <SelectTrigger className="parents-select-trigger">
                      <SelectValue placeholder="Sinf tanlang" />
                    </SelectTrigger>
                    <SelectContent className="parents-select-content">
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-birthDate">Tug'ilgan sana</Label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="parents-form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-parentName">Ota-Ona Ismi</Label>
                <Input
                  id="edit-parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="parents-form-input"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-parentPhone">Ota-Ona Telefoni</Label>
                <Input
                  id="edit-parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  className="parents-form-input"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-isActive">Faol o'quvchi</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit" className="gradient-button">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="parents-dialog-content sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>O'quvchini O'chirish</DialogTitle>
            <DialogDescription>
              Bu o'quvchini ro'yxatdan o'chirishni istaysizmi?
            </DialogDescription>
          </DialogHeader>
          {studentToDelete && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-semibold">{studentToDelete.firstName} {studentToDelete.lastName}</p>
              <p className="text-sm text-slate-600">{studentToDelete.className} • {studentToDelete.phoneNumber}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
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