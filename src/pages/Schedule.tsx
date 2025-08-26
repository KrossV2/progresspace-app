import { useState } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  // TODO: Replace with API call to fetch schedule data
  const weekDays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  
  const schedule = {
    "Dushanba": [
      { time: "08:30-09:15", subject: "Matematika", teacher: "Karimova N.", room: "203", type: "dars" },
      { time: "09:25-10:10", subject: "Ingliz tili", teacher: "Smith J.", room: "105", type: "dars" },
      { time: "10:20-11:05", subject: "Fizika", teacher: "Rahimov A.", room: "301", type: "dars" },
      { time: "11:15-12:00", subject: "Kimyo", teacher: "Saidova M.", room: "202", type: "laboratory" },
      { time: "13:00-13:45", subject: "Tarix", teacher: "Umarov B.", room: "107", type: "dars" },
    ],
    "Seshanba": [
      { time: "08:30-09:15", subject: "Ingliz tili", teacher: "Smith J.", room: "105", type: "dars" },
      { time: "09:25-10:10", subject: "Matematika", teacher: "Karimova N.", room: "203", type: "dars" },
      { time: "10:20-11:05", subject: "Biologiya", teacher: "Toshev S.", room: "204", type: "dars" },
      { time: "11:15-12:00", subject: "Adabiyot", teacher: "Nazarova G.", room: "108", type: "dars" },
      { time: "13:00-13:45", subject: "Jismoniy tarbiya", teacher: "Karimov J.", room: "Sport zali", type: "sport" },
    ],
    "Chorshanba": [
      { time: "08:30-09:15", subject: "Fizika", teacher: "Rahimov A.", room: "301", type: "laboratory" },
      { time: "09:25-10:10", subject: "Kimyo", teacher: "Saidova M.", room: "202", type: "dars" },
      { time: "10:20-11:05", subject: "Matematika", teacher: "Karimova N.", room: "203", type: "dars" },
      { time: "11:15-12:00", subject: "Geografiya", teacher: "Olimov R.", room: "106", type: "dars" },
      { time: "13:00-13:45", subject: "Ingliz tili", teacher: "Smith J.", room: "105", type: "dars" },
    ],
    "Payshanba": [
      { time: "08:30-09:15", subject: "Matematika", teacher: "Karimova N.", room: "203", type: "test" },
      { time: "09:25-10:10", subject: "Tarix", teacher: "Umarov B.", room: "107", type: "dars" },
      { time: "10:20-11:05", subject: "Ingliz tili", teacher: "Smith J.", room: "105", type: "dars" },
      { time: "11:15-12:00", subject: "Informatika", teacher: "Qodirov F.", room: "IT lab", type: "laboratory" },
      { time: "13:00-13:45", subject: "Adabiyot", teacher: "Nazarova G.", room: "108", type: "dars" },
    ],
    "Juma": [
      { time: "08:30-09:15", subject: "Biologiya", teacher: "Toshev S.", room: "204", type: "dars" },
      { time: "09:25-10:10", subject: "Fizika", teacher: "Rahimov A.", room: "301", type: "dars" },
      { time: "10:20-11:05", subject: "Kimyo", teacher: "Saidova M.", room: "202", type: "dars" },
      { time: "11:15-12:00", subject: "Jismoniy tarbiya", teacher: "Karimov J.", room: "Sport zali", type: "sport" },
    ],
    "Shanba": []
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "laboratory": return "bg-destructive text-destructive-foreground";
      case "sport": return "bg-success text-success-foreground";
      case "test": return "bg-warning text-warning-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "laboratory": return "🧪";
      case "sport": return "⚽";
      case "test": return "📝";
      default: return "📚";
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(today.setDate(diff));
    
    return weekDays.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index + (currentWeek * 7));
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dars jadvali</h1>
          <p className="text-muted-foreground">Haftalik va kunlik dars jadvalingiz</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Haftalik</SelectItem>
              <SelectItem value="day">Kunlik</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Oldingi hafta
            </Button>
            
            <div className="text-center">
              <h3 className="font-semibold">
                {weekDates[0].toLocaleDateString('uz-UZ', { month: 'long' })} oyi
              </h3>
              <p className="text-sm text-muted-foreground">
                {weekDates[0].getDate()} - {weekDates[4].getDate()} kunlar
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              Keyingi hafta
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {viewMode === "week" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {weekDays.map((day, dayIndex) => (
            <Card key={day} className="shadow-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-center">
                  <div className="text-lg font-bold">{day}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {weekDates[dayIndex].getDate()} {weekDates[dayIndex].toLocaleDateString('uz-UZ', { month: 'short' })}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schedule[day as keyof typeof schedule].length > 0 ? (
                  schedule[day as keyof typeof schedule].map((lesson, index) => (
                    <div key={index} className="p-3 bg-secondary/50 rounded-lg border border-border hover:bg-secondary transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs ${getTypeColor(lesson.type)}`}>
                          {getTypeIcon(lesson.type)} {lesson.subject}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">{lesson.time}</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate">{lesson.teacher}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{lesson.room}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Dam olish kuni</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Daily View
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Bugungi darslar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule["Dushanba"].map((lesson, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
                  <div className="text-center min-w-[80px]">
                    <div className="font-mono font-semibold text-primary">{lesson.time}</div>
                  </div>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary text-white text-lg">
                    {getTypeIcon(lesson.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{lesson.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{lesson.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{lesson.room}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getTypeColor(lesson.type)}>
                    {lesson.type === "laboratory" ? "Laboratoriya" : 
                     lesson.type === "sport" ? "Sport" :
                     lesson.type === "test" ? "Test" : "Dars"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle>Haftalik xulosa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">25</div>
              <div className="text-sm text-muted-foreground mt-1">Jami darslar</div>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="text-2xl font-bold text-success">3</div>
              <div className="text-sm text-muted-foreground mt-1">Sport darslari</div>
            </div>
            <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="text-2xl font-bold text-destructive">4</div>
              <div className="text-sm text-muted-foreground mt-1">Laboratoriya</div>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-sm text-muted-foreground mt-1">Testlar</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}