import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, School, MapPin, Users, Phone, Mail, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  director: string;
  regionId: number;
  cityId: number;
  regionName?: string;
  cityName?: string;
  status: 'active' | 'inactive';
}

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    director: "",
    regionId: "",
    cityId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock data for regions
      const regionsData: Region[] = [
        { id: 1, name: "Toshkent" },
        { id: 2, name: "Samarqand" },
        { id: 3, name: "Buxoro" },
        { id: 4, name: "Andijon" },
        { id: 5, name: "Farg'ona" },
        { id: 6, name: "Namangan" },
      ];

      // Mock data for cities
      const citiesData: City[] = [
        { id: 1, name: "Toshkent shahri", regionId: 1, regionName: "Toshkent" },
        { id: 2, name: "Olmaliq", regionId: 1, regionName: "Toshkent" },
        { id: 3, name: "Samarqand shahri", regionId: 2, regionName: "Samarqand" },
        { id: 4, name: "Buxoro shahri", regionId: 3, regionName: "Buxoro" },
        { id: 5, name: "Andijon shahri", regionId: 4, regionName: "Andijon" },
        { id: 6, name: "Farg'ona shahri", regionId: 5, regionName: "Farg'ona" },
        { id: 7, name: "Namangan shahri", regionId: 6, regionName: "Namangan" },
      ];

      // Mock data for schools
      const schoolsData: School[] = [
        {
          id: 1,
          name: "25-sonli Maktab",
          address: "Yunusobod tumani, 5-mavze",
          phone: "+998901234567",
          email: "school25@edu.uz",
          director: "Nilufar Karimova",
          regionId: 1,
          cityId: 1,
          regionName: "Toshkent",
          cityName: "Toshkent shahri",
          status: 'active'
        },
        {
          id: 2,
          name: "1-sonli Akademik Litsey",
          address: "Mirzo Ulug'bek tumani, Universitet ko'chasi",
          phone: "+998901234568",
          email: "lyceum1@edu.uz",
          director: "Bekzod Tursunov",
          regionId: 1,
          cityId: 1,
          regionName: "Toshkent",
          cityName: "Toshkent shahri",
          status: 'active'
        },
        {
          id: 3,
          name: "Samarqand 5-sonli Maktab",
          address: "Samarqand shahri, Registon ko'chasi",
          phone: "+998901234569",
          email: "school5sam@edu.uz",
          director: "Malika Tosheva",
          regionId: 2,
          cityId: 3,
          regionName: "Samarqand",
          cityName: "Samarqand shahri",
          status: 'active'
        },
        {
          id: 4,
          name: "Buxoro 12-sonli Maktab",
          address: "Buxoro shahri, Labi Hovuz",
          phone: "+998901234570",
          email: "school12bux@edu.uz",
          director: "Aziz Karimov",
          regionId: 3,
          cityId: 4,
          regionName: "Buxoro",
          cityName: "Buxoro shahri",
          status: 'active'
        },
        {
          id: 5,
          name: "Andijon 3-sonli Maktab",
          address: "Andijon shahri, Bobur ko'chasi",
          phone: "+998901234571",
          email: "school3and@edu.uz",
          director: "Sevara Norova",
          regionId: 4,
          cityId: 5,
          regionName: "Andijon",
          cityName: "Andijon shahri",
          status: 'inactive'
        },
      ];

      setRegions(regionsData);
      setCities(citiesData);
      setSchools(schoolsData);
      setFilteredCities(citiesData);
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

  const handleRegionChange = (regionId: string) => {
    setFormData(prev => ({ ...prev, regionId, cityId: "" }));
    const filtered = cities.filter(city => city.regionId === parseInt(regionId));
    setFilteredCities(filtered);
  };

  const handleDeleteSchool = async (id: number) => {
    if (!confirm("Haqiqatan ham bu maktabni o'chirmoqchimisiz?")) return;

    try {
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
    if (!formData.name.trim() || !formData.address.trim() || !formData.regionId || !formData.cityId) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      const regionName = regions.find(r => r.id === parseInt(formData.regionId))?.name || "";
      const cityName = cities.find(c => c.id === parseInt(formData.cityId))?.name || "";

      if (editingSchool) {
        setSchools(schools.map(school => 
          school.id === editingSchool.id 
            ? { 
                ...school, 
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                director: formData.director,
                regionId: parseInt(formData.regionId),
                cityId: parseInt(formData.cityId),
                regionName,
                cityName
              }
            : school
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Maktab muvaffaqiyatli yangilandi",
        });
      } else {
        const newSchool: School = { 
          id: Date.now(), 
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          director: formData.director,
          regionId: parseInt(formData.regionId),
          cityId: parseInt(formData.cityId),
          regionName,
          cityName,
          status: 'active'
        };
        setSchools([...schools, newSchool]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi maktab muvaffaqiyatli qo'shildi",
        });
      }

      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        director: "",
        regionId: "",
        cityId: "",
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
      director: school.director,
      regionId: school.regionId.toString(),
      cityId: school.cityId.toString(),
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
      director: "",
      regionId: "",
      cityId: "",
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
                  <Label htmlFor="director" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Direktor
                  </Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
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
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Maktablar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {schools.length} ta maktab mavjud
          </CardDescription>
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
              {schools.map((school, index) => (
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
                    <span className="text-gray-600 dark:text-gray-400">{school.director}</span>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolsPage;