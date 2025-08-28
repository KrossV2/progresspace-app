import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ParentRow {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  studentName: string;
}

const TeacherParentsPage = () => {
  const [rows, setRows] = useState<ParentRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, firstName: "Rustam", lastName: "Karimov", phoneNumber: "+998901234567", studentName: "Aziz Karimov" },
      { id: 2, firstName: "Dilnoza", lastName: "Tosheva", phoneNumber: "+998907654321", studentName: "Malika Tosheva" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ota-onalar</h1>
        <p className="text-muted-foreground">Aloqa uchun ma'lumotlar</p>
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
                  <TableHead>Telefon</TableHead>
                  <TableHead>Farzandi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.firstName}</TableCell>
                    <TableCell>{r.lastName}</TableCell>
                    <TableCell>{r.phoneNumber}</TableCell>
                    <TableCell>{r.studentName}</TableCell>
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

export default TeacherParentsPage;

