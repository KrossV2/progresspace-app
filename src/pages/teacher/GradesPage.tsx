import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grades: Grade[];
}

interface Grade {
  id: number;
  value: number;
  type: 'daily' | 'test' | 'quarter' | 'annual';
  date: string;
  subjectName: string;
}

const GradesPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [editingGrade, setEditingGrade] = useState<{studentId: number, value: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // TODO: Replace with actual API URL
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchGrades();
    }
  }, [selectedClass, selectedSubject]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      // TODO: GET /api/teacher/grades/classes/{classId}?subjectId={subjectId}
      
      // Mock data
      setStudents([
        {
          id: 1,
          firstName: "Aziz",
          lastName: "Karimov",
          grades: [
            { id: 1, value: 4, type: 'daily', date: "2024-01-15", subjectName: "Matematika" },
            { id: 2, value: 5, type: 'test', date: "2024-01-10", subjectName: "Matematika" }
          ]
        },
        {
          id: 2,
          firstName: "Malika",
          lastName: "Tosheva",
          grades: [
            { id: 3, value: 3, type: 'daily', date: "2024-01-15", subjectName: "Matematika" }
          ]
        }
      ]);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Baholar ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGradeUpdate = async (studentId: number, newGrade: number) => {
    try {
      // TODO: POST /api/teacher/grades
      toast({
        title: "Muvaffaqiyat",
        description: "Baho muvaffaqiyatli qo'shildi",
      });
      setEditingGrade(null);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Bahoni qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Baholar</h1>
        <p className="text-muted-foreground">O'quvchilar baholarini boshqaring</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sinfni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">10-A</SelectItem>
                <SelectItem value="2">9-B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Fanni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Matematika</SelectItem>
                <SelectItem value="2">Fizika</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>Baholar jadvali</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>So'nggi baholar</TableHead>
                  <TableHead>Yangi baho</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {student.grades.slice(-5).map((grade) => (
                          <Badge key={grade.id} variant="outline">
                            {grade.value}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingGrade?.studentId === student.id ? (
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={editingGrade.value}
                          onChange={(e) => setEditingGrade({...editingGrade, value: e.target.value})}
                          className="w-20"
                        />
                      ) : (
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="Baho"
                          className="w-20"
                          onFocus={() => setEditingGrade({studentId: student.id, value: ""})}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingGrade?.studentId === student.id ? (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleGradeUpdate(student.id, parseInt(editingGrade.value))}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingGrade(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradesPage;