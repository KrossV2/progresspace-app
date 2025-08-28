import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

interface Homework {
  id: number;
  title: string;
  description: string;
  subjectName: string;
  className: string;
  dueDate: string;
  materialPath?: string;
  submissionsCount: number;
  totalStudents: number;
}

const HomeworksPage = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    classId: "",
    dueDate: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // API_BASE_URL import qilingan: urlni almashtirish uchun `src/config/api.ts` faylini oching

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      // TODO: GET /api/teacher/homeworks
      
      // Mock data
      setHomeworks([
        {
          id: 1,
          title: "Algebraik ifodalar",
          description: "17-18 betdagi masalalarni yeching",
          subjectName: "Matematika",
          className: "10-A",
          dueDate: "2024-01-20",
          submissionsCount: 25,
          totalStudents: 30
        },
        {
          id: 2,
          title: "Inshو yozing",
          description: "Qish mavzusida insha yozing",
          subjectName: "Ona tili",
          className: "9-B",
          dueDate: "2024-01-22",
          submissionsCount: 18,
          totalStudents: 28
        }
      ]);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Uy vazifalari ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Uy vazifalari</h1>
          <p className="text-muted-foreground">O'quvchilar uchun uy vazifalarini boshqaring</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yangi vazifa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uy vazifalari ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vazifa nomi</TableHead>
                <TableHead>Fan</TableHead>
                <TableHead>Sinf</TableHead>
                <TableHead>Muddat</TableHead>
                <TableHead>Topshirganlar</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworks.map((homework) => (
                <TableRow key={homework.id}>
                  <TableCell className="font-medium">{homework.title}</TableCell>
                  <TableCell>{homework.subjectName}</TableCell>
                  <TableCell>{homework.className}</TableCell>
                  <TableCell>{homework.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {homework.submissionsCount}/{homework.totalStudents}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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

export default HomeworksPage;