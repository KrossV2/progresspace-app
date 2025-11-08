import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Search, UserPlus, Users, Mail, User, Users2, School, GraduationCap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  roleId: number;
  schoolId: number;
  imagePath?: string;
  passwordHash?: string;
}

interface UserWithDetails extends User {
  is_active?: boolean;
  school_name?: string;
  class_name?: string;
  subject?: string;
  created_at?: string;
  updated_at?: string;
}

const API_BASE_URL = "https://eduuz.onrender.com/api/admin";

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    schoolId: "",
    password: "",
    is_active: true
  });

  const roles = [
    { id: 1, value: 'admin', label: 'Administrator', color: 'red', icon: Users },
    { id: 2, value: 'director', label: 'Direktor', color: 'orange', icon: School },
    { id: 3, value: 'teacher', label: 'Oʻqituvchi', color: 'green', icon: User },
    { id: 4, value: 'student', label: 'Oʻquvchi', color: 'blue', icon: GraduationCap },
    { id: 5, value: 'parent', label: 'Ota-ona', color: 'purple', icon: Users2 },
  ];

  // Mock данные для fallback
  const mockUsers: UserWithDetails[] = [
    {
      id: 1,
      firstName: "Aziz",
      lastName: "Karimov",
      email: "aziz@example.com",
      phoneNumber: "+998901234567",
      username: "aziz_karimov",
      roleId: 4,
      schoolId: 1,
      is_active: true,
      class_name: "11A",
      school_name: "TTPU High School"
    },
    {
      id: 2,
      firstName: "Dilshod",
      lastName: "Rasulov",
      email: "dilshod@example.com",
      phoneNumber: "+998909876543",
      username: "dilshod_rasulov",
      roleId: 3,
      schoolId: 1,
      is_active: true,
      subject: "Matematika",
      school_name: "TTPU High School"
    },
    {
      id: 3,
      firstName: "Malika",
      lastName: "Yuldasheva",
      email: "malika@example.com",
      phoneNumber: "+998933210987",
      username: "malika_yuldasheva",
      roleId: 5,
      schoolId: 1,
      is_active: false,
      school_name: "TTPU High School"
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, schoolFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching users from:', `${API_BASE_URL}/users`);
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usersData: User[] = await response.json();
      console.log('Received users data:', usersData);
      
      // Преобразуем данные API в формат с дополнительными полями для UI
      const usersWithDetails: UserWithDetails[] = usersData.map(user => {
        const mockUser = mockUsers.find(mock => mock.id === user.id);
        const role = roles.find(r => r.id === user.roleId);
        
        return {
          ...user,
          is_active: mockUser?.is_active ?? true,
          school_name: mockUser?.school_name || `Maktab ${user.schoolId}`,
          class_name: mockUser?.class_name,
          subject: mockUser?.subject,
          roleName: role?.value || 'unknown'
        };
      });
      
      setUsers(usersWithDetails);
      
    } catch (error) {
      console.error('Error fetching users from API:', error);
      setUsers(mockUsers);
      setError('Backend bilan aloqa yo\'q. Local ma\'lumotlar ishlatilmogda.');
      
      toast({
        title: "Diqqat",
        description: "Backend bilan aloqa yo'q. Local ma'lumotlar ishlatilmogda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (searchTerm: string, roleId?: string, schoolId?: string) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (roleId && roleId !== 'all') params.append('roleId', roleId);
      if (schoolId && schoolId !== 'all') params.append('schoolId', schoolId);
      
      const response = await fetch(`${API_BASE_URL}/users/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const searchResults: User[] = await response.json();
      
      // Преобразуем результаты поиска
      const usersWithDetails: UserWithDetails[] = searchResults.map(user => {
        const role = roles.find(r => r.id === user.roleId);
        return {
          ...user,
          is_active: true,
          school_name: `Maktab ${user.schoolId}`,
          roleName: role?.value || 'unknown'
        };
      });
      
      setUsers(usersWithDetails);
      
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Xatolik",
        description: "Qidiruvda xatolik yuz berdi. Local ma'lumotlar ishlatilmogda.",
        variant: "destructive",
      });
      // Fallback к локальной фильтрации
      filterUsersLocally();
    } finally {
      setLoading(false);
    }
  };

  const filterUsersLocally = () => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      const role = roles.find(r => r.value === roleFilter);
      if (role) {
        filtered = filtered.filter(u => u.roleId === role.id);
      }
    }
    setFilteredUsers(filtered);
  };

  const filterUsers = () => {
    // Если есть поисковый запрос или фильтры, используем API поиск
    if (searchTerm.trim() || roleFilter !== "all" || schoolFilter !== "all") {
      searchUsers(searchTerm, roleFilter !== "all" ? roles.find(r => r.value === roleFilter)?.id.toString() : undefined, schoolFilter !== "all" ? schoolFilter : undefined);
    } else {
      // Иначе показываем всех пользователей
      setFilteredUsers(users);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;

    try {
      console.log('Deleting user with ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      
      setUsers(users.filter(u => u.id !== id));
      
      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi muvaffaqiyatli o'chirildi",
      });
      
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Fallback: удаляем из локального состояния
      setUsers(users.filter(u => u.id !== id));
      
      toast({
        title: "Muvaffaqiyat",
        description: "Foydalanuvchi local o'chirildi (backend xatosi)",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.roleId) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingUser) {
        // Обновление пользователя
        const formDataToSend = new FormData();
        formDataToSend.append('FirstName', formData.firstName);
        formDataToSend.append('LastName', formData.lastName);
        formDataToSend.append('Email', formData.email);
        formDataToSend.append('PhoneNumber', formData.phoneNumber);
        formDataToSend.append('RoleId', formData.roleId);
        formDataToSend.append('SchoolId', formData.schoolId || '1');

        const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
          method: 'PUT',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`Update failed with status: ${response.status}`);
        }

        const updatedUser = await response.json();
        
        // Обновляем локальное состояние
        const updated = users.map(u =>
          u.id === editingUser.id ? { ...u, ...updatedUser, firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phoneNumber: formData.phoneNumber, roleId: parseInt(formData.roleId) } : u
        );
        setUsers(updated);
        
        toast({
          title: "Muvaffaqiyat",
          description: "Foydalanuvchi muvaffaqiyatli yangilandi",
        });
      } else {
        // Создание пользователя - здесь нужно использовать соответствующий endpoint
        // Поскольку в API нет общего endpoint для создания пользователя, используем mock
        const newUser: UserWithDetails = {
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          username: formData.email.split('@')[0],
          roleId: parseInt(formData.roleId),
          schoolId: parseInt(formData.schoolId) || 1,
          is_active: true,
          school_name: `Maktab ${formData.schoolId || 1}`
        };
        
        setUsers([...users, newUser]);
        
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi foydalanuvchi muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Xatolik",
        description: editingUser ? "Foydalanuvchini yangilashda xatolik" : "Foydalanuvchi qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      firstName: "", 
      lastName: "", 
      email: "", 
      phoneNumber: "", 
      roleId: "", 
      schoolId: "", 
      password: "", 
      is_active: true 
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = async (user: UserWithDetails) => {
    try {
      // Получаем детальную информацию о пользователе
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setEditingUser({ ...user, ...userDetails });
      } else {
        setEditingUser(user);
      }

      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        roleId: user.roleId.toString(),
        schoolId: user.schoolId.toString(),
        password: "",
        is_active: user.is_active ?? true
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setEditingUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        roleId: user.roleId.toString(),
        schoolId: user.schoolId.toString(),
        password: "",
        is_active: user.is_active ?? true
      });
      setIsDialogOpen(true);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getRoleBadgeClass = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    const colorMap: { [key: string]: string } = {
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      teacher: 'bg-green-100 text-green-800 border-green-200',
      parent: 'bg-purple-100 text-purple-800 border-purple-200',
      director: 'bg-orange-100 text-orange-800 border-orange-200',
      admin: 'bg-red-100 text-red-800 border-red-200',
    };
    return colorMap[role?.value || ''] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleLabel = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role?.label || 'Noma\'lum';
  };

  const getRoleIcon = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role?.icon || User;
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    students: users.filter(u => u.roleId === 4).length,
    teachers: users.filter(u => u.roleId === 3).length,
    parents: users.filter(u => u.roleId === 5).length,
    directors: users.filter(u => u.roleId === 2).length,
    admins: users.filter(u => u.roleId === 1).length,
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">
            Xatolik yuz berdi
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={fetchUsers}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Qayta urinish
          </Button>
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
            {error && (
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Local Mode
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  Backend: Offline
                </Badge>
              </div>
            )}
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
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ism *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Foydalanuvchi ismini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Familiya *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon raqami
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Telefon raqamini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roleId" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rol *
                  </Label>
                  <select 
                    id="roleId"
                    value={formData.roleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors px-3 py-2"
                  >
                    <option value="">Rolni tanlang</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Parol
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                      placeholder="Parolni kiriting"
                    />
                  </div>
                )}
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
                placeholder="Ism, familiya, email yoki telefon boʻyicha qidirish..."
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
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Maktab</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.roleId);
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
                            {user.firstName} {user.lastName}
                          </span>
                          {user.phoneNumber && (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {user.phoneNumber}
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
                      <Badge className={`font-semibold px-3 py-1 rounded-full border ${getRoleBadgeClass(user.roleId)}`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.roleId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {user.school_name}
                      </span>
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