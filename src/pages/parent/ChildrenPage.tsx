import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ParentChildrenPage = () => {
  const children = [
    {
      id: 1,
      name: "Aziz Karimov",
      class: "10-A",
      averageGrade: 4.2,
      attendanceRate: 95,
      recentGrades: [4, 5, 4, 5]
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mening farzandlarim</h1>
      
      {children.map((child) => (
        <Card key={child.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {child.name} - {child.class}
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Batafsil
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">O'rtacha baho</p>
                <p className="text-2xl font-bold">{child.averageGrade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Davomatiyatlik</p>
                <p className="text-2xl font-bold">{child.attendanceRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">So'nggi baholar</p>
                <div className="flex gap-1 mt-1">
                  {child.recentGrades.map((grade, index) => (
                    <Badge key={index} variant="outline">{grade}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ParentChildrenPage;