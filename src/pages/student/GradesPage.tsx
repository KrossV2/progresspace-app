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
    if (grade >= 5) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 4) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade >= 3) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 70) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mening Baholarim
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Barcha fanlar bo'yicha baholar statistikasi va progress
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
                <p className="text-sm font-medium text-muted-foreground">Umumiy o'rtacha</p>
                <p className="text-2xl font-bold text-blue-600">{overallAverage.toFixed(1)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">A'lo fanlar</p>
                <p className="text-2xl font-bold text-green-600">{excellentSubjects} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami baholar</p>
                <p className="text-2xl font-bold text-purple-600">{totalGrades} ta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card 
            key={subject.name} 
            className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${subject.average >= 4.5 ? "bg-green-100 text-green-800 border-green-200" : 
                      subject.average >= 4.0 ? "bg-blue-100 text-blue-800 border-blue-200" : 
                      "bg-orange-100 text-orange-800 border-orange-200"}
                    font-bold
                  `}
                >
                  {subject.average.toFixed(1)}
                </Badge>
              </div>
              <CardDescription className="flex items-center space-x-1">
                <span>{subject.teacher}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Grades */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Baholar:</span>
                  <span className="text-xs text-gray-500">{subject.grades.length} ta</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {subject.grades.map((grade, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className={`${getGradeColor(grade)} font-semibold text-sm px-2 py-1`}
                    >
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Progress:</span>
                  <span className="text-sm font-bold text-gray-700">{subject.progress}%</span>
                </div>
                <Progress 
                  value={subject.progress} 
                  className={`h-2 ${getProgressColor(subject.progress)}`}
                />
              </div>

              {/* Last Grade Info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>So'nggi baho:</span>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {new Date(subject.lastGrade).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <Target className="h-5 w-5" />
            <span>Umumiy Statistika</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{overallAverage.toFixed(1)}</div>
              <div className="text-sm text-blue-600">O'rtacha baho</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{excellentSubjects}</div>
              <div className="text-sm text-green-600">A'lo fanlar</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {subjects.filter(s => s.average >= 4.0 && s.average < 4.5).length}
              </div>
              <div className="text-sm text-orange-600">Yaxshi fanlar</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalGrades}</div>
              <div className="text-sm text-purple-600">Jami baholar</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>5 - A'lo (90-100%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>4 - Yaxshi (80-89%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>3 - Qoniqarli (70-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>2 - Qoniqarsiz (0-69%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentGradesPage;