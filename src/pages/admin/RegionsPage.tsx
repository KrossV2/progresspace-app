import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, MapPin, Users, Building, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Region {
  id: number;
  name: string;
  code: string;
  population: number;
  area: number;
  districtsCount: number;
  status: 'active' | 'inactive';
  description: string;
}

const RegionsPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    population: "",
    area: "",
    districtsCount: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const regionsData: Region[] = [
        {
          id: 1,
          name: "Toshkent shahri",
          code: "TSH",
          population: 2571881,
          area: 334,
          districtsCount: 11,
          status: 'active',
          description: "Poytaxt va yirik metropolitan hudud"
        },
        {
          id: 2,
          name: "Toshkent viloyati",
          code: "TOS",
          population: 2945800,
          area: 15300,
          districtsCount: 15,
          status: 'active',
          description: "Sanoat va qishloq xo'jaligi hududi"
        },
        {
          id: 3,
          name: "Samarqand viloyati",
          code: "SAM",
          population: 2325400,
          area: 16400,
          districtsCount: 14,
          status: 'active',
          description: "Tarixiy va madaniy markaz"
        },
        {
          id: 4,
          name: "Buxoro viloyati",
          code: "BUX",
          population: 1893500,
          area: 39400,
          districtsCount: 11,
          status: 'active',
          description: "Qadimiy madaniyat va me'morchilik yodgorliklari"
        },
        {
          id: 5,
          name: "Xorazm viloyati",
          code: "XOR",
          population: 1833800,
          area: 6300,
          districtsCount: 10,
          status: 'active',
          description: "Amudaryo bo'yidagi qadimiy viloyat"
        },
        {
          id: 6,
          name: "Qashqadaryo viloyati",
          code: "QAS",
          population: 3293600,
          area: 28400,
          districtsCount: 13,
          status: 'inactive',
          description: "Tabiiy resurslarga boy hudud"
        },
      ];

      setRegions(regionsData);
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

  const handleDeleteRegion = async (id: number) => {
    if (!confirm("Haqiqatan ham bu viloyatni o'chirmoqchimisiz?")) return;

    try {
      setRegions(regions.filter(region => region.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Viloyat muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyatni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveRegion = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.population || !formData.area || !formData.districtsCount) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRegion) {
        setRegions(regions.map(region => 
          region.id === editingRegion.id 
            ? { 
                ...region, 
                name: formData.name,
                code: formData.code,
                population: parseInt(formData.population),
                area: parseInt(formData.area),
                districtsCount: parseInt(formData.districtsCount),
                description: formData.description
              }
            : region
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Viloyat muvaffaqiyatli yangilandi",
        });
      } else {
        const newRegion: Region = { 
          id: Date.now(), 
          name: formData.name,
          code: formData.code,
          population: parseInt(formData.population),
          area: parseInt(formData.area),
          districtsCount: parseInt(formData.districtsCount),
          description: formData.description,
          status: 'active'
        };
        setRegions([...regions, newRegion]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi viloyat muvaffaqiyatli qo'shildi",
        });
      }

      setFormData({
        name: "",
        code: "",
        population: "",
        area: "",
        districtsCount: "",
        description: "",
      });
      setEditingRegion(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingRegion ? "Viloyatni yangilashda xatolik" : "Viloyat qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (region: Region) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      code: region.code,
      population: region.population.toString(),
      area: region.area.toString(),
      districtsCount: region.districtsCount.toString(),
      description: region.description,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingRegion(null);
    setFormData({
      name: "",
      code: "",
      population: "",
      area: "",
      districtsCount: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('uz-UZ').format(num);
  };

  const getDensity = (population: number, area: number) => {
    return Math.round(population / area);
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

  const activeRegions = regions.filter(r => r.status === 'active').length;
  const inactiveRegions = regions.filter(r => r.status === 'inactive').length;
  const totalPopulation = regions.reduce((sum, region) => sum + region.population, 0);
  const totalArea = regions.reduce((sum, region) => sum + region.area, 0);
  const totalDistricts = regions.reduce((sum, region) => sum + region.districtsCount, 0);

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
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi viloyat
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingRegion ? "Viloyatni tahrirlash" : "Yangi viloyat qo'shish"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2">
                  Viloyat ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Viloyat nomi *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Viloyat nomini kiriting"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Viloyat kodi *
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Masalan: TOS"
                    maxLength={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="population" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Aholi soni *
                    </Label>
                    <Input
                      id="population"
                      type="number"
                      min="1"
                      value={formData.population}
                      onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
                      className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                      placeholder="Aholi soni"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Maydoni (km²) *
                    </Label>
                    <Input
                      id="area"
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
                  <Label htmlFor="districtsCount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tumanlar soni *
                  </Label>
                  <Input
                    id="districtsCount"
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
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tavsif
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                    placeholder="Viloyat haqida qisqacha ma'lumot"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleSaveRegion}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-3 text-lg font-semibold"
                >
                  {editingRegion ? "Yangilash" : "Qo'shish"}
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
              Faol Viloyatlar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {activeRegions}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Faol ishlayotgan viloyatlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Nofaol Viloyatlar
            </CardTitle>
            <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
              {inactiveRegions}
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
              Jami Aholi
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {formatNumber(totalPopulation)}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha viloyatlarda jami
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Umumiy Maydon
            </CardTitle>
            <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(totalArea)} km²
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha viloyatlar maydoni
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
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(totalPopulation / totalArea)}/km²
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              O'rtacha aholi zichligi
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
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Kodi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Aholi</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Maydon</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Tumanlar</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Zichlik</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Holat</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region, index) => (
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
                        <span className="font-semibold text-gray-700 dark:text-gray-200 block">{region.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{region.description}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                      {region.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{formatNumber(region.population)}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-gray-600 dark:text-gray-400">{formatNumber(region.area)} km²</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                      {region.districtsCount} ta
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-none font-semibold">
                      {getDensity(region.population, region.area)}/km²
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(region.status)}`}>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionsPage;