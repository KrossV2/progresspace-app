import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, FileText, Image, Trash2, Eye, Download, BookOpen, Users, Award } from "lucide-react";
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
      teacher: "Aliyeva Malika", // Текущий учитель
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
      case 'video': return "bg-red-100 text-red-800 border-red-200";
      case 'document': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'image': return "bg-green-100 text-green-800 border-green-200";
      case 'presentation': return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              O'quv Resurslari
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              O'quv materiallari va uy vazifalarini boshqaring
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Filtrlash</CardTitle>
          <CardDescription>
            Sinf va fan bo'yicha resurslarni ko'rish
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

      {/* Add Homework Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Yangi Uy Vazifasi Qo'shish
          </CardTitle>
          <CardDescription>
            O'quvchilar uchun yangi uy vazifasini yarating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHomeworkSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Vazifa nomi</label>
                <Input
                  value={homeworkForm.title}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Vazifa nomini kiriting"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Muddat</label>
                <Input
                  type="date"
                  value={homeworkForm.dueDate}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tavsif</label>
              <Textarea
                value={homeworkForm.description}
                onChange={(e) => setHomeworkForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Vazifa haqida batafsil ma'lumot"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Maksimal ball</label>
                <Input
                  type="number"
                  value={homeworkForm.maxPoints}
                  onChange={(e) => setHomeworkForm(prev => ({ ...prev, maxPoints: parseInt(e.target.value) || 10 }))}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
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
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Qo'shilgan Uy Vazifalari
            </CardTitle>
            <CardDescription>
              Siz tomoningizdan qo'shilgan barcha uy vazifalari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homeworks
                .filter(h => h.className === classes.find(c => c.id === selectedClass)?.name && h.subjectName === subjects.find(s => s.id === selectedSubject)?.name)
                .map((homework) => (
                  <Card key={homework.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{homework.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{homework.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Muddat: {homework.dueDate}</span>
                            <span>Ball: {homework.maxPoints}</span>
                            <span>Qo'shilgan: {homework.assignedDate}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteHomework(homework.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Yangi Resurs Qo'shish</CardTitle>
          <CardDescription>
            O'quv materiallarini yuklang va o'quvchilar bilan ulashing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resurs turi</label>
                  <Select 
                    value={uploadForm.type} 
                    onValueChange={(value: 'video' | 'document' | 'image' | 'presentation') => 
                      setUploadForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Sarlavha</label>
                  <Input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Resurs sarlavhasini kiriting"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tavsif</label>
                  <Textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Resurs haqida qisqacha tavsif"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Fayl tanlash</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {uploadForm.file ? uploadForm.file.name : "Faylni tanlang yoki bu yerga tashlang"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
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
                className="bg-blue-600 hover:bg-blue-700"
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Mavjud Resurslar</h2>
            <Badge variant="outline" className="text-sm">
              {resources.length} ta resurs
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card 
                key={resource.id} 
                className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-1">
                        {resource.description}
                      </CardDescription>
                    </div>
                    <Badge className={getTypeColor(resource.type)}>
                      {getTypeIcon(resource.type)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Fayl nomi:</span>
                      <span className="font-medium text-slate-900">{resource.fileName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Hajmi:</span>
                      <span className="font-medium text-slate-900">{resource.fileSize}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Yuklangan:</span>
                      <span className="font-medium text-slate-900">
                        {new Date(resource.uploadDate).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Eye className="h-4 w-4 mr-1" />
                      Ko'rish
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Yuklab olish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesPage;