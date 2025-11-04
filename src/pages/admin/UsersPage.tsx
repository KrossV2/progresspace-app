import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search, UserPlus, Users, Mail, User, Users2, School, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'director' | 'admin';
  is_active: boolean;
  school_name?: string;
  class_name?: string;
  subject?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "" as User['role'] | "",
    password: "",
    phone_number: "",
    is_active: true
  });

  const roles = [
    { value: 'student', label: 'Oʻquvchi', color: 'blue', icon: GraduationCap },
    { value: 'teacher', label: 'Oʻqituvchi', color: 'green', icon: User },
    { value: 'parent', label: 'Ota-ona', color: 'purple', icon: Users2 },
    { value: 'director', label: 'Direktor', color: 'orange', icon: School },
    { value: 'admin', label: 'Administrator', color: 'red', icon: Users },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const mockUsers: User[] = [
        {
          id: 1,
          first_name: "Aziz",
          last_name: "Karimov",
          email: "aziz@example.com",
          role: "student",
          is_active: true,
          class_name: "11A",
          school_name: "TTPU High School",
          phone_number: "+998901234567"
        },
        {
          id: 2,
          first_name: "Dilshod",
          last_name: "Rasulov",
          email: "dilshod@example.com",
          role: "teacher",
          is_active: true,
          subject: "Matematika",
          school_name: "TTPU High School",
          phone_number: "+998909876543"
        },
        {
          id: 3,
          first_name: "Malika",
          last_name: "Yuldasheva",
          email: "malika@example.com",
          role: "parent",
          is_active: false,
          phone_number: "+998933210987"
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
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

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const filterUsers = () => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;

    try {
      setUsers(users.filter(u => u.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Foydalanuvchini o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.role) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingUser) {
        const updated = users.map(u =>
          u.id === editingUser.id ? { ...u, ...formData, role: formData.role as User['role'] } : u
        );
        setUsers(updated);
        toast({
          title: "Muvaffaqiyat",
          description: "Foydalanuvchi muvaffaqiyatli yangilandi",
        });
      } else {
        const newUser: User = {
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role as User['role'],
          is_active: true,
          phone_number: formData.phone_number,
        };
        setUsers([...users, newUser]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi foydalanuvchi muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingUser ? "Foydalanuvchini yangilashda xatolik" : "Foydalanuvchi qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ first_name: "", last_name: "", email: "", role: "", password: "", phone_number: "", is_active: true });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      password: "",
      phone_number: user.phone_number || "",
      is_active: user.is_active
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getRoleBadgeClass = (role: string) => {
    const colorMap: { [key: string]: string } = {
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      teacher: 'bg-green-100 text-green-800 border-green-200',
      parent: 'bg-purple-100 text-purple-800 border-purple-200',
      director: 'bg-orange-100 text-orange-800 border-orange-200',
      admin: 'bg-red-100 text-red-800 border-red-200',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig?.label || 'Noma\'lum';
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig?.icon || User;
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    students: users.filter(u => u.role === "student").length,
    teachers: users.filter(u => u.role === "teacher").length,
    parents: users.filter(u => u.role === "parent").length,
    directors: users.filter(u => u.role === "director").length,
    admins: users.filter(u => u.role === "admin").length,
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
              Foydalanuvchilar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha foydalanuvchilarni boshqaring va tizimni sozlang
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Yangi foydalanuvchi
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Foydalanuvchi ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Foydalanuvchi ismini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Foydalanuvchi familiyasini kiriting"
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
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Email manzilini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rol *
                  </Label>
                  <select 
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Rolni tanlang</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon raqami
                  </Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Telefon raqamini kiriting"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveUser}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingUser ? "Yangilash" : "Qo'shish"}
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
              Jami Foydalanuvchilar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {stats.total}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan foydalanuvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol Foydalanuvchilar
            </CardTitle>
            <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.active}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Tizimda faol foydalanuvchilar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Oʻquvchilar
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {stats.students}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Ro'yxatdagi o'quvchilar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Oʻqituvchilar
            </CardTitle>
            <Users2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {stats.teachers}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Tizimdagi o'qituvchilar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Qidiruv va Filtrlash
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Foydalanuvchilarni qidirish va filtrlash
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Ism, familiya yoki email boʻyicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors h-12 text-lg"
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-4 py-2 h-12 text-lg min-w-[200px]"
            >
              <option value="all">Barcha rollar</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Foydalanuvchilar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {filteredUsers.length} ta foydalanuvchi topildi
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Foydalanuvchi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Rol</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <TableRow 
                    key={user.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 block">
                            {user.first_name} {user.last_name}
                          </span>
                          {user.phone_number && (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {user.phone_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`font-semibold px-3 py-1 rounded-full border ${getRoleBadgeClass(user.role)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`font-semibold px-3 py-1 rounded-full border-none ${
                        user.is_active 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                      }`}>
                        {user.is_active ? 'Faol' : 'Nofaol'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;