import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, School, MapPin, Users, Phone, Mail, Building, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Переключите на false когда CORS будет настроен на бэкенде
const USE_MOCK_DATA = true;

const API_BASE_URL = "https://eduuz.onrender.com/api";

interface Region {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  regionId: number;
  regionName?: string;
}

interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  directorName: string;
  regionId: number;
  cityId: number;
  regionName?: string;
  cityName?: string;
  status: 'active' | 'inactive';
  directorId?: number;
}

// Mock данные для тестирования
const mockSchools: School[] = [
  {
    id: 1,
    name: "1-umumiy o'rta ta'lim maktabi",
    address: "Yunusobod tumani, 12-daha",
    phone: "+998901234567",
    email: "school1@edu.uz",
    directorName: "Aliyev Sanjar",
    regionId: 1,
    cityId: 1,
    regionName: "Toshkent shahri",
    cityName: "Toshkent",
    status: 'active',
    directorId: 1
  },
  {
    id: 2,
    name: "25-sonli ixtisoslashtirilgan maktab",
    address: "Mirzo Ulug'bek tumani, Bobur ko'chasi",
    phone: "+998902345678",
    email: "school25@edu.uz",
    directorName: "Xolmirzayeva Dilobar",
    regionId: 1,
    cityId: 1,
    regionName: "Toshkent shahri",
    cityName: "Toshkent",
    status: 'active',
    directorId: 2
  },
  {
    id: 3,
    name: "Samarqand shahar 5-sonli maktab",
    address: "Samarqand shahar, Registon ko'chasi",
    phone: "+998903456789",
    email: "school5@sam.uz",
    directorName: "Karimov Rustam",
    regionId: 2,
    cityId: 2,
    regionName: "Samarqand viloyati",
    cityName: "Samarqand",
    status: 'active',
    directorId: 3
  },
  {
    id: 4,
    name: "Buxoro 3-sonli akademik litsey",
    address: "Buxoro shahar, Buxoro ko'chasi",
    phone: "+998904567890",
    email: "litsey3@bukhara.uz",
    directorName: "Nosirova Malika",
    regionId: 3,
    cityId: 3,
    regionName: "Buxoro viloyati",
    cityName: "Buxoro",
    status: 'inactive',
    directorId: 4
  }
];

const mockRegions: Region[] = [
  { id: 1, name: "Toshkent shahri" },
  { id: 2, name: "Samarqand viloyati" },
  { id: 3, name: "Buxoro viloyati" },
  { id: 4, name: "Andijon viloyati" },
  { id: 5, name: "Farg'ona viloyati" },
  { id: 6, name: "Namangan viloyati" },
  { id: 7, name: "Qashqadaryo viloyati" }
];

