import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, BookOpen, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import "@/styles/admin/SubjectPage.css";

interface Subject {
  id: number;
  name: string;
  description?: string;
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      // Mock data
      setSubjects([
        { id: 1, name: "Matematika", description: "Algebra, geometriya va analiz" },
        { id: 2, name: "Ona tili", description: "O'zbek tili va adabiyoti" },
        { id: 3, name: "Ingliz tili", description: "Chet tili darsi" },
        { id: 4, name: "Fizika", description: "Tabiiy fanlar" },
        { id: 5, name: "Kimyo", description: "Tabiiy fanlar" },
        { id: 6, name: "Biologiya", description: "Tirik tabiat haqida fan" },
        { id: 7, name: "Tarix", description: "O'zbekiston va jahon tarixi" },
        { id: 8, name: "Geografiya", description: "Yer sharining o'rganilishi" },
        { id: 9, name: "Informatika", description: "Kompyuter savodxonligi" },
        { id: 10, name: "Jismoniy tarbiya", description: "Sport va sog'lom turmush tarzi" },
      ]);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fanlar ro'yxatini yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Haqiqatan ham bu fanni o'chirmoqchimisiz?")) return;

    try {
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast({
        title: "Muvaffaqiyat",
        description: "Fan muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Fanni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const handleSaveSubject = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Xatolik",
        description: "Fan nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubject) {
        setSubjects(subjects.map(subject => 
          subject.id === editingSubject.id 
            ? { 
                ...subject, 
                name: formData.name, 
                description: formData.description
              }
            : subject
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Fan muvaffaqiyatli yangilandi",
        });
      } else {
        const newSubject = { 
          id: Date.now(), 
          name: formData.name,
          description: formData.description
        };
        setSubjects([...subjects, newSubject]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi fan muvaffaqiyatli qo'shildi",
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Xatolik",
        description: editingSubject ? "Fanni yangilashda xatolik" : "Fan qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingSubject(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="subjects-loading">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subjects-page">
      <div className="subjects-header">
        <div>
          <h1 className="subjects-title">Fanlar Boshqaruvi</h1>
          <p className="subjects-subtitle">Barcha o'quv fanlarini boshqaring va tahrirlang</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="btn btn-primary">
              <Plus className="btn-icon" />
              Yangi fan
            </Button>
          </DialogTrigger>
          <DialogContent className="subject-dialog">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                {editingSubject ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Fan ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <div className="form-row">
                <Label htmlFor="name" className="form-label">
                  Nomi *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Fan nomini kiriting"
                />
              </div>
              
              <div className="form-row">
                <Label htmlFor="description" className="form-label">
                  Tavsif
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Fan tavsifini kiriting (ixtiyoriy)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="dialog-footer">
              <Button onClick={handleSaveSubject} className="btn btn-primary">
                {editingSubject ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="subjects-table-card">
        <CardHeader className="table-card-header">
          <CardTitle className="table-card-title">Fanlar Ro'yxati</CardTitle>
          <CardDescription className="table-card-description">
            Jami {subjects.length} ta fan mavjud
          </CardDescription>
        </CardHeader>
        <CardContent className="table-card-content">
          <Table className="subjects-table">
            <TableHeader className="table-header">
              <TableRow className="table-header-row">
                <TableHead className="table-header-cell">#</TableHead>
                <TableHead className="table-header-cell">Fan</TableHead>
                <TableHead className="table-header-cell">Tavsif</TableHead>
                <TableHead className="table-header-cell text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="table-body">
              {subjects.map((subject, index) => (
                <TableRow key={subject.id} className="table-row">
                  <TableCell className="table-cell font-medium">{index + 1}</TableCell>
                  <TableCell className="table-cell">
                    <div className="subject-info">
                      <BookOpen className="subject-icon" />
                      <div>
                        <span className="subject-name">{subject.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="subject-description">
                      {subject.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell text-right">
                    <div className="actions-container">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                        className="action-button action-button-sm action-edit"
                      >
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
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

export default SubjectsPage;