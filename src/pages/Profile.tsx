import { User, Mail, Phone, Calendar, MapPin, Edit, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  // TODO: Replace with API call to fetch user profile
  const userProfile = {
    name: "Aziz Rahimov",
    role: "O'quvchi",
    class: "10-A sinf",
    studentId: "2024001",
    email: "aziz.rahimov@eduspace.uz",
    phone: "+998 90 123 45 67",
    birthday: "15 may, 2007",
    address: "Toshkent shahar, Yunusobod tumani",
    joinDate: "1 sentyabr, 2023",
    avatar: "/placeholder-avatar.jpg",
    stats: {
      totalGrades: 127,
      averageGrade: 4.8,
      completedHomework: 92,
      attendanceRate: 96
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profil</h1>
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
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary border-2 border-background rounded-full flex items-center justify-center hover:bg-secondary-hover transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{userProfile.role}</Badge>
                      <Badge variant="outline">{userProfile.class}</Badge>
                      <Badge variant="outline">ID: {userProfile.studentId}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{userProfile.birthday}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{userProfile.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success" />
                O'quv ko'rsatkichlari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{userProfile.stats.totalGrades}</div>
                  <div className="text-sm text-muted-foreground mt-1">Jami baholar</div>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="text-2xl font-bold text-success">{userProfile.stats.averageGrade}</div>
                  <div className="text-sm text-muted-foreground mt-1">O'rtacha baho</div>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="text-2xl font-bold text-warning">{userProfile.stats.completedHomework}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Uy vazifalari</div>
                </div>
                <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">{userProfile.stats.attendanceRate}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Davomat</div>
                </div>
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
                <User className="h-4 w-4 mr-2" />
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
                <div className="font-medium">{userProfile.joinDate}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Hisob turi</div>
                <div className="font-medium">O'quvchi</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className="bg-success text-success-foreground">Faol</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}