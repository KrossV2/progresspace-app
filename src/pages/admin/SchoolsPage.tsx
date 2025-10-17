import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, School, MapPin, Users, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/admin/SchoolsPage.css";

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

  if (loading) {
    return (
      <div className="schools-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const regionStats = getRegionStats();
  const activeSchools = schools.filter(s => s.status === 'active').length;
  const inactiveSchools = schools.filter(s => s.status === 'inactive').length;

  return (
    <div className="schools-page">
      <div className="schools-header">
        <div>
          <h1 className="schools-title">Maktablar Boshqaruvi</h1>
          <p className="schools-subtitle">Barcha maktablarni boshqaring va monitoring qiling</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <Plus className="btn-icon" />
              Yangi maktab
            </Button>
          </DialogTrigger>
          <DialogContent className="school-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingSchool ? "Maktabni tahrirlash" : "Yangi maktab qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Maktab ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="name" className="form-label">
                  Maktab nomi *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Maktab nomini kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="address" className="form-label">
                  Manzil *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="form-input"
                  placeholder="Maktab manzilini kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="region" className="form-label">
                  Viloyat *
                </Label>
                <Select value={formData.regionId} onValueChange={handleRegionChange}>
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
              
              <div className="form-row">
                <Label htmlFor="city" className="form-label">
                  Shahar *
                </Label>
                <Select 
                  value={formData.cityId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cityId: value }))}
                  disabled={!formData.regionId}
                >
                  <SelectTrigger className="form-select">
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
              
              <div className="form-row">
                <Label htmlFor="director" className="form-label">
                  Direktor
                </Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
                  className="form-input"
                  placeholder="Direktor F.I.SH"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="phone" className="form-label">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="form-input"
                  placeholder="+998901234567"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="email" className="form-label">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                  placeholder="maktab@edu.uz"
                />
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveSchool} className="btn btn-primary">
                {editingSchool ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="schools-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami Maktablar</CardTitle>
            <School className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{schools.length}</div>
            <p className="stat-card-description">
              Barcha ro'yxatga olingan maktablar
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Faol Maktablar</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-active">
              {activeSchools}
            </div>
            <p className="stat-card-description">
              Faol ishlayotgan maktablar
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Nofaol Maktablar</CardTitle>
            <School className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-inactive">
              {inactiveSchools}
            </div>
            <p className="stat-card-description">
              Faoliyati to'xtatilgan
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
              {new Set(schools.map(s => s.regionId)).size}
            </div>
            <p className="stat-card-description">
              Maktablar joylashgan viloyatlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Regions Distribution */}
      <Card className="regions-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Viloyatlar Bo'yicha Taqsimot</CardTitle>
          <CardDescription className="table-card-description">
            Har bir viloyatdagi maktablar soni
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
                  {count} ta maktab
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="schools-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Maktablar Ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {schools.length} ta maktab mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="schools-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Maktab Nomi</TableHead>
                <TableHead className="table-header-cell">Manzil</TableHead>
                <TableHead className="table-header-cell">Viloyat/Shahar</TableHead>
                <TableHead className="table-header-cell">Direktor</TableHead>
                <TableHead className="table-header-cell">Aloqa</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {schools.map((school, index) => (
                <TableRow key={school.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell">
                    <div className="school-info">
                      <School className="school-icon" />
                      <div>
                        <span className="school-name">{school.name}</span>
                        <div className="school-contacts">
                          {school.email && (
                            <div className="contact-item">
                              <Mail className="contact-icon" />
                              <span>{school.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="address-info">
                      <MapPin className="address-icon" />
                      <span>{school.address}</span>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="location-info">
                      <Badge className="region-badge">
                        {school.regionName}
                      </Badge>
                      <Badge variant="outline" className="city-badge">
                        {school.cityName}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <span className="director-name">{school.director}</span>
                  </TableCell>
                  <TableCell className="table-cell">
                    {school.phone && (
                      <div className="phone-info">
                        <Phone className="phone-icon" />
                        <span>{school.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge status-${school.status}`}>
                      {school.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(school)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchool(school.id)}
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

export default SchoolsPage;