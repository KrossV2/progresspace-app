import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([
    { id: 1, name: "Aziz Karimov", status: "present" },
    { id: 2, name: "Malika Tosheva", status: "absent" },
    { id: 3, name: "Sardor Ahmadov", status: "late" }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Davomatni belgilash</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Bugungi davomat - 10-A sinfi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendance.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">{student.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant={student.status === "present" ? "default" : "outline"}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant={student.status === "late" ? "default" : "outline"}>
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant={student.status === "absent" ? "default" : "outline"}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;