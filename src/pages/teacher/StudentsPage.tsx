import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentRow {
  id: number;
  firstName: string;
  lastName: string;
  className: string;
  isActive: boolean;
}

const TeacherStudentsPage = () => {
  const [rows, setRows] = useState<StudentRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, firstName: "Aziz", lastName: "Karimov", className: "10-A", isActive: true },
      { id: 2, firstName: "Malika", lastName: "Tosheva", className: "9-B", isActive: true },
      { id: 3, firstName: "Rustam", lastName: "Saidov", className: "10-A", isActive: false },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">O'quvchilar</h1>
        <p className="text-muted-foreground">Sinf o'quvchilari ro'yxati</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ro'yxat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ism</TableHead>
                  <TableHead>Familiya</TableHead>
                  <TableHead>Sinf</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.firstName}</TableCell>
                    <TableCell>{r.lastName}</TableCell>
                    <TableCell>{r.className}</TableCell>
                    <TableCell>
                      <Badge variant={r.isActive ? "default" : "outline"}>
                        {r.isActive ? "Faol" : "Nofaol"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStudentsPage;

