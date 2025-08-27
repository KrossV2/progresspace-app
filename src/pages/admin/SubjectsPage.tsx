import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // TODO: Replace with actual API URL
  const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // const response = await fetch(`${API_BASE_URL}/api/admin/subjects`);
      // const data = await response.json();
      // setSubjects(data);
      
      // Mock data for now
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
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/admin/subjects/${id}`, {
      //   method: 'DELETE',
      // });
      
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
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/admin/subjects/${editingSubject.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     description: formData.description
        //   }),
        // });
        
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
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/admin/subjects`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     description: formData.description
        //   }),
        // });
        // const newSubject = await response.json();
        
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
          <h1 className="text-3xl font-bold">Fanlar</h1>
          <p className="text-muted-foreground">Barcha o'quv fanlarini boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Yangi fan qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Fan ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nomi
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Fan nomini kiriting"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Tavsif
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Fan tavsifini kiriting (ixtiyoriy)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveSubject}>
                {editingSubject ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fanlar ro'yxati</CardTitle>
          <CardDescription>
            Jami {subjects.length} ta fan mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Fan nomi</TableHead>
                <TableHead>Tavsif</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
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

export default SubjectsPage;