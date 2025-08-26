import { Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for today's schedule
// TODO: Replace with API call to backend
const todaySchedule = [
  {
    id: 1,
    subject: "Matematika",
    teacher: "Karimova Nilufar",
    time: "08:30 - 09:15",
    room: "203-xona",
    type: "dars",
    status: "completed"
  },
  {
    id: 2,
    subject: "Ingliz tili",
    teacher: "Smith John",
    time: "09:25 - 10:10",
    room: "105-xona",
    type: "dars",
    status: "current"
  },
  {
    id: 3,
    subject: "Fizika",
    teacher: "Rahimov Aziz",
    time: "10:20 - 11:05",
    room: "301-xona",
    type: "dars",
    status: "upcoming"
  },
  {
    id: 4,
    subject: "Kimyo",
    teacher: "Saidova Maryam",
    time: "11:15 - 12:00",
    room: "202-xona",
    type: "laboratory",
    status: "upcoming"
  },
  {
    id: 5,
    subject: "Tarix",
    teacher: "Umarov Bekzod",
    time: "13:00 - 13:45",
    room: "107-xona",
    type: "dars",
    status: "upcoming"
  },
  {
    id: 6,
    subject: "Jismoniy tarbiya",
    teacher: "Karimov Jasur",
    time: "13:55 - 14:40",
    room: "Sport zali",
    type: "sport",
    status: "upcoming"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-muted text-muted-foreground";
    case "current":
      return "bg-primary text-primary-foreground";
    case "upcoming":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Tugallandi";
    case "current":
      return "Hozir";
    case "upcoming":
      return "Kelgusi";
    default:
      return "Noma'lum";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "laboratory":
      return "🧪";
    case "sport":
      return "⚽";
    case "test":
      return "📝";
    default:
      return "📚";
  }
};

export function TodaySchedule() {
  // Get current time to highlight current class
  const getCurrentTimeMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const startTime = timeStr.split(' - ')[0];
    const [hours, minutes] = startTime.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const currentTimeMinutes = getCurrentTimeMinutes();

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bugungi jadval</h2>
            <p className="text-sm text-muted-foreground font-normal">
              {new Date().toLocaleDateString('uz-UZ', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todaySchedule.map((lesson, index) => {
            const lessonTimeMinutes = parseTimeToMinutes(lesson.time);
            const isCurrentLesson = Math.abs(currentTimeMinutes - lessonTimeMinutes) < 45; // Within 45 minutes
            
            return (
              <div
                key={lesson.id}
                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${isCurrentLesson 
                    ? "bg-primary/5 border-primary shadow-md animate-pulse" 
                    : "bg-card border-border hover:bg-secondary/50"
                  }
                  ${lesson.status === "completed" ? "opacity-60" : ""}
                `}
              >
                {/* Current lesson indicator */}
                {isCurrentLesson && (
                  <div className="absolute -left-1 top-4 w-1 h-8 bg-primary rounded-full"></div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Subject Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary text-white text-lg">
                      {getTypeIcon(lesson.type)}
                    </div>

                    {/* Lesson Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{lesson.subject}</h3>
                        <Badge variant={lesson.type === "laboratory" ? "destructive" : "secondary"} className="text-xs">
                          {lesson.type === "laboratory" ? "Lab" : lesson.type === "sport" ? "Sport" : "Dars"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  </div>

                  {/* Time and Status */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-mono font-semibold text-primary">
                      {lesson.time}
                    </div>
                    <Badge className={`text-xs ${getStatusColor(lesson.status)}`}>
                      {getStatusText(lesson.status)}
                    </Badge>
                  </div>
                </div>

                {/* Progress bar for current lesson */}
                {isCurrentLesson && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Dars jarayoni</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-gradient-primary h-1.5 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No more classes message */}
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-xl text-center">
          <p className="text-success font-medium">
            🎉 Bugungi darslar tugadi! Ertaga yana ko'rishguncha!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}