import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus, BookOpen, Users, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  className: string;
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

  const classes = [
    { id: "1", name: "10-A" },
    { id: "2", name: "9-B" },
    { id: "3", name: "11-A" },
    { id: "4", name: "8-A" }
  ];

  const subjects = [
    { id: "1", name: "Matematika" },
    { id: "2", name: "Fizika" },
    { id: "3", name: "Ona tili" },
    { id: "4", name: "Ingliz tili" }
  ];

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchGrades();
    }
  }, [selectedClass, selectedSubject]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setStudents([
          {
            id: 1,
            firstName: "Aziz",
            lastName: "Karimov",
            className: "10-A",
            grades: [
              { id: 1, value: 4, type: 'daily', date: "2024-01-15", subjectName: "Matematika" },
              { id: 2, value: 5, type: 'test', date: "2024-01-10", subjectName: "Matematika" },
              { id: 3, value: 4, type: 'daily', date: "2024-01-08", subjectName: "Matematika" }
            ]
          },
          {
            id: 2,
            firstName: "Malika",
            lastName: "Tosheva",
            className: "10-A",
            grades: [
              { id: 4, value: 3, type: 'daily', date: "2024-01-15", subjectName: "Matematika" },
              { id: 5, value: 4, type: 'test', date: "2024-01-12", subjectName: "Matematika" }
            ]
          },
          {
            id: 3,
            firstName: "Javohir",
            lastName: "Rahimov",
            className: "10-A",
            grades: [
              { id: 6, value: 5, type: 'daily', date: "2024-01-14", subjectName: "Matematika" },
              { id: 7, value: 5, type: 'daily', date: "2024-01-11", subjectName: "Matematika" }
            ]
          },
          {
            id: 4,
            firstName: "Dilbar",
            lastName: "Xolmirzayeva",
            className: "10-A",
            grades: [
              { id: 8, value: 4, type: 'test', date: "2024-01-09", subjectName: "Matematika" }
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Baholar ro'yxatini yuklashda xatolik",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleGradeUpdate = async (studentId: number, newGrade: number) => {
    if (!newGrade || newGrade < 1 || newGrade > 5) {
      toast({
        title: "Xatolik",
        description: "Baho 1 dan 5 gacha bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    try {
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? {
              ...student,
              grades: [
                ...student.grades,
                {
                  id: Date.now(),
                  value: newGrade,
                  type: 'daily',
                  date: new Date().toISOString().split('T')[0],
                  subjectName: subjects.find(s => s.id === selectedSubject)?.name || "Matematika"
                }
              ]
            }
          : student
      ));

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

  const getAverageGrade = (grades: Grade[]): string => {
    if (grades.length === 0) return "0.0";
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return (sum / grades.length).toFixed(1);
  };

  const getBestAverageGrade = (): string => {
    if (!selectedClass || !selectedSubject || students.length === 0) {
      return "0.0";
    }
    
    const averages = students
      .map(student => parseFloat(getAverageGrade(student.grades)))
      .filter(avg => !isNaN(avg));
    
    if (averages.length === 0) return "0.0";
    
    return Math.max(...averages).toFixed(1);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "text-green-600 bg-green-100";
    if (grade >= 3.5) return "text-blue-600 bg-blue-100";
    if (grade >= 3) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getBadgeColor = (grade: number) => {
    if (grade === 5) return "bg-green-100 text-green-800 border-green-200";
    if (grade === 4) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade === 3) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getTotalGrades = (): number => {
    return students.reduce((acc, student) => acc + student.grades.length, 0);
  };

  const getOverallAverage = (): string => {
    if (students.length === 0) return "0.0";
    const allGrades = students.flatMap(student => student.grades);
    if (allGrades.length === 0) return "0.0";
    const sum = allGrades.reduce((acc, grade) => acc + grade.value, 0);
    return (sum / allGrades.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Baholash Tizimi
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              O'quvchilar baholarini boshqaring va kuzatib boring
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami O'quvchilar</p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedClass && selectedSubject ? students.length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">O'rtacha Baho</p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedClass && selectedSubject ? getOverallAverage() : "0.0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Jami Baholar</p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedClass && selectedSubject ? getTotalGrades() : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Eng Yaxshi</p>
                <p className="text-2xl font-bold text-slate-900">
                  {getBestAverageGrade()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Filtrlash</CardTitle>
          <CardDescription>
            Sinf va fan bo'yicha baholarni ko'rish uchun filtrlarni tanlang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sinfni tanlang</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sinfni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fanni tanlang</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Fanni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => {
            const averageGrade = parseFloat(getAverageGrade(student.grades));
            
            return (
              <Card 
                key={student.id} 
                className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {student.className} • {student.grades.length} ta baho
                      </CardDescription>
                    </div>
                    {averageGrade > 0 && (
                      <Badge className={`${getGradeColor(averageGrade)} font-semibold`}>
                        <Star className="h-3 w-3 mr-1" />
                        {averageGrade}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Recent Grades */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">So'nggi baholar:</span>
                      <span className="text-xs text-slate-500">
                        {student.grades.length > 0 
                          ? new Date(student.grades[student.grades.length - 1].date).toLocaleDateString('uz-UZ')
                          : 'Baho yo\'q'
                        }
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {student.grades.slice(-6).map((grade) => (
                        <Badge 
                          key={grade.id} 
                          variant="outline"
                          className={getBadgeColor(grade.value)}
                        >
                          {grade.value}
                        </Badge>
                      ))}
                      {student.grades.length === 0 && (
                        <span className="text-sm text-slate-500">Hali baho qo'shilmagan</span>
                      )}
                    </div>
                  </div>

                  {/* Add Grade Section */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">Yangi baho:</span>
                    </div>
                    <div className="flex gap-2">
                      {editingGrade?.studentId === student.id ? (
                        <>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={editingGrade.value}
                            onChange={(e) => setEditingGrade({...editingGrade, value: e.target.value})}
                            className="w-20"
                            placeholder="1-5"
                            autoFocus
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleGradeUpdate(student.id, parseInt(editingGrade.value))}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingGrade(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            placeholder="1-5"
                            className="w-20"
                            onFocus={() => setEditingGrade({studentId: student.id, value: ""})}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingGrade({studentId: student.id, value: ""})}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Grade Summary */}
                  {student.grades.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">O'rtacha baho:</span>
                        <span className={`font-semibold ${getGradeColor(averageGrade).split(' ')[0]}`}>
                          {averageGrade}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-slate-600">Baho turlari:</span>
                        <div className="flex gap-1">
                          {['daily', 'test', 'quarter', 'annual'].map(type => {
                            const count = student.grades.filter(g => g.type === type).length;
                            return count > 0 ? (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type === 'daily' ? 'D' : type === 'test' ? 'T' : type === 'quarter' ? 'Ch' : 'Y'}: {count}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {(!selectedClass || !selectedSubject) && (
        <Card className="text-center py-12 border-dashed border-2 border-slate-200 bg-transparent">
          <CardContent>
            <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Baholarni ko'rish uchun filtrlarni tanlang
            </h3>
            <p className="text-slate-600">
              Sinf va fan ni tanlang, shundan so'ng o'quvchilar baholari ko'rinadi
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradesPage;