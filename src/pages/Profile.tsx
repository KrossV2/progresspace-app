import { User, Mail, Phone, Calendar, MapPin, Edit, Camera, LogOut, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Статистика в зависимости от роли пользователя
  const getStats = () => {
    if (user?.role === 'student') {
      return {
        totalGrades: 127,
        averageGrade: 4.8,
        completedHomework: 92,
        attendanceRate: 96
      };
    } else if (user?.role === 'teacher') {
      return {
        totalStudents: 35,
        averageGrade: 4.5,
        completedLessons: 156,
        attendanceRate: 94
      };
    } else {
      return {
        totalChildren: 2,
        averageGrade: 4.6,
        completedHomework: 88,
        attendanceRate: 95
      };
    }
  };

  const stats = getStats();

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    logout();
    // Принудительно перезагружаем страницу для сброса состояния
    window.location.href = '/login';
  };

  // Функция для отображения роли на нужном языке
  const getRoleDisplay = (role: string) => {
    const roles = {
      student: t('role.student'),
      teacher: t('role.teacher'),
      parent: t('role.parent'),
      admin: t('role.admin'),
      director: t('role.director')
    };
    return roles[role as keyof typeof roles] || role;
  };

  // Если пользователь не загружен, показываем заглушку
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('nav.profile')}</h1>
          <p className="text-muted-foreground">Shaxsiy ma'lumotlaringizni ko'ring va tahrirlang</p>
        </div>
        <Button className="bg-gradient-primary">
          <Edit className="h-4 w-4 mr-2" />
          Tahrirlash
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Asosiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary border-2 border-background rounded-full flex items-center justify-center hover:bg-secondary-hover transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{getRoleDisplay(user.role)}</Badge>
                      {user.class && <Badge variant="outline">{user.class}</Badge>}
                      {user.subject && <Badge variant="outline">{user.subject}</Badge>}
                      <Badge variant="outline">ID: {user.id}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{user.phone || '+998 90 123 45 67'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{user.birthday || '15 may, 2007'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{user.address || 'Toshkent shahar, Yunusobod tumani'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success" />
                {user.role === 'teacher' ? "O'qitish ko'rsatkichlari" : 
                 user.role === 'parent' ? "Farzandlar statistikasi" : 
                 "O'quv ko'rsatkichlari"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.role === 'student' && (
                  <>
                    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary">{stats.totalGrades}</div>
                      <div className="text-sm text-muted-foreground mt-1">Jami baholar</div>
                    </div>
                    <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">{stats.averageGrade}</div>
                      <div className="text-sm text-muted-foreground mt-1">O'rtacha baho</div>
                    </div>
                    <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="text-2xl font-bold text-warning">{stats.completedHomework}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Uy vazifalari</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">{stats.attendanceRate}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Davomat</div>
                    </div>
                  </>
                )}
                
                {user.role === 'teacher' && (
                  <>
                    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
                      <div className="text-sm text-muted-foreground mt-1">Jami o'quvchilar</div>
                    </div>
                    <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">{stats.averageGrade}</div>
                      <div className="text-sm text-muted-foreground mt-1">O'rtacha baho</div>
                    </div>
                    <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="text-2xl font-bold text-warning">{stats.completedLessons}</div>
                      <div className="text-sm text-muted-foreground mt-1">O'tilgan darslar</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">{stats.attendanceRate}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Davomat</div>
                    </div>
                  </>
                )}
                
                {user.role === 'parent' && (
                  <>
                    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary">{stats.totalChildren}</div>
                      <div className="text-sm text-muted-foreground mt-1">Farzandlar soni</div>
                    </div>
                    <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">{stats.averageGrade}</div>
                      <div className="text-sm text-muted-foreground mt-1">O'rtacha baho</div>
                    </div>
                    <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="text-2xl font-bold text-warning">{stats.completedHomework}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Bajarilgan uy vazifalari</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">{stats.attendanceRate}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Davomat</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Tezkor amallar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Profilni tahrirlash
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Parolni o'zgartirish
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email o'zgartirish
              </Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Hisob ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Ro'yxatdan o'tgan sana</div>
                <div className="font-medium">{user.joinDate || '1 sentyabr, 2023'}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Hisob turi</div>
                <div className="font-medium">{getRoleDisplay(user.role)}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className="bg-success text-success-foreground">Faol</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card className="shadow-card border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Hisobni boshqarish</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Akkauntdan chiqish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}