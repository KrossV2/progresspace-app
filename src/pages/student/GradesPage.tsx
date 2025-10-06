import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentGradesPage = () => {
  const subjects = [
    { name: "Matematika", grades: [4, 5, 4, 5], average: 4.5 },
    { name: "Fizika", grades: [3, 4, 4, 5], average: 4.0 },
    { name: "Ona tili", grades: [5, 5, 4, 5], average: 4.8 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mening baholarim</h1>
      
      <div className="grid gap-4">
        {subjects.map((subject) => (
          <Card key={subject.name}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {subject.name}
                <Badge variant="outline">O'rtacha: {subject.average}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {subject.grades.map((grade, index) => (
                  <Badge key={index} variant={grade >= 4 ? "default" : "secondary"}>
                    {grade}
                  </Badge>
                ))}
              </div>
              <Progress value={(subject.average / 5) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentGradesPage;