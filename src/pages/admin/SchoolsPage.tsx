import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

interface City {
  id: number;
  name: string;
  regionName: string;
}

interface School {
  id: number;
  name: string;
  address: string;
  cityId: number;
  cityName?: string;
  directorId?: number;
  directorName?: string;
}

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cityId: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // TODO: Replace with actual API URL
  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // const [schoolsResponse, citiesResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/admin/schools`),
      //   fetch(`${API_BASE_URL}/api/admin/cities`)
      // ]);
      // const schoolsData = await schoolsResponse.json();
      // const citiesData = await citiesResponse.json();
      
      // Mock data for now
      const citiesData = [
        { id: 1, name: "Toshkent shahri", regionName: "Toshkent" },
        { id: 2, name: "Olmaliq", regionName: "Toshkent" },
        { id: 3, name: "Samarqand shahri", regionName: "Samarqand" },
        { id: 4, name: "Buxoro shahri", regionName: "Buxoro" },
      ];

      const schoolsData = [
        { 
          id: 1, 
          name: "1-umumiy o'rta ta'lim maktabi", 
          address: "Shayxontohur tumani, Lutfiy ko'chasi 25", 
          cityId: 1, 
          cityName: "Toshkent shahri",
          directorId: 1,
          directorName: "Malika Usmanova"
        },
        { 
          id: 2, 
          name: "120-maktab", 
          address: "Yunusobod tumani, Bobur ko'chasi 15", 
          cityId: 1, 
          cityName: "Toshkent shahri" 
        },
        { 
          id: 3, 
          name: "5-umumiy o'rta ta'lim maktabi", 
          address: "Markaz ko'chasi 10", 
          cityId: 3, 
          cityName: "Samarqand shahri" 
        },
      ];

      setCities(citiesData);
      setSchools(schoolsData);
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

  const handleDeleteSchool = async (id: number) => {
    if (!confirm("Haqiqatan ham bu maktabni o'chirmoqchimisiz?")) return;

    try {
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/admin/schools/${id}`, {
      //   method: 'DELETE',
      // });
      
      setSchools(schools.filter(school => school.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Maktab muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Maktabni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveSchool = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.cityId) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      const cityName = cities.find(c => c.id === parseInt(formData.cityId))?.name || "";

      if (editingSchool) {
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/admin/schools/${editingSchool.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     address: formData.address,
        //     cityId: parseInt(formData.cityId)
        //   }),
        // });
        
        setSchools(schools.map(school => 
          school.id === editingSchool.id 
            ? { 
                ...school, 
                name: formData.name, 
                address: formData.address,
                cityId: parseInt(formData.cityId),
                cityName 
              }
            : school
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Maktab muvaffaqiyatli yangilandi",
        });
      } else {
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/admin/schools`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     address: formData.address,
        //     cityId: parseInt(formData.cityId)
        //   }),
        // });
        // const newSchool = await response.json();
        
        const newSchool = { 
          id: Date.now(), 
          name: formData.name,
          address: formData.address,
          cityId: parseInt(formData.cityId),
          cityName 
        };
        setSchools([...schools, newSchool]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi maktab muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingSchool ? "Maktabni yangilashda xatolik" : "Maktab qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", address: "", cityId: "" });
    setEditingSchool(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      cityId: school.cityId.toString()
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSchool(null);
    setFormData({ name: "", address: "", cityId: "" });
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
          <h1 className="text-3xl font-bold">Maktablar</h1>
          <p className="text-muted-foreground">Barcha maktablarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Yangi maktab qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchool ? "Maktabni tahrirlash" : "Yangi maktab qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Maktab ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nomi
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Maktab nomini kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Manzil
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="col-span-3"
                  placeholder="Maktab manzilini kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  Shahar
                </Label>
                <Select value={formData.cityId} onValueChange={(value) => setFormData({ ...formData, cityId: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Shaharni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name} ({city.regionName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveSchool}>
                {editingSchool ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maktablar ro'yxati</CardTitle>
          <CardDescription>
            Jami {schools.length} ta maktab mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Maktab nomi</TableHead>
                <TableHead>Manzil</TableHead>
                <TableHead>Shahar</TableHead>
                <TableHead>Direktor</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school, index) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.address}</TableCell>
                  <TableCell>{school.cityName}</TableCell>
                  <TableCell>
                    {school.directorName ? (
                      <span className="text-green-600">{school.directorName}</span>
                    ) : (
                      <span className="text-amber-600">Tayinlanmagan</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to school details */}}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(school)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchool(school.id)}
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

export default SchoolsPage;