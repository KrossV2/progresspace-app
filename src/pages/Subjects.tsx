import { BookOpen, User, TrendingUp, Clock, FileText, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Subjects() {
  // TODO: Replace with API call to fetch subjects data
  const subjects = [
    {
      id: 1,
      name: "Matematika",
      teacher: "Karimova Nilufar",
      icon: "📐",
      color: "primary",
      stats: {
        averageGrade: 4.8,
        totalGrades: 25,
        completedHomework: 18,
        totalHomework: 20,
        attendance: 96
      },
      recentActivity: "Yangi dars: Integralar",
      nextClass: "Ertaga, 08:30"
    },
    {
      id: 2,
      name: "Ingliz tili",
      teacher: "Smith John",
      icon: "🇬🇧",
      color: "success",
      stats: {
        averageGrade: 4.5,
        totalGrades: 22,
        completedHomework: 19,
        totalHomework: 21,
        attendance: 94
      },
      recentActivity: "Yangi test: Present Perfect",
      nextClass: "Bugun, 09:25"
    },
    {
      id: 3,
      name: "Fizika",
      teacher: "Rahimov Aziz",
      icon: "⚡",
      color: "warning",
      stats: {
        averageGrade: 4.2,
        totalGrades: 20,
        completedHomework: 15,
        totalHomework: 18,
        attendance: 90
      },
      recentActivity: "Lab ishi: Elektr zanjiri",
      nextClass: "Bugun, 10:20"
    },
    {
      id: 4,
      name: "Kimyo",
      teacher: "Saidova Maryam",
      icon: "🧪",
      color: "destructive",
      stats: {
        averageGrade: 4.6,
        totalGrades: 18,
        completedHomework: 16,
        totalHomework: 17,
        attendance: 98
      },
      recentActivity: "Yangi mavzu: Organik kimyo",
      nextClass: "Bugun, 11:15"
    },
    {
      id: 5,
      name: "Tarix",
      teacher: "Umarov Bekzod",
      icon: "📚",
      color: "secondary",
      stats: {
        averageGrade: 4.7,
        totalGrades: 15,
        completedHomework: 14,
        totalHomework: 15,
        attendance: 100
      },
      recentActivity: "Yangi mavzu: O'rta asrlar",
      nextClass: "Bugun, 13:00"
    },
    {
      id: 6,
      name: "Jismoniy tarbiya",
      teacher: "Karimov Jasur",
      icon: "⚽",
      color: "accent",
      stats: {
        averageGrade: 5.0,
        totalGrades: 12,
        completedHomework: 10,
        totalHomework: 10,
        attendance: 85
      },
      recentActivity: "Yangi sport turi: Basketbol",
      nextClass: "Bugun, 13:55"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      primary: "bg-primary/5 border-primary/20 text-primary",
      success: "bg-success/5 border-success/20 text-success", 
      warning: "bg-warning/5 border-warning/20 text-warning",
      destructive: "bg-destructive/5 border-destructive/20 text-destructive",
      secondary: "bg-secondary border-border text-secondary-foreground",
      accent: "bg-accent/5 border-accent/20 text-accent-foreground"
    };
    return colors[color as keyof typeof colors] || colors.secondary;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fanlar</h1>
          <p className="text-muted-foreground">Barcha fanlaringiz va ularning ma'lumotlari</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            6 ta fan
          </Badge>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="shadow-card border-border hover:shadow-elevated transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getColorClasses(subject.color)}`}>
                    {subject.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {subject.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      <span>{subject.teacher}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {subject.stats.averageGrade}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">{subject.stats.totalGrades}</div>
                  <div className="text-xs text-muted-foreground">Baholar</div>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">{subject.stats.attendance}%</div>
                  <div className="text-xs text-muted-foreground">Davomat</div>
                </div>
              </div>

              {/* Homework Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Uy vazifalari</span>
                  <span className="font-medium">
                    {subject.stats.completedHomework}/{subject.stats.totalHomework}
                  </span>
                </div>
                <Progress 
                  value={(subject.stats.completedHomework / subject.stats.totalHomework) * 100} 
                  className="h-2"
                />
              </div>

              {/* Recent Activity */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">So'nggi faoliyat</span>
                </div>
                <p className="text-sm font-medium">{subject.recentActivity}</p>
              </div>

              {/* Next Class */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Keyingi dars</span>
                </div>
                <span className="text-sm font-medium text-primary">{subject.nextClass}</span>
              </div>

              {/* Action Button */}
              <Button className="w-full mt-4 bg-gradient-primary group-hover:shadow-md transition-all">
                <BookOpen className="h-4 w-4 mr-2" />
                Fanga o'tish
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Umumiy statistika
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.6</div>
              <div className="text-sm text-muted-foreground">Umumiy o'rtacha</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1">112</div>
              <div className="text-sm text-muted-foreground">Jami baholar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-1">92%</div>
              <div className="text-sm text-muted-foreground">Uy vazifalari</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive mb-1">94%</div>
              <div className="text-sm text-muted-foreground">Umumiy davomat</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}