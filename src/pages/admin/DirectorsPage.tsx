import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserPlus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

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

  // TODO: Replace with actual API URL
  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

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
      // TODO: Implement actual API calls
      // const [directorsResponse, schoolsResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/admin/directors`),
      //   fetch(`${API_BASE_URL}/api/admin/schools`)
      // ]);
      // const directorsData = await directorsResponse.json();
      // const schoolsData = await schoolsResponse.json();
      
      // Mock data for now
      const schoolsData = [
        { id: 1, name: "1-umumiy o'rta ta'lim maktabi", address: "Shayxontohur tumani", cityName: "Toshkent shahri" },
        { id: 2, name: "120-maktab", address: "Yunusobod tumani", cityName: "Toshkent shahri" },
        { id: 3, name: "5-umumiy o'rta ta'lim maktabi", address: "Markaz ko'chasi", cityName: "Samarqand shahri" },
        { id: 4, name: "15-maktab", address: "Navoi ko'chasi", cityName: "Buxoro shahri" },
      ];

      const directorsData = [
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
          isActive: false,
          phoneNumber: "+998901122334"
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/admin/directors/${id}`, {
      //   method: 'DELETE',
      // });
      
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/admin/directors/${editingDirector.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     email: formData.email,
        //     schoolId: formData.schoolId ? parseInt(formData.schoolId) : null,
        //     phoneNumber: formData.phoneNumber
        //   }),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/admin/directors`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     email: formData.email,
        //     schoolId: formData.schoolId ? parseInt(formData.schoolId) : null,
        //     phoneNumber: formData.phoneNumber
        //   }),
        // });
        // const newDirector = await response.json();
        
        const newDirector = { 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Direktorlar</h1>
          <p className="text-muted-foreground">Maktab direktorlarini boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Yangi direktor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDirector ? "Direktorni tahrirlash" : "Yangi direktor qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Direktor ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="col-span-3"
                  placeholder="Ismni kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="col-span-3"
                  placeholder="Familiyani kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Telefon
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="+998901234567"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="school" className="text-right">
                  Maktab
                </Label>
                <Select value={formData.schoolId} onValueChange={(value) => setFormData({ ...formData, schoolId: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Maktabni tanlang (ixtiyoriy)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Maktab tayinlanmagan</SelectItem>
                    {(editingDirector ? schools : availableSchools).map((school) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name} ({school.cityName})
                      </SelectItem>
                    ))}
                    {editingDirector && editingDirector.schoolId && (
                      <SelectItem value={editingDirector.schoolId.toString()}>
                        {editingDirector.schoolName} (Joriy)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveDirector}>
                {editingDirector ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Direktorlar ro'yxati</CardTitle>
          <CardDescription>
            Jami {directors.length} ta direktor mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Ism Familiya</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Maktab</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directors.map((director, index) => (
                <TableRow key={director.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{director.firstName} {director.lastName}</TableCell>
                  <TableCell>{director.email}</TableCell>
                  <TableCell>{director.phoneNumber || "-"}</TableCell>
                  <TableCell>
                    {director.schoolName ? (
                      <span className="text-green-600">{director.schoolName}</span>
                    ) : (
                      <span className="text-amber-600">Tayinlanmagan</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={director.isActive ? "default" : "secondary"}>
                      {director.isActive ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to director details */}}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(director)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDirector(director.id)}
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