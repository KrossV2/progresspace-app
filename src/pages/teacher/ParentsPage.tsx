import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, User, Mail, Edit, Trash2, X, Save, Users, GraduationCap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParentRow {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  studentName: string;
  studentClass: string;
  relationship: string;
}

const TeacherParentsPage = () => {
  const [rows, setRows] = useState<ParentRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<ParentRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentRow | null>(null);
  const [parentToDelete, setParentToDelete] = useState<ParentRow | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    studentName: "",
    studentClass: "",
    relationship: ""
  });

  const { toast } = useToast();

  const classes = [
    { id: "1", name: "9-A" },
    { id: "2", name: "9-B" },
    { id: "3", name: "10-A" },
    { id: "4", name: "10-B" },
    { id: "5", name: "11-A" }
  ];

  const relationships = [
    { id: "father", name: "Ota" },
    { id: "mother", name: "Ona" },
    { id: "guardian", name: "Vasiy" },
    { id: "grandparent", name: "Bobo/Buvi" }
  ];

  useEffect(() => {
    fetchParents();
  }, []);

  useEffect(() => {
    filterParents();
  }, [searchTerm, rows]);

  const fetchParents = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockData: ParentRow[] = [
          { 
            id: 1, 
            firstName: "Rustam", 
            lastName: "Karimov", 
            phoneNumber: "+998901234567", 
            email: "rustam@example.com",
            studentName: "Aziz Karimov", 
            studentClass: "10-A",
            relationship: "father"
          },
          { 
            id: 2, 
            firstName: "Dilnoza", 
            lastName: "Tosheva", 
            phoneNumber: "+998907654321", 
            email: "dilnoza@example.com",
            studentName: "Malika Tosheva", 
            studentClass: "9-B",
            relationship: "mother"
          },
          { 
            id: 3, 
            firstName: "Shavkat", 
            lastName: "Rahimov", 
            phoneNumber: "+998912345678", 
            email: "shavkat@example.com",
            studentName: "Sardor Rahimov", 
            studentClass: "11-A",
            relationship: "father"
          },
          { 
            id: 4, 
            firstName: "Gulnora", 
            lastName: "Xolmirzayeva", 
            phoneNumber: "+998935678901", 
            email: "gulnora@example.com",
            studentName: "Zarina Xolmirzayeva", 
            studentClass: "9-B",
            relationship: "mother"
          }
        ];
        setRows(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ota-onalar ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterParents = () => {
    if (!searchTerm.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter(parent =>
      parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.phoneNumber.includes(searchTerm) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newParent: ParentRow = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        relationship: formData.relationship
      };

      setRows(prev => [newParent, ...prev]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi ota-ona qo'shildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ota-onani qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParent) return;

    try {
      setRows(prev => prev.map(parent => 
        parent.id === editingParent.id 
          ? { ...parent, ...formData }
          : parent
      ));
      
      setIsEditDialogOpen(false);
      setEditingParent(null);
      resetForm();
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Ota-ona ma'lumotlari tahrirlandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ota-onani tahrirlashda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!parentToDelete) return;

    try {
      setRows(prev => prev.filter(parent => parent.id !== parentToDelete.id));
      setIsDeleteDialogOpen(false);
      setParentToDelete(null);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Ota-ona ro'yxatdan o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ota-onani o'chirishda xatolik",
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
      studentName: "",
      studentClass: "",
      relationship: ""
    });
  };

  const openEditDialog = (parent: ParentRow) => {
    setEditingParent(parent);
    setFormData({
      firstName: parent.firstName,
      lastName: parent.lastName,
      phoneNumber: parent.phoneNumber,
      email: parent.email,
      studentName: parent.studentName,
      studentClass: parent.studentClass,
      relationship: parent.relationship
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (parent: ParentRow) => {
    setParentToDelete(parent);
    setIsDeleteDialogOpen(true);
  };

  const getRelationshipBadge = (relationship: string) => {
    const relationshipMap: { [key: string]: { label: string, variant: "default" | "secondary" | "destructive" | "outline" } } = {
      father: { label: "Ota", variant: "default" },
      mother: { label: "Ona", variant: "secondary" },
      guardian: { label: "Vasiy", variant: "outline" },
      grandparent: { label: "Bobo/Buvi", variant: "outline" }
    };
    
    const rel = relationshipMap[relationship] || { label: relationship, variant: "outline" };
    return <Badge variant={rel.variant}>{rel.label}</Badge>;
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Ota-onalar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              O'quvchilar ota-onalari bilan aloqa uchun ma'lumotlar
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi Ota-ona
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Ota-onalar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {rows.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Ro'yxatdagi ota-onalar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Onalar
            </CardTitle>
            <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {rows.filter(p => p.relationship === 'mother').length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Farzand onalari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Otalar
            </CardTitle>
            <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {rows.filter(p => p.relationship === 'father').length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Farzand otalari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Aloqa
            </CardTitle>
            <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              100%
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Bog'lanish imkoniyati
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Qidiruv va Filtrlash
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
            Ota-onalarni qidirish va filtrlash
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Ota-ona, o'quvchi yoki telefon bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors h-12 text-lg"
              />
            </div>
            <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {filteredRows.length} ta natija
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ota-onalar Ro'yxati
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-2">
            Barcha ro'yxatga olingan ota-onalar
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Ota-ona</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aloqa</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Farzandi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Sinfi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Qarindoshlik</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Harakatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Ma'lumotlar yuklanmoqda...</p>
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Hech qanday natija topilmadi
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      Qidiruv so'rovingiz bo'yicha hech narsa topilmadi
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((parent) => (
                  <TableRow key={parent.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {parent.firstName} {parent.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{parent.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{parent.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{parent.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 font-semibold">
                        {parent.studentClass}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      {getRelationshipBadge(parent.relationship)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCall(parent.phoneNumber)}
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEmail(parent.email)}
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(parent)}
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                          onClick={() => openDeleteDialog(parent)}
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

      {/* CREATE Parent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Yangi Ota-ona
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Yangi ota-ona ma'lumotlarini kiriting
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
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Ism"
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
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Familiya"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Telefon *
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="+998901234567"
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
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Farzand Ismi *
                </Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Farzandning ismi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentClass" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Farzand Sinfi
                  </Label>
                  <select 
                    id="studentClass"
                    value={formData.studentClass}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentClass: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Sinf tanlang</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Qarindoshlik
                  </Label>
                  <select 
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Tanlang</option>
                    {relationships.map((rel) => (
                      <option key={rel.id} value={rel.id}>
                        {rel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
              >
                <Save className="h-5 w-5 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT Parent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Ota-ona Ma'lumotlarini Tahrirlash
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Ota-ona ma'lumotlarini o'zgartiring
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
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
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
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Telefon *
                </Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
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
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-studentName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Farzand Ismi *
                </Label>
                <Input
                  id="edit-studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-studentClass" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Farzand Sinfi
                  </Label>
                  <select 
                    id="edit-studentClass"
                    value={formData.studentClass}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentClass: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Sinf tanlang</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-relationship" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Qarindoshlik
                  </Label>
                  <select 
                    id="edit-relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Tanlang</option>
                    {relationships.map((rel) => (
                      <option key={rel.id} value={rel.id}>
                        {rel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleEdit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
              >
                <Save className="h-5 w-5 mr-2" />
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
              Ota-onani O'chirish
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Bu ota-onani ro'yxatdan o'chirishni istaysizmi?
            </DialogDescription>
          </DialogHeader>
          {parentToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {parentToDelete.firstName} {parentToDelete.lastName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {parentToDelete.studentName} • {parentToDelete.studentClass}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Bekor qilish
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherParentsPage;