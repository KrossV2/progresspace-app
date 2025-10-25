import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertTriangle, TrendingUp, Award, Clock } from "lucide-react";

interface BehaviorRow {
  id: number;
  date: string;
  type: "reward" | "penalty";
  description: string;
  points: number;
  teacher: string;
}

const StudentBehaviorsPage = () => {
  const [rows, setRows] = useState<BehaviorRow[]>([]);

  useEffect(() => {
    setRows([
      { 
        id: 1, 
        date: "2024-01-15", 
        type: "reward", 
        description: "Darsda faol ishtirok etgani uchun", 
        points: 5,
        teacher: "Aliyeva M."
      },
      { 
        id: 2, 
        date: "2024-01-12", 
        type: "penalty", 
        description: "Darsga kechikkani uchun", 
        points: -2,
        teacher: "Karimov S."
      },
      { 
        id: 3, 
        date: "2024-01-10", 
        type: "reward", 
        description: "Uy vazifasini a'lo bajargani uchun", 
        points: 3,
        teacher: "Aliyeva M."
      },
      { 
        id: 4, 
        date: "2024-01-08", 
        type: "reward", 
        description: "Jamoaviy loyihada yaxshi natija ko'rsatgani uchun", 
        points: 7,
        teacher: "Toshmatov A."
      },
      { 
        id: 5, 
        date: "2024-01-05", 
        type: "penalty", 
        description: "Uy vazifasini topshirmaganligi uchun", 
        points: -3,
        teacher: "Aliyeva M."
      },
    ]);
  }, []);

  const totalPoints = rows.reduce((sum, row) => sum + row.points, 0);
  const rewardsCount = rows.filter(row => row.type === "reward").length;
  const penaltiesCount = rows.filter(row => row.type === "penalty").length;

  const getTypeVariant = (type: string) => {
    return type === "reward" ? "default" : "destructive";
  };

  const getTypeIcon = (type: string) => {
    return type === "reward" ? <Trophy className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return "text-green-600";
    if (points < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Xulq-atvor Jurnali
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Rag'batlar, ogohlantirishlar va ballar tizimi
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Umumiy Ballar</p>
                <p className={`text-2xl font-bold ${getPointsColor(totalPoints)}`}>
                  {totalPoints} ball
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rag'batlar</p>
                <p className="text-2xl font-bold text-green-600">{rewardsCount} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ogohlantirishlar</p>
                <p className="text-2xl font-bold text-orange-600">{penaltiesCount} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behaviors Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Xulq-atvor Yozuvlari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 hover:bg-blue-50">
                  <TableHead className="font-semibold text-blue-900 py-4">Sana</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Turi</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Izoh</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">Ballar</TableHead>
                  <TableHead className="font-semibold text-blue-900 py-4">O'qituvchi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow 
                    key={r.id} 
                    className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-blue-100"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{r.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={getTypeVariant(r.type)}
                        className={`
                          ${r.type === "reward" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
                          font-semibold px-3 py-1 rounded-full flex items-center space-x-1 w-fit
                        `}
                      >
                        {getTypeIcon(r.type)}
                        <span>{r.type === "reward" ? "Rag'bat" : "Ogohlantirish"}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">{r.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`font-bold ${getPointsColor(r.points)}`}>
                        {r.points > 0 ? '+' : ''}{r.points}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">
                      {r.teacher}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Rag'bat - Ijobiy xatti-harakatlar uchun</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Ogohlantirish - Salbiy xatti-harakatlar uchun</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Ballar - Harakatlarning qiymati</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <TrendingUp className="h-5 w-5" />
            <span>Statistika Xulosasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ijobiy ballar:</span>
                <span className="font-semibold text-green-600">
                  +{rows.filter(r => r.points > 0).reduce((sum, r) => sum + r.points, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Salbiy ballar:</span>
                <span className="font-semibold text-red-600">
                  {rows.filter(r => r.points < 0).reduce((sum, r) => sum + r.points, 0)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>O'rtacha ball/kun:</span>
                <span className="font-semibold text-blue-600">
                  {(totalPoints / rows.length).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Faollik darajasi:</span>
                <span className="font-semibold text-purple-600">
                  {Math.round((rewardsCount / rows.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBehaviorsPage;