import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, MapPin, Building2, Globe, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/admin/CitiesPage.css";

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

const CitiesPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [newCityName, setNewCityName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkTheme(isSystemDark);
    applyTheme(isSystemDark);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('admin-dark');
      document.documentElement.classList.remove('admin-light');
    } else {
      document.documentElement.classList.add('admin-light');
      document.documentElement.classList.remove('admin-dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    applyTheme(newTheme);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const regionsData = [
        { id: 1, name: "Toshkent" },
        { id: 2, name: "Samarqand" },
        { id: 3, name: "Buxoro" },
        { id: 4, name: "Andijon" },
        { id: 5, name: "Farg'ona" },
        { id: 6, name: "Namangan" },
      ];

      const citiesData = [
        { id: 1, name: "Toshkent shahri", regionId: 1, regionName: "Toshkent" },
        { id: 2, name: "Olmaliq", regionId: 1, regionName: "Toshkent" },
        { id: 3, name: "Samarqand shahri", regionId: 2, regionName: "Samarqand" },
        { id: 4, name: "Buxoro shahri", regionId: 3, regionName: "Buxoro" },
        { id: 5, name: "Andijon shahri", regionId: 4, regionName: "Andijon" },
        { id: 6, name: "Farg'ona shahri", regionId: 5, regionName: "Farg'ona" },
        { id: 7, name: "Namangan shahri", regionId: 6, regionName: "Namangan" },
      ];

      setRegions(regionsData);
      setCities(citiesData);
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

  const handleDeleteCity = async (id: number) => {
    if (!confirm("Haqiqatan ham bu shaharni o'chirmoqchimisiz?")) return;

    try {
      setCities(cities.filter(city => city.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Shahar muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Shaharni o'chirishda xatolik yuz berdi",
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
      const regionName = regions.find(r => r.id === parseInt(selectedRegionId))?.name || "";

      if (editingCity) {
        setCities(cities.map(city => 
          city.id === editingCity.id 
            ? { ...city, name: newCityName, regionId: parseInt(selectedRegionId), regionName }
            : city
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Shahar muvaffaqiyatli yangilandi",
        });
      } else {
        const newCity = { 
          id: Date.now(), 
          name: newCityName, 
          regionId: parseInt(selectedRegionId),
          regionName 
        };
        setCities([...cities, newCity]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi shahar muvaffaqiyatli qo'shildi",
        });
      }

      setNewCityName("");
      setSelectedRegionId("");
      setEditingCity(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingCity ? "Shaharni yangilashda xatolik" : "Shahar qo'shishda xatolik",
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
      const regionName = city.regionName || "Noma'lum";
      stats[regionName] = (stats[regionName] || 0) + 1;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="cities-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const regionStats = getRegionStats();

  return (
    <div className={`cities-page ${isDarkTheme ? 'theme-dark' : 'theme-light'}`}>
      <div className="cities-header">
        <div>
          <h1 className="cities-title">Shaharlar Boshqaruvi</h1>
          <p className="cities-subtitle">Barcha shahar va viloyatlarni boshqaring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >
            {isDarkTheme ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Yorug' Mavzu
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Qorong'u Mavzu
              </>
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="btn btn-primary">
                <Plus className="btn-icon" />
                Yangi shahar
              </Button>
            </DialogTrigger>
            <DialogContent className="city-dialog">
              <DialogHeader>
                <DialogTitle className="dialog-title">
                  {editingCity ? "Shaharni tahrirlash" : "Yangi shahar qo'shish"}
                </DialogTitle>
                <DialogDescription className="dialog-description">
                  Shahar ma'lumotlarini kiriting va saqlang.
                </DialogDescription>
              </DialogHeader>
              <div className="dialog-form">
                <div className="form-row">
                  <Label htmlFor="name" className="form-label">
                    Shahar nomi
                  </Label>
                  <Input
                    id="name"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    className="form-input"
                    placeholder="Shahar nomini kiriting"
                  />
                </div>
                <div className="form-row">
                  <Label htmlFor="region" className="form-label">
                    Viloyat
                  </Label>
                  <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                    <SelectTrigger className="form-select">
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
              </div>
              <DialogFooter className="dialog-footer">
                <Button onClick={handleSaveCity} className="btn btn-primary">
                  {editingCity ? "Yangilash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="cities-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami Shaharlar</CardTitle>
            <Building2 className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{cities.length}</div>
            <p className="stat-card-description">
              Barcha ro'yxatga olingan shaharlar
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Viloyatlar</CardTitle>
            <MapPin className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-regions">
              {regions.length}
            </div>
            <p className="stat-card-description">
              Faol viloyatlar soni
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">O'rtacha Shahar</CardTitle>
            <Globe className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-average">
              {regions.length > 0 ? Math.round(cities.length / regions.length * 10) / 10 : 0}
            </div>
            <p className="stat-card-description">
              Har viloyatda o'rtacha
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Eng Ko'p</CardTitle>
            <Building2 className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-max">
              {Math.max(...Object.values(regionStats))}
            </div>
            <p className="stat-card-description">
              Bir viloyatdagi maksimal
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="regions-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Viloyatlar Bo'yicha Taqsimot</CardTitle>
          <CardDescription className="table-card-description">
            Har bir viloyatdagi shaharlar soni
          </CardDescription>
        </CardHeader>
        <CardContent className="regions-content">
          <div className="regions-grid">
            {Object.entries(regionStats).map(([region, count]) => (
              <div key={region} className="region-item">
                <div className="region-info">
                  <MapPin className="region-icon" />
                  <span className="region-name">{region}</span>
                </div>
                <Badge className="region-count">
                  {count} ta shahar
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="cities-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Shaharlar Ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {cities.length} ta shahar mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="cities-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Shahar Nomi</TableHead>
                <TableHead className="table-header-cell">Viloyat</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {cities.map((city, index) => (
                <TableRow key={city.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell">
                    <div className="city-info">
                      <Building2 className="city-icon" />
                      <span className="city-name">{city.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className="region-badge">
                      {city.regionName}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className="status-badge status-active">
                      Faol
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(city)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCity(city.id)}
                        className="action-button action-button-sm action-delete"
                      >
                        <Trash2 className="action-icon" />
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