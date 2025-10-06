import { useState } from "react";
import { GraduationCap, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Grades() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // TODO: Replace with API call to fetch grades data
  const gradesData = {
    summary: {
      currentGPA: 4.6,
      previousGPA: 4.4,
      totalGrades: 127,
      averageTrend: "up"
    },
    subjects: [
      {
        name: "Matematika",
        currentGrade: 4.8,
        grades: [5, 4, 5, 5, 4, 5, 5, 4],
        trend: "up",
        lastGrade: { value: 5, date: "2024-01-20", type: "Nazorat ishi" }
      },
      {
        name: "Ingliz tili",
        currentGrade: 4.5,
        grades: [4, 5, 4, 4, 5, 4, 5, 4],
        trend: "stable",
        lastGrade: { value: 4, date: "2024-01-19", type: "So'zlar lug'ati" }
      },
      {
        name: "Fizika",
        currentGrade: 4.2,
        grades: [4, 4, 3, 4, 5, 4, 4, 5],
        trend: "up",
        lastGrade: { value: 5, date: "2024-01-18", type: "Laboratoriya" }
      },
      {
        name: "Kimyo",
        currentGrade: 4.6,
        grades: [5, 4, 5, 4, 5, 5, 4, 5],
        trend: "stable",
        lastGrade: { value: 5, date: "2024-01-17", type: "Dars faolligi" }
      },
      {
        name: "Tarix",
        currentGrade: 4.7,
        grades: [5, 5, 4, 5, 4, 5, 5, 4],
        trend: "up",
        lastGrade: { value: 4, date: "2024-01-16", type: "Insho" }
      },
      {
        name: "Biologiya",
        currentGrade: 4.3,
        grades: [4, 4, 5, 4, 4, 4, 5, 4],
        trend: "down",
        lastGrade: { value: 4, date: "2024-01-15", type: "Test" }
      }
    ],
    recentGrades: [
      { subject: "Matematika", grade: 5, date: "2024-01-20", type: "Nazorat ishi", teacher: "Karimova N." },
      { subject: "Ingliz tili", grade: 4, date: "2024-01-19", type: "So'zlar lug'ati", teacher: "Smith J." },
      { subject: "Fizika", grade: 5, date: "2024-01-18", type: "Laboratoriya", teacher: "Rahimov A." },
      { subject: "Kimyo", grade: 5, date: "2024-01-17", type: "Dars faolligi", teacher: "Saidova M." },
      { subject: "Tarix", grade: 4, date: "2024-01-16", type: "Insho", teacher: "Umarov B." }
    ]
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 5) return "bg-success text-success-foreground";
    if (grade >= 4) return "bg-primary text-primary-foreground";
    if (grade >= 3) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4 rounded-full bg-muted-foreground" />;
    }
  };

  const getGradeStats = () => {
    const allGrades = gradesData.subjects.flatMap(s => s.grades);
    return {
      5: allGrades.filter(g => g === 5).length,
      4: allGrades.filter(g => g === 4).length,
      3: allGrades.filter(g => g === 3).length,
      2: allGrades.filter(g => g === 2).length,
    };
  };

  const gradeStats = getGradeStats();
  const totalGrades = Object.values(gradeStats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Baholar</h1>
          <p className="text-muted-foreground">O'quv ko'rsatkichlaringiz va baholar tahlili</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Joriy chorak</SelectItem>
              <SelectItem value="previous">Oldingi chorak</SelectItem>
              <SelectItem value="year">Yillik</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-border bg-gradient-card">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold text-primary">{gradesData.summary.currentGPA}</span>
            </div>
            <div className="text-sm text-muted-foreground">Joriy GPA</div>
            <div className="flex items-center justify-center mt-1 text-xs">
              {gradesData.summary.averageTrend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive mr-1" />
              )}
              <span className="text-muted-foreground">
                {Math.abs(gradesData.summary.currentGPA - gradesData.summary.previousGPA).toFixed(1)} o'zgarish
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{gradeStats[5]}</div>
            <div className="text-sm text-muted-foreground">A'lo baholar</div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalGrades > 0 ? Math.round((gradeStats[5] / totalGrades) * 100) : 0}% jami bahodan
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{gradeStats[4]}</div>
            <div className="text-sm text-muted-foreground">Yaxshi baholar</div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalGrades > 0 ? Math.round((gradeStats[4] / totalGrades) * 100) : 0}% jami bahodan
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">{gradesData.summary.totalGrades}</div>
            <div className="text-sm text-muted-foreground">Jami baholar</div>
            <div className="text-xs text-muted-foreground mt-1">Bu yil olindi</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Umumiy ko'rinish
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Fanlar bo'yicha
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            So'nggi baholar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Grade Distribution */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>Baholar taqsimoti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="text-2xl font-bold text-success">{gradeStats[5]}</div>
                  <div className="text-sm text-muted-foreground">5 (A'lo)</div>
                  <Progress value={(gradeStats[5] / totalGrades) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{gradeStats[4]}</div>
                  <div className="text-sm text-muted-foreground">4 (Yaxshi)</div>
                  <Progress value={(gradeStats[4] / totalGrades) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="text-2xl font-bold text-warning">{gradeStats[3]}</div>
                  <div className="text-sm text-muted-foreground">3 (Qoniqarli)</div>
                  <Progress value={(gradeStats[3] / totalGrades) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">{gradeStats[2]}</div>
                  <div className="text-sm text-muted-foreground">2 (Qoniqarsiz)</div>
                  <Progress value={(gradeStats[2] / totalGrades) * 100} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>Oylik progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="font-medium">Yanvar</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">4.6</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="font-medium">Dekabr</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">4.4</span>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="font-medium">Noyabr</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">4.2</span>
                    <div className="h-4 w-4 rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          {gradesData.subjects.map((subject) => (
            <Card key={subject.name} className="shadow-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getGradeColor(subject.currentGrade)}>
                      {subject.currentGrade.toFixed(1)}
                    </Badge>
                  </div>
                </div>

                {/* Grades History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">So'nggi baholar:</span>
                    <span className="font-medium">
                      {subject.lastGrade.type} - {subject.lastGrade.date}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {subject.grades.map((grade, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getGradeColor(grade)}`}
                      >
                        {grade}
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>O'rtacha ko'rsatkich</span>
                      <span>{subject.currentGrade.toFixed(1)}/5.0</span>
                    </div>
                    <Progress value={(subject.currentGrade / 5) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle>So'nggi baholar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gradesData.recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{grade.subject}</h4>
                        <Badge variant="outline" className="text-xs">{grade.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        👨‍🏫 {grade.teacher} • {new Date(grade.date).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                    <Badge className={`${getGradeColor(grade.grade)} text-lg px-3 py-1`}>
                      {grade.grade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}