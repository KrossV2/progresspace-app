import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, FileText, Image, Trash2, Eye, Download, BookOpen, Users, Award, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'document' | 'image' | 'presentation';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  subjectName: string;
  className: string;
  downloads: number;
}

interface Homework {
  id: number;
  title: string;
  subjectName: string;
  dueDate: string;
  status: "pending" | "submitted" | "late" | "graded";
  description: string;
  teacher: string;
  points?: number;
  maxPoints: number;
  submissionDate?: string;
  attachments?: string[];
  className: string;
  assignedDate: string;
}

const FilesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    type: "document" as 'video' | 'document' | 'image' | 'presentation',
    file: null as File | null
  });
  const [homeworkForm, setHomeworkForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 10,
    attachments: [] as string[]
  });
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
    { id: "4", name: "Ingliz tili" },
    { id: "5", name: "Biologiya" },
    { id: "6", name: "Kimyo" }
  ];

  useEffect(() => {
    loadHomeworksFromStorage();
    if (selectedClass && selectedSubject) {
      fetchResources();
    }
  }, [selectedClass, selectedSubject]);

  const loadHomeworksFromStorage = () => {
    const savedHomeworks = localStorage.getItem('teacher-homeworks');
    if (savedHomeworks) {
      setHomeworks(JSON.parse(savedHomeworks));
    }
  };

  const saveHomeworksToStorage = (updatedHomeworks: Homework[]) => {
    localStorage.setItem('teacher-homeworks', JSON.stringify(updatedHomeworks));
    setHomeworks(updatedHomeworks);
  };

  const fetchResources = async () => {
    try {
      setTimeout(() => {
        setResources([
          {
            id: 1,
            title: "Algebra asoslari",
            description: "Algebraik ifodalar va ular ustida amallar",
            type: 'document',
            fileName: "algebra_asoslari.pdf",
            fileSize: "2.4 MB",
            uploadDate: "2024-01-15",
            subjectName: "Matematika",
            className: "10-A",
            downloads: 24
          },
          {
            id: 2,
            title: "Mexanika darsligi",
            description: "Mexanikaning asosiy qonunlari va formulalar",
            type: 'video',
            fileName: "mexanika_darsi.mp4",
            fileSize: "156 MB",
            uploadDate: "2024-01-14",
            subjectName: "Fizika",
            className: "10-A",
            downloads: 18
          },
          {
            id: 3,
            title: "Hujayra biologiyasi",
            description: "Hujayra tuzilishi va funksiyalari",
            type: 'presentation',
            fileName: "hujayra_biologiyasi.pptx",
            fileSize: "8.7 MB",
            uploadDate: "2024-01-13",
            subjectName: "Biologiya",
            className: "10-A",
            downloads: 32
          }
        ]);
      }, 1000);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Resurslarni yuklashda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.file || !selectedClass || !selectedSubject) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newResource: Resource = {
        id: Date.now(),
        title: uploadForm.title,
        description: uploadForm.description,
        type: uploadForm.type,
        fileName: uploadForm.file.name,
        fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        subjectName: subjects.find(s => s.id === selectedSubject)?.name || "",
        className: classes.find(c => c.id === selectedClass)?.name || "",
        downloads: 0
      };

      setResources(prev => [newResource, ...prev]);
      setUploadForm({ title: "", description: "", type: "document", file: null });

      toast({
        title: "Muvaffaqiyat",
        description: "Fayl muvaffaqiyatli yuklandi",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Faylni yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homeworkForm.title || !homeworkForm.dueDate || !selectedClass || !selectedSubject) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    const newHomework: Homework = {
      id: Date.now(),
      title: homeworkForm.title,
      description: homeworkForm.description,
      dueDate: homeworkForm.dueDate,
      status: "pending",
      teacher: "Aliyeva Malika",
      maxPoints: homeworkForm.maxPoints,
      subjectName: subjects.find(s => s.id === selectedSubject)?.name || "",
      className: classes.find(c => c.id === selectedClass)?.name || "",
      assignedDate: new Date().toISOString().split('T')[0],
      attachments: homeworkForm.attachments
    };

    const updatedHomeworks = [...homeworks, newHomework];
    saveHomeworksToStorage(updatedHomeworks);

    setHomeworkForm({
      title: "",
      description: "",
      dueDate: "",
      maxPoints: 10,
      attachments: []
    });

    toast({
      title: "Muvaffaqiyat",
      description: "Uy vazifasi muvaffaqiyatli qo'shildi",
    });
  };

  const deleteHomework = (id: number) => {
    const updatedHomeworks = homeworks.filter(homework => homework.id !== id);
    saveHomeworksToStorage(updatedHomeworks);
    toast({
      title: "Muvaffaqiyat",
      description: "Uy vazifasi o'chirildi",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'presentation': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return "bg-gradient-to-r from-red-100 to-red-200 text-red-800";
      case 'document': return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
      case 'image': return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
      case 'presentation': return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
    }
  };

  const totalResources = resources.length;
  const totalHomeworks = homeworks.filter(h => 
    h.className === classes.find(c => c.id === selectedClass)?.name && 
    h.subjectName === subjects.find(s => s.id === selectedSubject)?.name
  ).length;
  const totalDownloads = resources.reduce((sum, resource) => sum + resource.downloads, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              O'quv Resurslari
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              O'quv materiallari va uy vazifalarini boshqaring
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Resurslar
            </CardTitle>
            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalResources}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Yuklangan materiallar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Uy Vazifalari
            </CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {totalHomeworks}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Berilgan vazifalar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Yuklab Olishlar
            </CardTitle>
            <Download className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {totalDownloads}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Materiallar yuklab olishlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Filtrlash
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sinf va fan bo'yicha resurslarni ko'rish
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Sinfni tanlang</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
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
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Fanni tanlang</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
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

      {/* Add Homework Section */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Yangi Uy Vazifasi Qo'shish
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            O'quvchilar uchun yangi uy vazifasini yarating
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleHomeworkSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Vazifa nomi *
                </Label>
                <Input
                  id="title"
                  value={homeworkForm.title}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Vazifa nomini kiriting"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Muddat *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={homeworkForm.dueDate}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tavsif
              </Label>
              <Textarea
                id="description"
                value={homeworkForm.description}
                onChange={(e) => setHomeworkForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Vazifa haqida batafsil ma'lumot"
                rows={3}
                className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxPoints" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Maksimal ball
                </Label>
                <Input
                  id="maxPoints"
                  type="number"
                  value={homeworkForm.maxPoints}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, maxPoints: parseInt(e.target.value) || 10 }))}
                  min="1"
                  max="100"
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                disabled={!selectedClass || !selectedSubject}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vazifa Qo'shish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Homework List */}
      {selectedClass && selectedSubject && homeworks.filter(h => h.className === classes.find(c => c.id === selectedClass)?.name && h.subjectName === subjects.find(s => s.id === selectedSubject)?.name).length > 0 && (
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Qo'shilgan Uy Vazifalari
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Siz tomoningizdan qo'shilgan barcha uy vazifalari
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Vazifa Nomi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Tavsif</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Muddat</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Ball</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeworks
                  .filter(h => h.className === classes.find(c => c.id === selectedClass)?.name && h.subjectName === subjects.find(s => s.id === selectedSubject)?.name)
                  .map((homework, index) => (
                    <TableRow key={homework.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{homework.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{homework.description}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                          {homework.dueDate}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-none font-semibold">
                          {homework.maxPoints} ball
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteHomework(homework.id)}
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* File Upload Section */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Yangi Resurs Qo'shish
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            O'quv materiallarini yuklang va o'quvchilar bilan ulashing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Resurs turi
                  </Label>
                  <Select 
                    value={uploadForm.type} 
                    onValueChange={(value: 'video' | 'document' | 'image' | 'presentation') => 
                      setUploadForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500">
                      <SelectValue placeholder="Resurs turini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Hujjat</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Rasm</SelectItem>
                      <SelectItem value="presentation">Prezentatsiya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sarlavha *
                  </Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resurs sarlavhasini kiriting"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tavsif
                  </Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Resurs haqida qisqacha tavsif"
                    rows={3}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Fayl tanlash *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {uploadForm.file ? uploadForm.file.name : "Faylni tanlang yoki bu yerga tashlang"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PDF, MP4, JPG, PPTX fayllar qabul qilinadi
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isUploading || !uploadForm.file}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Yuklash
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      {selectedClass && selectedSubject && resources.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Mavjud Resurslar
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
              Jami {resources.length} ta resurs mavjud
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <TableRow className="border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">#</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Resurs Nomi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Turi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Fayl</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Hajmi</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">Yuklab Olishlar</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource, index) => (
                  <TableRow 
                    key={resource.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 block">{resource.title}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{resource.description}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`font-semibold px-3 py-1 rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type === 'document' && 'Hujjat'}
                        {resource.type === 'video' && 'Video'}
                        {resource.type === 'image' && 'Rasm'}
                        {resource.type === 'presentation' && 'Prezentatsiya'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-600 dark:text-gray-400">{resource.fileName}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-600 dark:text-gray-400">{resource.fileSize}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold">
                        {resource.downloads} marta
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 h-10 w-10 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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

// Add missing Label component
const Label = ({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium mb-2 block ${className}`}>
    {children}
  </label>
);

export default FilesPage;