import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
}

const StudentNotificationsPage = () => {
  const [list, setList] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setList([
      { id: 1, title: "E'lon", message: "Dushanba kuni ota-onalar yig'ilishi", date: "2024-01-18" },
      { id: 2, title: "Ogohlantirish", message: "Uy vazifalarini vaqtida topshiring", date: "2024-01-17" },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Xabarlar</h1>
        <p className="text-muted-foreground">Maktabdan kelgan bildirishnomalar</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle className="text-base">{n.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-1">{n.date}</div>
              <div>{n.message}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentNotificationsPage;

