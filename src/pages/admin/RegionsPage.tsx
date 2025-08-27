import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Region {
  id: number;
  name: string;
}

const RegionsPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [newRegionName, setNewRegionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // TODO: Replace with actual API URL
  const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // const response = await fetch(`${API_BASE_URL}/api/admin/regions`);
      // const data = await response.json();
      // setRegions(data);
      
      // Mock data for now
      setRegions([
        { id: 1, name: "Toshkent" },
        { id: 2, name: "Samarqand" },
        { id: 3, name: "Buxoro" },
        { id: 4, name: "Andijon" },
      ]);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Viloyatlar ro'yxatini yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegion = async (id: number) => {
    if (!confirm("Haqiqatan ham bu viloyatni o'chirmoqchimisiz?")) return;

    try {
      // TODO: Implement actual API call
      // await fetch(`${API_BASE_URL}/api/admin/regions/${id}`, {
      //   method: 'DELETE',
      // });
      
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
    if (!newRegionName.trim()) {
      toast({
        title: "Xatolik",
        description: "Viloyat nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRegion) {
        // TODO: Implement actual API call for update
        // await fetch(`${API_BASE_URL}/api/admin/regions/${editingRegion.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name: newRegionName }),
        // });
        
        setRegions(regions.map(region => 
          region.id === editingRegion.id 
            ? { ...region, name: newRegionName }
            : region
        ));
        toast({
          title: "Muvaffaqiyat",
          description: "Viloyat muvaffaqiyatli yangilandi",
        });
      } else {
        // TODO: Implement actual API call for create
        // const response = await fetch(`${API_BASE_URL}/api/admin/regions`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name: newRegionName }),
        // });
        // const newRegion = await response.json();
        
        const newRegion = { id: Date.now(), name: newRegionName };
        setRegions([...regions, newRegion]);
        toast({
          title: "Muvaffaqiyat",
          description: "Yangi viloyat muvaffaqiyatli qo'shildi",
        });
      }

      setNewRegionName("");
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
    setNewRegionName(region.name);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingRegion(null);
    setNewRegionName("");
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
          <h1 className="text-3xl font-bold">Viloyatlar</h1>
          <p className="text-muted-foreground">Barcha viloyatlarni boshqaring</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Yangi viloyat qo'shish</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingRegion ? "Viloyatni tahrirlash" : "Yangi viloyat qo'shish"}
              </DialogTitle>
              <DialogDescription>
                Viloyat ma'lumotlarini kiriting va saqlang.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nomi
                </Label>
                <Input
                  id="name"
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  className="col-span-3"
                  placeholder="Viloyat nomini kiriting"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveRegion}>
                {editingRegion ? "Yangilash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Viloyatlar ro'yxati</CardTitle>
          <CardDescription>
            Jami {regions.length} ta viloyat mavjud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Viloyat nomi</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region, index) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{region.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(region)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRegion(region.id)}
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