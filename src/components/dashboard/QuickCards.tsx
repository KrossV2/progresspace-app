import { Clock, FileText, GraduationCap, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for quick cards
// TODO: Replace with API calls to backend
const quickData = {
  nextClass: {
    subject: "Fizika",
    time: "10:20",
    room: "301-xona",
    teacher: "Rahimov Aziz"
  },
  homeworkCount: {
    pending: 3,
    completed: 12,
    total: 15
  },
  recentGrades: [
    { subject: "Matematika", grade: 5, date: "Bugun" },
    { subject: "Ingliz tili", grade: 4, date: "Kecha" },
    { subject: "Tarix", grade: 5, date: "2 kun oldin" }
  ],
  reminders: [
    { text: "Matematika imtihoni", date: "Ertaga", type: "exam" },
    { text: "Ingliz tili projekti", date: "3 kun", type: "project" },
    { text: "Ota-onalar yig'ilishi", date: "Keyingi hafta", type: "meeting" }
  ]
};

export function QuickCards() {
  return (
    <div className="space-y-4">
      {/* Next Class Card */}
      <Card className="shadow-card border-border bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            Keyingi dars
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary">{quickData.nextClass.subject}</h3>
              <Badge variant="outline" className="text-xs">
                {quickData.nextClass.time}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>👨‍🏫 {quickData.nextClass.teacher}</p>
              <p>📍 {quickData.nextClass.room}</p>
            </div>
          </div>
          <Button size="sm" className="w-full bg-gradient-primary">
            Darsga o'tish
          </Button>
        </CardContent>
      </Card>

      {/* Homework Count Card */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-warning/10">
              <FileText className="h-4 w-4 text-warning" />
            </div>
            Uy vazifalari
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bajarilmagan</span>
              <Badge variant="destructive" className="text-xs">
                {quickData.homeworkCount.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bajarilgan</span>
              <Badge variant="default" className="bg-success text-success-foreground text-xs">
                {quickData.homeworkCount.completed}
              </Badge>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium">Jami</span>
                <span className="font-semibold text-primary">
                  {quickData.homeworkCount.total}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bajarilish foizi</span>
              <span>{Math.round((quickData.homeworkCount.completed / quickData.homeworkCount.total) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-success h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(quickData.homeworkCount.completed / quickData.homeworkCount.total) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Grades Card */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-success/10">
              <GraduationCap className="h-4 w-4 text-success" />
            </div>
            So'nggi baholar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickData.recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{grade.subject}</p>
                  <p className="text-xs text-muted-foreground">{grade.date}</p>
                </div>
                <Badge 
                  className={`ml-2 ${
                    grade.grade >= 5 
                      ? "bg-success text-success-foreground" 
                      : grade.grade >= 4 
                      ? "bg-primary text-primary-foreground"
                      : "bg-warning text-warning-foreground"
                  }`}
                >
                  {grade.grade}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminders Card */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-destructive/10">
              <Bell className="h-4 w-4 text-destructive" />
            </div>
            Eslatmalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          <div className="space-y-2">
            {quickData.reminders.map((reminder, index) => (
              <div key={index} className="p-2 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive mt-1.5"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{reminder.text}</p>
                    <p className="text-xs text-muted-foreground">{reminder.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reminder.type === "exam" ? "📝" : reminder.type === "project" ? "📁" : "👥"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}