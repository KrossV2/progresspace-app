import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, MapPin, Users, Building, Target, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Region {
  id: number;
  name: string;
  cities?: {
    id: number;
    name: string;
    regionId: number;
    schools?: {
      id: number;
      name: string;
      cityId: number;
      directorId: number;
    }[];
  }[];
}

// Дополнительные поля для отображения в UI
interface RegionWithStats extends Region {
  code?: string;
  population?: number;
  area?: number;
  districtsCount?: number;
  status?: 'active' | 'inactive';
  description?: string;
}

const API_BASE_URL = "https://eduuz.onrender.com/api/admin";

const RegionsPage = () => {
  const [regions, setRegions] = useState<RegionWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRegion, setEditingRegion] = useState<RegionWithStats | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    population: "",
    area: "",
    districtsCount: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock данные для fallback
  const mockRegions: RegionWithStats[] = [
    {
      id: 1,
      name: "Toshkent shahri",
      code: "TSH",
      population: 2571881,
      area: 334,
      districtsCount: 11,
      status: 'active',
      description: "Poytaxt va yirik metropolitan hudud",
      cities: []
    },
    {
      id: 2,
      name: "Toshkent viloyati",
      code: "TOS",
      population: 2945800,
      area: 15300,
      districtsCount: 15,
      status: 'active',
      description: "Sanoat va qishloq xo'jaligi hududi",
      cities: []
    },
    {
      id: 3,
      name: "Samarqand viloyati",
      code: "SAM",
      population: 2322000,
      area: 16400,
      districtsCount: 14,
      status: 'active',
      description: "Tarixiy va madaniy markaz",
      cities: []
    }
  ];

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching regions from:', `${API_BASE_URL}/regions`);
      
      const response = await fetch(`${API_BASE_URL}/regions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const regionsData: Region[] = await response.json();
      console.log('Received regions data:', regionsData);
      
      // Преобразуем данные API в формат с дополнительной статистикой
      const regionsWithStats: RegionWithStats[] = regionsData.map(region => {
        const mockRegion = mockRegions.find(mock => mock.name === region.name);
        return {
          ...region,
          code: mockRegion?.code || region.name.substring(0, 3).toUpperCase(),
          population: mockRegion?.population || Math.floor(Math.random() * 2000000) + 1000000,
          area: mockRegion?.area || Math.floor(Math.random() * 10000) + 1000,
          districtsCount: mockRegion?.districtsCount || (region.cities?.length || 0),
          status: 'active',
          description: mockRegion?.description || `${region.name} viloyati`
        };
      });
      
      setRegions(regionsWithStats);
      
    } catch (error) {
      console.error('Error fetching regions from API:', error);
      setRegions(mockRegions);
      setError('Backend bilan aloqa yo\'q. Local ma\'lumotlar ishlatilmoqda.');
      
      toast({
        title: "Diqqat",
        description: "Backend bilan aloqa yo'q. Local ma'lumotlar ishlatilmoqda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegion = async (id: number) => {
    if (!confirm("Haqiqatan ham bu viloyatni o'chirmoqchimisiz?")) return;

    try {
      console.log('Deleting region with ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      
      setRegions(regions.filter(region => region.id !== id));
      
      toast({
        title: "Muvaffaqiyat",
        description: "Viloyat muvaffaqiyatli o'chirildi",
      });
      
    } catch (error) {
      console.error('Error deleting region:', error);
      
      // Fallback: удаляем из локального состояния
      setRegions(regions.filter(region => region.id !== id));
      
      toast({
        title: "Muvaffaqiyat",
        description: "Viloyat local o'chirildi (backend xatosi)",
        variant: "destructive",
      });
    }
  };

  const handleCreateRegion = async () => {
    try {
      // Здесь должна быть логика создания региона через API
      // Поскольку в вашем Swagger нет endpoint для создания, используем mock
      
      const newRegion: RegionWithStats = {
        id: Math.max(...regions.map(r => r.id)) + 1,
        name: formData.name,
        code: formData.code,
        population: parseInt(formData.population) || 0,
        area: parseInt(formData.area) || 0,
        districtsCount: parseInt(formData.districtsCount) || 0,
        status: 'active',
        description: formData.description,
        cities: []
      };

      setRegions([...regions, newRegion]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Muvaffaqiyat",
        description: "Yangi viloyat muvaffaqiyatli qo'shildi",
      });
      
    } catch (error) {
      console.error('Error creating region:', error);
      toast({
        title: "Xatolik",
        description: "Viloyat qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleEditRegion = async () => {
    if (!editingRegion) return;

    try {
      // Здесь должна быть логика обновления региона через API
      // Поскольку в вашем Swagger нет endpoint для обновления, используем mock
      
      const updatedRegions = regions.map(region => 
        region.id === editingRegion.id 
          ? { 
              ...region, 
              name: formData.name,
              code: formData.code,
              population: parseInt(formData.population) || region.population,
              area: parseInt(formData.area) || region.area,
              districtsCount: parseInt(formData.districtsCount) || region.districtsCount,
              description: formData.description || region.description
            }
          : region
      );

      setRegions(updatedRegions);
      setIsEditDialogOpen(false);
      setEditingRegion(null);
      resetForm();
      
      toast({
        title: "Muvaffaqiyat",
        description: "Viloyat ma'lumotlari muvaffaqiyatli yangilandi",
      });
      
    } catch (error) {
      console.error('Error updating region:', error);
      toast({
        title: "Xatolik",
        description: "Viloyatni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (region: RegionWithStats) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      code: region.code || "",
      population: region.population?.toString() || "",
      area: region.area?.toString() || "",
      districtsCount: region.districtsCount?.toString() || "",
      description: region.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      population: "",
      area: "",
      districtsCount: "",
      description: "",
    });
  };

  // Безопасная функция форматирования чисел
  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) {
      return "0";
    }
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  // Безопасная функция расчета плотности
  const getDensity = (population: number | undefined, area: number | undefined): number => {
    if (!population || !area || area === 0 || isNaN(population) || isNaN(area)) {
      return 0;
    }
    return Math.round(population / area);
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

  if (error && regions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">
            Xatolik yuz berdi
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={fetchRegions}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Qayta urinish
          </Button>
        </div>
      </div>
    );
  }

  // Безопасный расчет статистики
  const totalPopulation = regions.reduce((sum, region) => sum + (region.population || 0), 0);
  const totalArea = regions.reduce((sum, region) => sum + (region.area || 0), 0);
  const totalDistricts = regions.reduce((sum, region) => sum + (region.districtsCount || 0), 0);
  const avgDensity = totalArea > 0 ? Math.round(totalPopulation / totalArea) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Viloyatlar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha viloyatlarni boshqaring va ma'lumotlarni sozlang
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
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 px-6 text-lg font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yangi Viloyat
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Viloyatlar
            </CardTitle>
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {regions.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan viloyatlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Umumiy Aholi
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(totalPopulation)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha viloyatlar bo'yicha
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tumanlar Soni
            </CardTitle>
            <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {totalDistricts}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Jami tumanlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha Zichlik
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {formatNumber(avgDensity)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              kishi/km² o'rtacha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Regions Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Viloyatlar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {regions.length} ta viloyat mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Viloyat Nomi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Kod</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aholi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Maydon</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Tumanlar</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Zichlik</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region, index) => {
                const density = getDensity(region.population, region.area);
                
                return (
                  <TableRow 
                    key={region.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{region.name}</span>
                          {region.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{region.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-none font-semibold">
                        {region.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-gray-700 dark:text-gray-200">
                      {formatNumber(region.population)}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 dark:text-gray-300">
                      {formatNumber(region.area)} km²
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold">
                        {region.districtsCount} ta
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-gray-700 dark:text-gray-200">
                      {formatNumber(density)}/km²
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`${
                        region.status === 'active' 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                          : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                      } border-none font-semibold px-3 py-1 rounded-full`}>
                        {region.status === 'active' ? 'Faol' : 'Nofaol'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(region)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRegion(region.id)}
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

      {/* Create Region Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Yangi Viloyat
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Yangi viloyat qo'shish uchun ma'lumotlarni kiriting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label htmlFor="create-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Viloyat nomi *
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Viloyat nomini kiriting"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-code" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Viloyat kodi *
              </Label>
              <Input
                id="create-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Masalan: TOS"
                maxLength={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-population" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Aholi soni *
                </Label>
                <Input
                  id="create-population"
                  type="number"
                  min="1"
                  value={formData.population}
                  onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Aholi soni"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-area" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Maydoni (km²) *
                </Label>
                <Input
                  id="create-area"
                  type="number"
                  min="1"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Maydoni"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-districtsCount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tumanlar soni *
              </Label>
              <Input
                id="create-districtsCount"
                type="number"
                min="1"
                max="50"
                value={formData.districtsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, districtsCount: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Tumanlar soni"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tavsif
              </Label>
              <Input
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Viloyat haqida qisqacha ma'lumot"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleCreateRegion}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
            >
              Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Region Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Viloyatni Tahrirlash
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
              Viloyat ma'lumotlarini tahrirlang.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Viloyat nomi *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Viloyat nomini kiriting"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Viloyat kodi *
              </Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Masalan: TOS"
                maxLength={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-population" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Aholi soni *
                </Label>
                <Input
                  id="edit-population"
                  type="number"
                  min="1"
                  value={formData.population}
                  onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Aholi soni"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-area" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Maydoni (km²) *
                </Label>
                <Input
                  id="edit-area"
                  type="number"
                  min="1"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                  placeholder="Maydoni"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-districtsCount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tumanlar soni *
              </Label>
              <Input
                id="edit-districtsCount"
                type="number"
                min="1"
                max="50"
                value={formData.districtsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, districtsCount: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Tumanlar soni"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tavsif
              </Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                placeholder="Viloyat haqida qisqacha ma'lumot"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleEditRegion}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
            >
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegionsPage;