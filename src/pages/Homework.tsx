import { useState } from "react";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Homework() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  // TODO: Replace with API call to fetch homework data
  const homework = {
    todo: [
      {
        id: 1,
        title: "Kvadrat tenglamalar",
        subject: "Matematika",
        teacher: "Karimova N.",
        description: "19-20 betdagi 1, 3, 5, 7 misollarni yeching",
        dueDate: "2024-01-25",
        priority: "high",
        estimatedTime: "2 soat",
        attachments: ["kvadrat_tenglamalar.pdf"]
      },
      {
        id: 2,
        title: "Essay: My Future Plans",
        subject: "Ingliz tili",
        teacher: "Smith J.",
        description: "Write a 200-word essay about your future career plans",
        dueDate: "2024-01-26",
        priority: "medium",
        estimatedTime: "3 soat",
        attachments: []
      },
      {
        id: 3,
        title: "Fizika laboratoriya hisoboti",
        subject: "Fizika",
        teacher: "Rahimov A.",
        description: "Elektr zanjiri bo'yicha o'tkazilgan tajriba hisoboti",
        dueDate: "2024-01-27",
        priority: "high",
        estimatedTime: "4 soat",
        attachments: ["lab_template.docx"]
      }
    ],
    inProgress: [
      {
        id: 4,
        title: "Organik kimyo prezentatsiyasi",
        subject: "Kimyo",
        teacher: "Saidova M.",
        description: "Alkanllar haqida 10 slaydli prezentatsiya tayyorlash",
        dueDate: "2024-01-28",
        priority: "medium",
        estimatedTime: "5 soat",
        progress: 60,
        attachments: ["organik_kimyo.pptx"]
      }
    ],
    completed: [
      {
        id: 5,
        title: "Tarix insho",
        subject: "Tarix",
        teacher: "Umarov B.",
        description: "O'rta asrlar davridagi savdo yo'llari haqida insho",
        dueDate: "2024-01-20",
        priority: "low",
        estimatedTime: "2 soat",
        completedDate: "2024-01-19",
        grade: 5,
        attachments: []
      },
      {
        id: 6,
        title: "Biologiya test",
        subject: "Biologiya",
        teacher: "Toshev S.",
        description: "Hujayra tuzilishi bo'yicha test savollari",
        dueDate: "2024-01-22",
        priority: "medium",
        estimatedTime: "1 soat",
        completedDate: "2024-01-21",
        grade: 4,
        attachments: []
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "Yuqori";
      case "medium": return "O'rta";
      case "low": return "Past";
      default: return "Noma'lum";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const daysLeft = getDaysUntilDue(dueDate);
    if (daysLeft === 0) return "Bugun";
    if (daysLeft === 1) return "Ertaga";
    if (daysLeft === -1) return "Kecha";
    if (daysLeft > 0) return `${daysLeft} kun qoldi`;
    return `${Math.abs(daysLeft)} kun kechikdi`;
  };

  const totalHomework = homework.todo.length + homework.inProgress.length + homework.completed.length;
  const completedCount = homework.completed.length;
  const completionRate = totalHomework > 0 ? (completedCount / totalHomework) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Uy vazifalari</h1>
          <p className="text-muted-foreground">Barcha uy vazifalaringizni boshqaring</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {completionRate.toFixed(0)}% bajarilgan
          </Badge>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Yangi vazifa
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vazifa, fan yoki o'qituvchi bo'yicha qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Fanni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha fanlar</SelectItem>
                <SelectItem value="Matematika">Matematika</SelectItem>
                <SelectItem value="Ingliz tili">Ingliz tili</SelectItem>
                <SelectItem value="Fizika">Fizika</SelectItem>
                <SelectItem value="Kimyo">Kimyo</SelectItem>
                <SelectItem value="Tarix">Tarix</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{homework.todo.length}</div>
            <div className="text-sm text-muted-foreground">Bajarilmagan</div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{homework.inProgress.length}</div>
            <div className="text-sm text-muted-foreground">Jarayonda</div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{homework.completed.length}</div>
            <div className="text-sm text-muted-foreground">Bajarilgan</div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalHomework}</div>
            <div className="text-sm text-muted-foreground">Jami</div>
          </CardContent>
        </Card>
      </div>

      {/* Homework Tabs */}
      <Tabs defaultValue="todo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Bajarilmagan ({homework.todo.length})
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Jarayonda ({homework.inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Bajarilgan ({homework.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="space-y-4">
          {homework.todo.map((task) => (
            <Card key={task.id} className="shadow-card border-border hover:shadow-elevated transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                      <Badge variant="outline">{task.subject}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div className="text-muted-foreground">
                        👨‍🏫 {task.teacher}
                      </div>
                    </div>

                    {task.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Fayl:</span>
                        {task.attachments.map((file, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            📎 {file}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-gradient-primary">
                      Boshlash
                    </Button>
                    <Button size="sm" variant="outline">
                      AI yordam
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          {homework.inProgress.map((task) => (
            <Card key={task.id} className="shadow-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                      <Badge variant="outline">{task.subject}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{task.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                      <div className="text-muted-foreground">
                        👨‍🏫 {task.teacher}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-gradient-success">
                      Davom etish
                    </Button>
                    <Button size="sm" variant="outline">
                      Tugatish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {homework.completed.map((task) => (
            <Card key={task.id} className="shadow-card border-border opacity-90">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold line-through decoration-muted-foreground">
                        {task.title}
                      </h3>
                      <Badge variant="outline">{task.subject}</Badge>
                      {task.grade && (
                        <Badge className="bg-success text-success-foreground">
                          Baho: {task.grade}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div>
                        ✅ Bajarildi: {new Date(task.completedDate).toLocaleDateString('uz-UZ')}
                      </div>
                      <div>
                        👨‍🏫 {task.teacher}
                      </div>
                    </div>
                  </div>
                  
                  <CheckCircle className="h-6 w-6 text-success ml-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}