const mockCities: City[] = [
  { id: 1, name: "Toshkent", regionId: 1 },
  { id: 2, name: "Samarqand", regionId: 2 },
  { id: 3, name: "Buxoro", regionId: 3 },
  { id: 4, name: "Andijon", regionId: 4 },
  { id: 5, name: "Farg'ona", regionId: 5 },
  { id: 6, name: "Namangan", regionId: 6 },
  { id: 7, name: "Qarshi", regionId: 7 },
  { id: 8, name: "Urgut", regionId: 2 },
  { id: 9, name: "Kattaqo'rg'on", regionId: 2 }
];

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    directorName: "",
    regionId: "",
    cityId: "",
    directorId: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (USE_MOCK_DATA) {
        // Используем mock данные для тестирования
        setTimeout(() => {
          setSchools(mockSchools);
          setRegions(mockRegions);
          setCities(mockCities);
          setFilteredCities(mockCities);
          setLoading(false);
        }, 1000);
        return;
      }

      // Попытка загрузки с бэкенда с обработкой CORS
      const fetchWithCors = async (url: string) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          return await response.json();
        } catch (error) {
          console.error(`Failed to fetch from ${url}:`, error);
          throw error;
        }
      };

      // Параллельная загрузка данных
      const [schoolsData, regionsData, citiesData] = await Promise.all([
        fetchWithCors(`${API_BASE_URL}/admin/schools`),
        fetchWithCors(`${API_BASE_URL}/admin/regions`),
        fetchWithCors(`${API_BASE_URL}/admin/cities`)
      ]);

      setSchools(schoolsData);
      setRegions(regionsData);
      setCities(citiesData);
      setFilteredCities(citiesData);

    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Fallback на mock данные при ошибке
      setSchools(mockSchools);
      setRegions(mockRegions);
      setCities(mockCities);
      setFilteredCities(mockCities);
      
      toast({
        title: "Diqqat",
        description: "Serverga ulanmadi. Demo rejimda ishlamoqdasiz.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (regionId: string) => {
    setFormData(prev => ({ ...prev, regionId, cityId: "" }));
    const filtered = cities.filter(city => city.regionId === parseInt(regionId));
    setFilteredCities(filtered);
  };

  const handleDeleteSchool = async (id: number) => {
    if (!confirm("Haqiqatan ham bu maktabni o'chirmoqchimisiz?")) return;

    try {
      if (USE_MOCK_DATA) {
        // Mock удаление
        setSchools(schools.filter(school => school.id !== id));
        toast({
          title: "Muvaffaqiyat",
          description: "Maktab muvaffaqiyatli o'chirildi",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/schools/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSchools(schools.filter(school => school.id !== id));
        toast({
          title: "Muvaffaqiyat",
          description: "Maktab muvaffaqiyatli o'chirildi",
        });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Maktabni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveSchool = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.regionId || !formData.cityId) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      const schoolData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        directorName: formData.directorName,
        cityId: parseInt(formData.cityId),
        directorId: formData.directorId || 1,
        status: 'active' as const
      };

      if (USE_MOCK_DATA) {
        // Mock сохранение
        if (editingSchool) {
          const updatedSchool = { 
            ...schoolData, 
            id: editingSchool.id, 
            regionId: parseInt(formData.regionId),
            regionName: regions.find(r => r.id === parseInt(formData.regionId))?.name,
            cityName: cities.find(c => c.id === parseInt(formData.cityId))?.name
          };
          setSchools(schools.map(school => 
            school.id === editingSchool.id ? updatedSchool : school
          ));
          toast({
            title: "Muvaffaqiyat",
            description: "Maktab muvaffaqiyatli yangilandi",
          });
        } else {
          const newSchool = { 
            ...schoolData, 
            id: Math.max(...schools.map(s => s.id), 0) + 1,
            regionId: parseInt(formData.regionId),
            regionName: regions.find(r => r.id === parseInt(formData.regionId))?.name,
            cityName: cities.find(c => c.id === parseInt(formData.cityId))?.name
          };
          setSchools([...schools, newSchool]);
          toast({
            title: "Muvaffaqiyat",
            description: "Yangi maktab muvaffaqiyatli qo'shildi",
          });
        }
      } else {
        // Реальное сохранение на бэкенд
        let response;
        if (editingSchool) {
          response = await fetch(`${API_BASE_URL}/admin/schools/${editingSchool.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(schoolData),
          });
        } else {
          response = await fetch(`${API_BASE_URL}/admin/schools`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(schoolData),
          });
        }

        if (response.ok) {
          const savedSchool = await response.json();
          
          if (editingSchool) {
            setSchools(schools.map(school => 
              school.id === editingSchool.id ? savedSchool : school
            ));
            toast({
              title: "Muvaffaqiyat",
              description: "Maktab muvaffaqiyatli yangilandi",
            });
          } else {
            setSchools([...schools, savedSchool]);
            toast({
              title: "Muvaffaqiyat",
              description: "Yangi maktab muvaffaqiyatli qo'shildi",
            });
          }
        } else {
          throw new Error("Save failed");
        }
      }

      // Сброс формы
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        directorName: "",
        regionId: "",
        cityId: "",
        directorId: 0
      });
      setEditingSchool(null);
      setIsDialogOpen(false);
      setFilteredCities(cities);

    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingSchool ? "Maktabni yangilashda xatolik" : "Maktab qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      phone: school.phone,
      email: school.email,
      directorName: school.directorName,
      regionId: school.regionId?.toString() || "",
      cityId: school.cityId.toString(),
      directorId: school.directorId || 0
    });
    
    const filtered = cities.filter(city => city.regionId === school.regionId);
    setFilteredCities(filtered);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSchool(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      directorName: "",
      regionId: "",
      cityId: "",
      directorId: 0
    });
    setFilteredCities(cities);
    setIsDialogOpen(true);
  };

  const getRegionStats = () => {
    const stats: { [key: string]: number } = {};
    schools.forEach(school => {
      const regionName = school.regionName || "Noma'lum";
      stats[regionName] = (stats[regionName] || 0) + 1;
    });
    return stats;
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'active' 
      ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none' 
      : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-none';
  };

  // Фильтрация школ
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.directorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || school.regionId === parseInt(selectedRegion);
    const matchesStatus = selectedStatus === "all" || school.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

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

  const regionStats = getRegionStats();
  const activeSchools = schools.filter(s => s.status === 'active').length;
  const inactiveSchools = schools.filter(s => s.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Maktablar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha maktablarni boshqaring va monitoring qiling
            </p>
            {USE_MOCK_DATA && (
              <Badge className="mt-2 bg-yellow-100 text-yellow-800 border-none">
                Demo rejim - Mock ma'lumotlar
              </Badge>
            )}
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi maktab
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingSchool ? "Maktabni tahrirlash" : "Yangi maktab qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Maktab ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Maktab nomi *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Maktab nomini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Manzil *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Maktab manzilini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Viloyat *
                  </Label>
                  <Select value={formData.regionId} onValueChange={handleRegionChange}>
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Shahar *
                  </Label>
                  <Select 
                    value={formData.cityId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cityId: value }))}
                    disabled={!formData.regionId}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors">
                      <SelectValue placeholder={formData.regionId ? "Shaharni tanlang" : "Avval viloyatni tanlang"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="directorName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Direktor
                  </Label>
                  <Input
                    id="directorName"
                    value={formData.directorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, directorName: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Direktor F.I.SH"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="+998901234567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="maktab@edu.uz"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveSchool}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingSchool ? "Yangilash" : "Qo'shish"}
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
              Jami Maktablar
            </CardTitle>
            <School className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {schools.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan maktablar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol Maktablar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {activeSchools}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faol ishlayotgan maktablar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Nofaol Maktablar
            </CardTitle>
            <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {inactiveSchools}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faoliyati to'xtatilgan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Viloyatlar
            </CardTitle>
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(schools.map(s => s.regionId)).size}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Maktablar joylashgan viloyatlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Maktab, direktor yoki manzil bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                <SelectValue placeholder="Barcha viloyatlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha viloyatlar</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                <SelectValue placeholder="Barcha holatlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holatlar</SelectItem>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="inactive">Nofaol</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Regions Distribution */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Viloyatlar Bo'yicha Taqsimot
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Har bir viloyatdagi maktablar soni
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(regionStats).map(([region, count]) => (
              <div 
                key={region} 
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{region}</span>
                </div>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none font-semibold px-3 py-1 rounded-lg">
                  {count} ta maktab
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Maktablar Ro'yxati
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
                {filteredSchools.length} ta maktab topildi
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Jami: {schools.length} ta
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Maktab Nomi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Manzil</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Viloyat/Shahar</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Direktor</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aloqa</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold">Hech qanday maktab topilmadi</p>
                    <p className="text-sm mt-2">Qidiruv shartlariga mos maktablar mavjud emas</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchools.map((school, index) => (
                  <TableRow 
                    key={school.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <School className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 block">{school.name}</span>
                          {school.email && (
                            <div className="flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{school.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{school.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none font-semibold px-2 py-1 rounded-lg text-xs">
                          {school.regionName}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-2 py-1 rounded-lg text-xs">
                          {school.cityName}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-600 dark:text-gray-400">{school.directorName}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {school.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{school.phone}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(school.status)}`}>
                        {school.status === 'active' ? 'Faol' : 'Nofaol'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(school)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSchool(school.id)}
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
    </div>
  );
};

export default SchoolsPage;