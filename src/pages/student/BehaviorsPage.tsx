import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BehaviorRow {
  id: number;
  date: string;
  type: "reward" | "penalty";
  description: string;
}

const StudentBehaviorsPage = () => {
  const [rows, setRows] = useState<BehaviorRow[]>([]);

  useEffect(() => {
    setRows([
      { id: 1, date: "2024-01-09", type: "reward", description: "Faol ishtirok uchun rag'bat" },
      { id: 2, date: "2024-01-12", type: "penalty", description: "Kechikish" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Xulq-atvor</h1>
        <p className="text-muted-foreground">Rag'bat va ogohlantirishlar</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yozuvlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>Izoh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <span className={r.type === "reward" ? "text-green-600" : "text-red-600"}>
                        {r.type === "reward" ? "Rag'bat" : "Ogohlantirish"}
                      </span>
                    </TableCell>
                    <TableCell>{r.description}</TableCell>
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

export default StudentBehaviorsPage;

