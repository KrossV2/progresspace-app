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
import "@/styles/admin/UsersPage.css";

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

  // имитация API: просто загружаем фейковые данные
  useEffect(() => {
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
  }, []);

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

  const handleDeleteUser = (id: number) => {
    if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "O'chirildi", description: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
  };

  const handleSaveUser = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.role) {
      toast({ title: "Xatolik", description: "Majburiy maydonlarni to‘ldiring", variant: "destructive" });
      return;
    }

    if (editingUser) {
      // update
      const updated = users.map(u =>
        u.id === editingUser.id ? { ...u, ...formData, role: formData.role as User['role'] } : u
      );
      setUsers(updated);
      toast({ title: "Yangilandi", description: "Foydalanuvchi yangilandi" });
    } else {
      // create
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
      toast({ title: "Qo'shildi", description: "Yangi foydalanuvchi qo‘shildi" });
    }

    resetForm();
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

  const getRoleBadge = (role: string) => {
    const colors = {
      student: "role-badge role-student",
      teacher: "role-badge role-teacher",
      parent: "role-badge role-parent",
      director: "role-badge role-director",
      admin: "role-badge role-admin"
    };
    const labels = {
      student: "O'quvchi",
      teacher: "O‘qituvchi",
      parent: "Ota-ona",
      director: "Direktor",
      admin: "Administrator"
    };
    return <Badge className={colors[role as keyof typeof colors]}>{labels[role as keyof typeof labels]}</Badge>;
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    students: users.filter(u => u.role === "student").length,
    teachers: users.filter(u => u.role === "teacher").length,
    parents: users.filter(u => u.role === "parent").length,
    directors: users.filter(u => u.role === "director").length,
  };

  if (loading) return <div className="text-center p-10">Yuklanmoqda...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="users-title">Foydalanuvchilar Boshqaruvi</h1>
          <p className="users-subtitle">API holda lokal versiya</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}><UserPlus className="mr-2" />Yangi foydalanuvchi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Tahrirlash" : "Qo'shish"}</DialogTitle>
              <DialogDescription>Foydalanuvchi ma’lumotlarini kiriting.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>Ism</Label>
                <Input value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div>
                <Label>Familiya</Label>
                <Input value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <Label>Rol</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v as User['role'] })}>
                  <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">O‘quvchi</SelectItem>
                    <SelectItem value="teacher">O‘qituvchi</SelectItem>
                    <SelectItem value="parent">Ota-ona</SelectItem>
                    <SelectItem value="director">Direktor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSaveUser}>{editingUser ? "Yangilash" : "Qo'shish"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="users-stats">
        <Card><CardHeader><CardTitle>Jami</CardTitle></CardHeader><CardContent>{stats.total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Faol</CardTitle></CardHeader><CardContent>{stats.active}</CardContent></Card>
        <Card><CardHeader><CardTitle>O‘quvchilar</CardTitle></CardHeader><CardContent>{stats.students}</CardContent></Card>
      </div>

      {/* Search + Filter */}
      <Card className="filters-card">
        <CardContent className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Rol tanlang" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="student">O‘quvchi</SelectItem>
              <SelectItem value="teacher">O‘qituvchi</SelectItem>
              <SelectItem value="parent">Ota-ona</SelectItem>
              <SelectItem value="director">Direktor</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="users-table-card">
        <CardHeader>
          <CardTitle>Foydalanuvchilar Ro‘yxati</CardTitle>
          <CardDescription>{filteredUsers.length} ta topildi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Ism</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{u.first_name} {u.last_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    <Badge className={`status-badge status-${u.is_active ? 'active' : 'inactive'}`}>
                      {u.is_active ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(u)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id)} className="ml-2"><Trash2 className="h-4 w-4" /></Button>
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

export default UsersPage;
