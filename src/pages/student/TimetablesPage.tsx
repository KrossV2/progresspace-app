import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Lesson {
  id: number;
  day: string;
  time: string;
  subjectName: string;
  teacherName: string;
}

const StudentTimetablesPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    setLessons([
      { id: 1, day: "Dushanba", time: "08:00 - 08:45", subjectName: "Matematika", teacherName: "N. Karimova" },
      { id: 2, day: "Dushanba", time: "09:00 - 09:45", subjectName: "Fizika", teacherName: "B. Tursunov" },
      { id: 3, day: "Seshanba", time: "10:00 - 10:45", subjectName: "Ona tili", teacherName: "S. Norova" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dars jadvali</h1>
        <p className="text-muted-foreground">Haftalik darslar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {lessons.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <CardTitle>{l.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.subjectName}</div>
                  <div className="text-sm text-muted-foreground">{l.teacherName}</div>
                </div>
                <div className="text-sm text-muted-foreground">{l.time}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentTimetablesPage;

