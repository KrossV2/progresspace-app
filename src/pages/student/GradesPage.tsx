import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, Target, Star, Award, Calendar } from "lucide-react";

const StudentGradesPage = () => {
  const subjects = [
    { 
      name: "Matematika", 
      grades: [4, 5, 4, 5, 4, 5], 
      average: 4.5,
      teacher: "Aliyeva Malika",
      lastGrade: "2024-01-15",
      progress: 90
    },
    { 
      name: "Fizika", 
      grades: [3, 4, 4, 5, 4], 
      average: 4.0,
      teacher: "Karimov Sardor",
      lastGrade: "2024-01-14",
      progress: 80
    },
    { 
      name: "Ona tili", 
      grades: [5, 5, 4, 5, 5, 4], 
      average: 4.8,
      teacher: "Toshmatova Zuhra",
      lastGrade: "2024-01-16",
      progress: 96
    },
    { 
      name: "Tarix", 
      grades: [4, 4, 5, 4], 
      average: 4.3,
      teacher: "Yusupov Jamshid",
      lastGrade: "2024-01-13",
      progress: 86
    },
    { 
      name: "Biologiya", 
      grades: [5, 4, 4, 5, 4], 
      average: 4.4,
      teacher: "Xolmirzayeva Dilbar",
      lastGrade: "2024-01-12",
      progress: 88
    },
    { 
      name: "Ingliz tili", 
      grades: [4, 5, 5, 4, 5], 
      average: 4.6,
      teacher: "Smith John",
      lastGrade: "2024-01-15",
      progress: 92
    }
  ];

  const overallAverage = subjects.reduce((sum, subject) => sum + subject.average, 0) / subjects.length;
  const excellentSubjects = subjects.filter(subject => subject.average >= 4.5).length;
  const totalGrades = subjects.reduce((sum, subject) => sum + subject.grades.length, 0);

  const getGradeColor = (grade: number) => {
    if (grade >= 5) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
    if (grade >= 4) return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
    if (grade >= 3) return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700";
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 70) return "bg-orange-500";
    return "bg-red-500";
  };

  const getAverageBadgeColor = (average: number) => {
    if (average >= 4.5) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
    if (average >= 4.0) return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Mening Baholarim
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Barcha fanlar bo'yicha baholar statistikasi va progress
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Umumiy o'rtacha</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallAverage.toFixed(1)}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">A'lo fanlar</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{excellentSubjects} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jami baholar</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalGrades} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subjects.map((subject) => (
          <Card 
            key={subject.name} 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-100">{subject.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getAverageBadgeColor(subject.average)} font-bold text-sm px-3 py-1`}
                >
                  {subject.average.toFixed(1)}
                </Badge>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {subject.teacher}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Grades */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Baholar:</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{subject.grades.length} ta</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subject.grades.map((grade, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className={`${getGradeColor(grade)} font-semibold text-sm px-2.5 py-1.5 rounded-lg`}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress:</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getProgressColor(subject.progress)} transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Grade Info */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>So'nggi baho:</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(subject.lastGrade).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-purple-900 dark:text-purple-100">
            <Target className="h-6 w-6" />
            <span className="text-xl">Umumiy Statistika</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallAverage.toFixed(1)}</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">O'rtacha baho</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{excellentSubjects}</div>
              <div className="text-sm text-green-600 dark:text-green-300">A'lo fanlar</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {subjects.filter(s => s.average >= 4.0 && s.average < 4.5).length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-300">Yaxshi fanlar</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalGrades}</div>
              <div className="text-sm text-purple-600 dark:text-purple-300">Jami baholar</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>5</strong> - A'lo (90-100%)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>4</strong> - Yaxshi (80-89%)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>3</strong> - Qoniqarli (70-79%)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>2</strong> - Qoniqarsiz (0-69%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Umumiy Natija</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{overallAverage.toFixed(1)}</div>
                <div className="text-blue-100 text-sm">O'rtacha Baho</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{excellentSubjects}</div>
                <div className="text-blue-100 text-sm">A'lo Fanlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{totalGrades}</div>
                <div className="text-blue-100 text-sm">Jami Baholar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{subjects.length}</div>
                <div className="text-blue-100 text-sm">Jami Fanlar</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGradesPage;