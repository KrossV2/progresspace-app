import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";
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

const CitiesPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [newCityName, setNewCityName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // TODO: Replace with actual API URL
  const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // const [citiesResponse, regionsResponse] = await Promise.all([
      //   fetch(`${API_BASE_URL}/api/admin/cities`),
      //   fetch(`${API_BASE_URL}/api/admin/regions`)
      // ]);
      // const citiesData = await citiesResponse.json();
      // const regionsData = await regionsResponse.json();
      
      // Mock data for now
      const regionsData = [
        { id: 1, name: "Toshkent" },
        { id: 2, name: "Samarqand" },
        { id: 3, name: "Buxoro" },
        { id: 4, name: "Andijon" },
      ];

      const citiesData = [
        { id: 1, name: "Toshkent shahri", regionId: 1, regionName: "Toshkent" },
        { id: 2, name: "Olmaliq", regionId: 1, regionName: "Toshkent" },
        { id: 3, name: "Samarqand shahri", regionId: 2, regionName: "Samarqand" },
        { id: 4, name: "Buxoro shahri", regionId: 3, regionName: "Buxoro" },
        { id: 5, name: "Andijon shahri", regionId: 4, regionName: "Andijon" },
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/admin/cities/${id}`, {
      //   method: 'DELETE',
      // });
      
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/admin/cities/${editingCity.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name: newCityName, regionId: parseInt(selectedRegionId) }),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/admin/cities`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name: newCityName, regionId: parseInt(selectedRegionId) }),
        // });
        // const newCity = await response.json();
        
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
          <h1 className="text-3xl font-bold">Shaharlar</h1>
          <p className="text-muted-foreground">Barcha shaharlarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Yangi shahar qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Shaharni tahrirlash" : "Yangi shahar qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Shahar ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nomi
                </Label>
                <Input
                  id="name"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="col-span-3"
                  placeholder="Shahar nomini kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  Viloyat
                </Label>
                <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                  <SelectTrigger className="col-span-3">
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
            <DialogFooter>
              <Button onClick={handleSaveCity}>
                {editingCity ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shaharlar ro'yxati</CardTitle>
          <CardDescription>
            Jami {cities.length} ta shahar mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Shahar nomi</TableHead>
                <TableHead>Viloyat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city, index) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.regionName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCity(city.id)}
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