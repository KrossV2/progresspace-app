import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceRow {
  id: number;
  date: string;
  subjectName: string;
  status: "present" | "absent" | "late";
}

const StudentAttendancePage = () => {
  const [rows, setRows] = useState<AttendanceRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, date: "2024-01-10", subjectName: "Matematika", status: "present" },
      { id: 2, date: "2024-01-11", subjectName: "Fizika", status: "late" },
      { id: 3, date: "2024-01-12", subjectName: "Ona tili", status: "absent" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Davomat</h1>
        <p className="text-muted-foreground">So'nggi davomat ma'lumotlari</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Davomat jadvali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Fan</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.subjectName}</TableCell>
                    <TableCell>
                      <span
                        className={
                          r.status === "present"
                            ? "text-green-600"
                            : r.status === "late"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {r.status === "present" ? "Kelgan" : r.status === "late" ? "Kechikkan" : "Kelmagan"}
                      </span>
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

export default StudentAttendancePage;

