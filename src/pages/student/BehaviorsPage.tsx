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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Xulq-atvor Jurnali
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Rag'batlar, ogohlantirishlar va ballar tizimi
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Umumiy Ballar</p>
                <p className={`text-2xl font-bold ${getPointsColor(totalPoints)}`}>
                  {totalPoints} ball
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rag'batlar</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rewardsCount} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ogohlantirishlar</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{penaltiesCount} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behaviors Table */}
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
          <CardTitle className="flex items-center space-x-3">
            <Trophy className="h-6 w-6" />
            <span className="text-xl">Xulq-atvor Yozuvlari</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100 py-4 text-center">Sana</TableHead>
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100 py-4 text-center">Turi</TableHead>
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100 py-4 text-center">Izoh</TableHead>
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100 py-4 text-center">Ballar</TableHead>
                  <TableHead className="font-semibold text-blue-900 dark:text-blue-100 py-4 text-center">O'qituvchi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow 
                    key={r.id} 
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 border-b border-blue-100 dark:border-blue-800"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-2 justify-center">
                        <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">{r.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Badge 
                          variant={getTypeVariant(r.type)}
                          className={`
                            ${
                              r.type === "reward" 
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800" 
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                            }
                            font-semibold px-3 py-1 rounded-full flex items-center space-x-2 w-fit transition-colors
                          `}
                        >
                          {getTypeIcon(r.type)}
                          <span>{r.type === "reward" ? "Rag'bat" : "Ogohlantirish"}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{r.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <span className={`font-bold text-lg ${getPointsColor(r.points)}`}>
                          {r.points > 0 ? '+' : ''}{r.points}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        {r.teacher}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legend */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
              Tushuntirish
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Rag'bat</strong> - Ijobiy xatti-harakatlar uchun
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Ogohlantirish</strong> - Salbiy xatti-harakatlar uchun
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Ballar</strong> - Harakatlarning qiymati
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-purple-900 dark:text-purple-100">
              <TrendingUp className="h-5 w-5" />
              <span>Statistika Xulosasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Ijobiy ballar:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    +{rows.filter(r => r.points > 0).reduce((sum, r) => sum + r.points, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Salbiy ballar:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {rows.filter(r => r.points < 0).reduce((sum, r) => sum + r.points, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">O'rtacha ball/kun:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {(totalPoints / Math.max(rows.length, 1)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Faollik darajasi:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {Math.round((rewardsCount / Math.max(rows.length, 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance */}
      <Card className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Umumiy Natija</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalPoints}</div>
                <div className="text-blue-100">Jami Ballar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{rewardsCount}</div>
                <div className="text-blue-100">Rag'batlar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{penaltiesCount}</div>
                <div className="text-blue-100">Ogohlantirishlar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{rows.length}</div>
                <div className="text-blue-100">Jami Yozuvlar</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBehaviorsPage;