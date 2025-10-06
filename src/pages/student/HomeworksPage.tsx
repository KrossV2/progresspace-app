import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface HomeworkRow {
  id: number;
  title: string;
  subjectName: string;
  dueDate: string;
  status: "pending" | "submitted";
}

const StudentHomeworksPage = () => {
  const [rows, setRows] = useState<HomeworkRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, title: "Algebraik ifodalar", subjectName: "Matematika", dueDate: "2024-01-20", status: "pending" },
      { id: 2, title: "O'qish topshirig'i", subjectName: "Ona tili", dueDate: "2024-01-22", status: "submitted" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Uy vazifalari</h1>
        <p className="text-muted-foreground">Yangi va topshirilgan vazifalar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vazifalar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Fan</TableHead>
                  <TableHead>Muddat</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{r.subjectName}</TableCell>
                    <TableCell>{r.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "submitted" ? "default" : "outline"}>
                        {r.status === "submitted" ? "Topshirildi" : "Kutilmoqda"}
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

export default StudentHomeworksPage;

