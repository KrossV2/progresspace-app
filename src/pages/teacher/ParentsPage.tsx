import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, User, Mail, Edit, Trash2, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/teacher/ParentPage.css"

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

  // Mock data for classes and relationships
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
      // Mock data - API call replacement
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

  // CREATE - Yangi ota-ona qo'shish
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

  // UPDATE - Ota-onani tahrirlash
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

  // DELETE - Ota-onani o'chirish
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ota-onalar
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              O'quvchilar ota-onalari bilan aloqa uchun ma'lumotlar
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi Ota-ona
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami Ota-onalar</p>
                <p className="text-2xl font-bold text-slate-900">{rows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Onalar</p>
                <p className="text-2xl font-bold text-slate-900">
                  {rows.filter(p => p.relationship === 'mother').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Otalar</p>
                <p className="text-2xl font-bold text-slate-900">
                  {rows.filter(p => p.relationship === 'father').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Aloqa</p>
                <p className="text-2xl font-bold text-slate-900">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Ota-ona, o'quvchi yoki telefon bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-slate-600">
              {filteredRows.length} ta natija
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Ota-onalar Ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ota-ona</TableHead>
                  <TableHead>Aloqa</TableHead>
                  <TableHead>Farzandi</TableHead>
                  <TableHead>Sinfi</TableHead>
                  <TableHead>Qarindoshlik</TableHead>
                  <TableHead className="text-right">Harakatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-slate-600 mt-2">Ma'lumotlar yuklanmoqda...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Hech qanday natija topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((parent) => (
                    <TableRow key={parent.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {parent.firstName} {parent.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{parent.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">{parent.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{parent.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{parent.studentClass}</Badge>
                      </TableCell>
                      <TableCell>
                        {getRelationshipBadge(parent.relationship)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(parent.phoneNumber)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmail(parent.email)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(parent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          </div>
        </CardContent>
      </Card>

      {/* CREATE Parent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yangi Ota-ona</DialogTitle>
            <DialogDescription>
              Yangi ota-ona ma'lumotlarini kiriting
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Ism</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Ism"
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
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Telefon</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+998901234567"
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
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studentName">Farzand Ismi</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  placeholder="Farzandning ismi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentClass">Farzand Sinfi</Label>
                  <Select value={formData.studentClass} onValueChange={(value) => setFormData({...formData, studentClass: value})}>
                    <SelectTrigger>
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
                <div className="grid gap-2">
                  <Label htmlFor="relationship">Qarindoshlik</Label>
                  <Select value={formData.relationship} onValueChange={(value) => setFormData({...formData, relationship: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel.id} value={rel.id}>
                          {rel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT Parent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ota-ona Ma'lumotlarini Tahrirlash</DialogTitle>
            <DialogDescription>
              Ota-ona ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">Ism</Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">Familiya</Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-phoneNumber">Telefon</Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-studentName">Farzand Ismi</Label>
                <Input
                  id="edit-studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-studentClass">Farzand Sinfi</Label>
                  <Select value={formData.studentClass} onValueChange={(value) => setFormData({...formData, studentClass: value})}>
                    <SelectTrigger>
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
                <div className="grid gap-2">
                  <Label htmlFor="edit-relationship">Qarindoshlik</Label>
                  <Select value={formData.relationship} onValueChange={(value) => setFormData({...formData, relationship: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel.id} value={rel.id}>
                          {rel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Bekor qilish
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ota-onani O'chirish</DialogTitle>
            <DialogDescription>
              Bu ota-onani ro'yxatdan o'chirishni istaysizmi?
            </DialogDescription>
          </DialogHeader>
          {parentToDelete && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-semibold">{parentToDelete.firstName} {parentToDelete.lastName}</p>
              <p className="text-sm text-slate-600">{parentToDelete.studentName} • {parentToDelete.studentClass}</p>
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

export default TeacherParentsPage;