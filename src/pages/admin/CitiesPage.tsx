import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, MapPin, Building2, Globe, Sun, Moon, AlertCircle } from "lucide-react";
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

interface CityCreateDto {
  name: string;
  regionId: number;
}

interface CityUpdateDto {
  name: string;
  regionId: number;
}

// Используем ваш бэкенд URL
const API_BASE_URL = "https://eduuz.onrender.com/api/admin";

const CitiesPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [newCityName, setNewCityName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // API функции с обработкой ошибок
  const api = {
    getCities: async (): Promise<City[]> => {
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch cities: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    },

    getRegions: async (): Promise<Region[]> => {
      const response = await fetch(`${API_BASE_URL}/regions`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch regions: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    },

    createCity: async (cityData: CityCreateDto): Promise<City> => {
      const response = await fetch(`${API_BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create city: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    },

    updateCity: async (id: number, cityData: CityUpdateDto): Promise<City> => {
      const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update city: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    },

    deleteCity: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete city: ${response.status} ${errorText}`);
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Тема
    const savedTheme = localStorage.getItem("theme");
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : isSystemDark;
    setIsDarkTheme(initialDark);
    applyTheme(initialDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching data from:', API_BASE_URL);
      
      const [citiesData, regionsData] = await Promise.all([
        api.getCities(),
        api.getRegions()
      ]);

      console.log('Cities data:', citiesData);
      console.log('Regions data:', regionsData);

      // Обогащаем города названиями регионов
      const enrichedCities = citiesData.map(city => {
        const region = regionsData.find(r => r.id === city.regionId);
        return {
          ...city,
          regionName: region?.name
        };
      });

      setRegions(regionsData);
      setCities(enrichedCities);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      setError(errorMessage);
      toast({
        title: "Xatolik",
        description: `Ma'lumotlarni yuklashda xatolik: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCity = async (id: number) => {
    if (!confirm("Haqiqatan ham bu shaharni o'chirmoqchimisiz?")) return;

    try {
      await api.deleteCity(id);
      setCities(cities.filter(city => city.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Shahar muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      console.error('Error deleting city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      toast({
        title: "Xatolik",
        description: `Shaharni o'chirishda xatolik: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleSaveCity = async () => {
    if (!newCityName.trim()) {
      toast({
        title: "Xatolik",
        description: "Shahar nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRegionId) {
      toast({
        title: "Xatolik",
        description: "Viloyatni tanlang",
        variant: "destructive",
      });
      return;
    }

    try {
      const cityData = {
        name: newCityName.trim(),
        regionId: parseInt(selectedRegionId)
      };

      console.log('Saving city:', cityData);

      if (editingCity) {
        // Редактирование существующего города
        const updatedCity = await api.updateCity(editingCity.id, cityData);
        const region = regions.find(r => r.id === updatedCity.regionId);
        
        setCities(cities.map(city => 
          city.id === editingCity.id 
            ? { ...updatedCity, regionName: region?.name }
            : city
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Shahar muvaffaqiyatli yangilandi",
        });
      } else {
        // Создание нового города
        const newCity = await api.createCity(cityData);
        const region = regions.find(r => r.id === newCity.regionId);
        
        setCities([...cities, { ...newCity, regionName: region?.name }]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi shahar muvaffaqiyatli qo'shildi",
        });
      }

      // Сброс формы
      setNewCityName("");
      setSelectedRegionId("");
      setEditingCity(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving city:', error);
      const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      toast({
        title: "Xatolik",
        description: `${editingCity ? "Shaharni yangilashda" : "Shahar qo'shishda"} xatolik: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (city: City) => {
    setEditingCity(city);
    setNewCityName(city.name);
    setSelectedRegionId(city.regionId.toString());
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCity(null);
    setNewCityName("");
    setSelectedRegionId("");
    setIsDialogOpen(true);
  };

  const getRegionStats = () => {
    const stats: { [key: string]: number } = {};
    cities.forEach(city => {
      const regionName = city.regionName || regions.find(r => r.id === city.regionId)?.name || "Noma'lum";
      stats[regionName] = (stats[regionName] || 0) + 1;
    });
    return stats;
  };

  // Остальная часть компонента остается без изменений...
  // [Здесь идет остальной JSX код, который у вас уже есть]

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">
            Xatolik yuz berdi
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={fetchData}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Qayta urinish
          </Button>
        </div>
      </div>
    );
  }

  const regionStats = getRegionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Shaharlar Boshqaruvi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Barcha shahar va viloyatlarni boshqaring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-300 dark:border-gray-600"
            >
              {isDarkTheme ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={openCreateDialog}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yangi shahar
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {editingCity ? "Shaharni tahrirlash" : "Yangi shahar qo'shish"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                    Shahar ma'lumotlarini kiriting va saqlang.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 my-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Shahar nomi
                    </Label>
                    <Input
                      id="name"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                      placeholder="Shahar nomini kiriting"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Viloyat
                    </Label>
                    <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                      <SelectTrigger className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
                        <SelectValue placeholder="Viloyatni tanlang" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg">
                        {regions.map((region) => (
                          <SelectItem 
                            key={region.id} 
                            value={region.id.toString()}
                            className="text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                          >
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleSaveCity}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                  >
                    {editingCity ? "Yangilash" : "Qo'shish"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Shaharlar
            </CardTitle>
            <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              {cities.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha ro'yxatga olingan shaharlar
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
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {regions.length}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faol viloyatlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'rtacha Shahar
            </CardTitle>
            <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {regions.length > 0 ? Math.round(cities.length / regions.length * 10) / 10 : 0}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Har viloyatda o'rtacha
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Eng Ko'p
            </CardTitle>
            <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {Object.values(regionStats).length > 0 ? Math.max(...Object.values(regionStats)) : 0}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Bir viloyatdagi maksimal
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
            Har bir viloyatdagi shaharlar soni
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
                  {count} ta shahar
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cities Table */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Shaharlar Ro'yxati
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Jami {cities.length} ta shahar mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Shahar Nomi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Viloyat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city, index) => (
                <TableRow 
                  key={city.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{city.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold">
                      {city.regionName || regions.find(r => r.id === city.regionId)?.name || "Noma'lum"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold px-3 py-1 rounded-full">
                      Faol
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(city)}
                        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCity(city.id)}
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

export default CitiesPage;