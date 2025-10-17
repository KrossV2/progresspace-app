import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserPlus, Eye, Users, Mail, Phone, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/admin/DirectorsPage.css";

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
      
      // Mock data for schools
      const schoolsData: School[] = [
        { id: 1, name: "1-umumiy o'rta ta'lim maktabi", address: "Shayxontohur tumani", cityName: "Toshkent shahri" },
        { id: 2, name: "120-maktab", address: "Yunusobod tumani", cityName: "Toshkent shahri" },
        { id: 3, name: "5-umumiy o'rta ta'lim maktabi", address: "Markaz ko'chasi", cityName: "Samarqand shahri" },
        { id: 4, name: "15-maktab", address: "Navoi ko'chasi", cityName: "Buxoro shahri" },
        { id: 5, name: "25-sonli maktab", address: "Yunusobod tumani", cityName: "Toshkent shahri" },
        { id: 6, name: "3-sonli litsey", address: "Mirzo Ulug'bek tumani", cityName: "Toshkent shahri" },
      ];

      const directorsData: Director[] = [
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
          schoolId: 4,
          schoolName: "15-maktab",
          isActive: true,
          phoneNumber: "+998901122334"
        },
        { 
          id: 4, 
          firstName: "Javohir", 
          lastName: "Rasulov", 
          email: "javohir.rasulov@school.uz", 
          isActive: false,
          phoneNumber: "+998903344556"
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
        const newDirector: Director = { 
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

  const getStats = () => {
    const activeDirectors = directors.filter(d => d.isActive).length;
    const assignedDirectors = directors.filter(d => d.schoolId).length;
    const unassignedDirectors = directors.filter(d => !d.schoolId).length;
    
    return {
      total: directors.length,
      active: activeDirectors,
      assigned: assignedDirectors,
      unassigned: unassignedDirectors
    };
  };

  const getSchoolStats = () => {
    const stats: { [key: string]: number } = {};
    directors.forEach(director => {
      if (director.schoolName) {
        stats[director.schoolName] = (stats[director.schoolName] || 0) + 1;
      }
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="directors-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const schoolStats = getSchoolStats();

  return (
    <div className="directors-page">
      <div className="directors-header">
        <div>
          <h1 className="directors-title">Direktorlar Boshqaruvi</h1>
          <p className="directors-subtitle">Barcha maktab direktorlarini boshqaring va tayinlang</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <UserPlus className="btn-icon" />
              Yangi direktor
            </Button>
          </DialogTrigger>
          <DialogContent className="director-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingDirector ? "Direktorni tahrirlash" : "Yangi direktor qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Direktor ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="firstName" className="form-label">
                  Ism *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-input"
                  placeholder="Ismni kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="lastName" className="form-label">
                  Familiya *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-input"
                  placeholder="Familiyani kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="email" className="form-label">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="phoneNumber" className="form-label">
                  Telefon
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="form-input"
                  placeholder="+998901234567"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="school" className="form-label">
                  Maktab
                </Label>
                <Select value={formData.schoolId} onValueChange={(value) => setFormData({ ...formData, schoolId: value })}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Maktabni tanlang (ixtiyoriy)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Maktab tayinlanmagan</SelectItem>
                    {(editingDirector ? schools : availableSchools).map((school) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name} ({school.cityName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveDirector} className="btn btn-primary">
                {editingDirector ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="directors-stats">
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Jami Direktorlar</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value">{stats.total}</div>
            <p className="stat-card-description">
              Barcha ro'yxatga olingan direktorlar
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Faol Direktorlar</CardTitle>
            <UserPlus className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-active">
              {stats.active}
            </div>
            <p className="stat-card-description">
              Faol ishlayotgan direktorlar
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Tayinlangan</CardTitle>
            <Building2 className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-assigned">
              {stats.assigned}
            </div>
            <p className="stat-card-description">
              Maktabga tayinlangan
            </p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="stat-card-header">
            <CardTitle className="stat-card-title">Tayinlanmagan</CardTitle>
            <Users className="stat-card-icon" />
          </CardHeader>
          <CardContent>
            <div className="stat-card-value stat-value-unassigned">
              {stats.unassigned}
            </div>
            <p className="stat-card-description">
              Maktab tayinlanmagan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schools Distribution */}
      {Object.keys(schoolStats).length > 0 && (
        <Card className="schools-card">
          <CardHeader className="table-card-header">
            <CardTitle className="table-card-title">Maktablar Bo'yicha Taqsimot</CardTitle>
            <CardDescription className="table-card-description">
              Har bir maktabdagi direktorlar soni
            </CardDescription>
          </CardHeader>
          <CardContent className="schools-content">
            <div className="schools-grid">
              {Object.entries(schoolStats).map(([school, count]) => (
                <div key={school} className="school-item">
                  <div className="school-info">
                    <Building2 className="school-icon" />
                    <span className="school-name">{school}</span>
                  </div>
                  <Badge className="school-count">
                    {count} ta direktor
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="directors-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Direktorlar Ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {directors.length} ta direktor mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="directors-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Direktor</TableHead>
                <TableHead className="table-header-cell">Aloqa</TableHead>
                <TableHead className="table-header-cell">Maktab</TableHead>
                <TableHead className="table-header-cell">Holat</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {directors.map((director, index) => (
                <TableRow key={director.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell">
                    <div className="director-info">
                      <Users className="director-icon" />
                      <div>
                        <span className="director-name">{director.firstName} {director.lastName}</span>
                        <div className="director-email">
                          <Mail className="email-icon" />
                          <span>{director.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    {director.phoneNumber ? (
                      <div className="phone-info">
                        <Phone className="phone-icon" />
                        <span>{director.phoneNumber}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    {director.schoolName ? (
                      <div className="school-assignment">
                        <Building2 className="school-assignment-icon" />
                        <div>
                          <span className="school-name">{director.schoolName}</span>
                          <div className="school-status assigned">Tayinlangan</div>
                        </div>
                      </div>
                    ) : (
                      <div className="school-assignment unassigned">
                        <Building2 className="school-assignment-icon" />
                        <div>
                          <span className="school-name">Maktab tayinlanmagan</span>
                          <div className="school-status unassigned">Kutilyapti</div>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="table-cell">
                    <Badge className={`status-badge status-${director.isActive ? 'active' : 'inactive'}`}>
                      {director.isActive ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Navigate to director details */}}
                        className="action-button action-button-sm action-view"
                      >
                        <Eye className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(director)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDirector(director.id)}
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

export default DirectorsPage;