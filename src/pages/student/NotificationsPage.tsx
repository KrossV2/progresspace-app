import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Megaphone, AlertTriangle, Info, Calendar, BookOpen, Users, Clock, CheckCircle2, Filter } from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  type: "announcement" | "warning" | "info" | "homework" | "event";
  read: boolean;
  priority: "high" | "medium" | "low";
  sender: string;
  category: string;
}

const StudentNotificationsPage = () => {
  const [list, setList] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "announcement" | "homework" | "event">("all");

  useEffect(() => {
    setList([
      { 
        id: 1, 
        title: "Ota-onalar yig'ilishi", 
        message: "Dushanba kuni soat 15:00 da ota-onalar yig'ilishi bo'lib o'tadi. Iltimos, vaqtida yetib keling.", 
        date: "2024-01-18", 
        type: "announcement",
        read: false,
        priority: "high",
        sender: "Maktab ma'muriyati",
        category: "Umumiy"
      },
      { 
        id: 2, 
        title: "Uy vazifalari haqida", 
        message: "E'tibor bering, uy vazifalarini vaqtida topshirish muhim. Keyingi topshiriq muddati 20-yanvar.", 
        date: "2024-01-17", 
        type: "warning",
        read: true,
        priority: "medium",
        sender: "O'qituvchilar kengashi",
        category: "Vazifalar"
      },
      { 
        id: 3, 
        title: "Matematika olimpiadasi", 
        message: "25-yanvar kuni maktabimizda matematika olimpiadasi bo'lib o'tadi. Qatnashishni istagan o'quvchilar ro'yxatdan o'tishingizni so'raymiz.", 
        date: "2024-01-16", 
        type: "event",
        read: false,
        priority: "high",
        sender: "Matematika bo'limi",
        category: "Tadbirlar"
      },
      { 
        id: 4, 
        title: "Kutubxana yangiliklari", 
        message: "Kutubxonaga yangi kitoblar qo'shildi. Yangi adabiyotlar bilan tanishish uchun kutubxonamizga tashrif buyuring.", 
        date: "2024-01-15", 
        type: "info",
        read: true,
        priority: "low",
        sender: "Kutubxona",
        category: "Yangiliklar"
      },
      { 
        id: 5, 
        title: "Yangi uy vazifasi", 
        message: "Biologiya fanidan yangi uy vazifasi berildi. Tizimdagi 'Uy vazifalari' bo'limidan batafsil ma'lumot olishingiz mumkin.", 
        date: "2024-01-14", 
        type: "homework",
        read: false,
        priority: "medium",
        sender: "Biologiya o'qituvchisi",
        category: "Vazifalar"
      },
      { 
        id: 6, 
        title: "Sport musobaqasi", 
        message: "30-yanvar kuni tuman sport musobaqalari bo'lib o'tadi. Sportga qiziquvchi o'quvchilarni qatnashishga taklif qilamiz.", 
        date: "2024-01-13", 
        type: "event",
        read: true,
        priority: "medium",
        sender: "Jismoniy tarbiya bo'limi",
        category: "Tadbirlar"
      }
    ]);
  }, []);

  const markAsRead = (id: number) => {
    setList(prev => prev.map(item => 
      item.id === id ? { ...item, read: true } : item
    ));
  };

  const markAllAsRead = () => {
    setList(prev => prev.map(item => ({ ...item, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement": return <Megaphone className="h-5 w-5" />;
      case "warning": return <AlertTriangle className="h-5 w-5" />;
      case "info": return <Info className="h-5 w-5" />;
      case "homework": return <BookOpen className="h-5 w-5" />;
      case "event": return <Calendar className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement": return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning": return "bg-orange-100 text-orange-800 border-orange-200";
      case "info": return "bg-green-100 text-green-800 border-green-200";
      case "homework": return "bg-purple-100 text-purple-800 border-purple-200";
      case "event": return "bg-pink-100 text-pink-800 border-pink-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const filteredList = list.filter(item => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    return item.type === filter;
  });

  const unreadCount = list.filter(item => !item.read).length;
  const totalCount = list.length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bildirishnomalar
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Maktabdan kelgan barcha xabarlar va e'lonlar
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jami Xabarlar</p>
                <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
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
                <p className="text-sm font-medium text-muted-foreground">O'qilmagan</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">O'qilgan</p>
                <p className="text-2xl font-bold text-green-600">{totalCount - unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Faol bo'limlar</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(list.map(item => item.sender)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                <Filter className="h-4 w-4 mr-2" />
                Barchasi
              </Button>
              <Button 
                variant={filter === "unread" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("unread")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                O'qilmagan ({unreadCount})
              </Button>
              <Button 
                variant={filter === "announcement" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("announcement")}
              >
                <Megaphone className="h-4 w-4 mr-2" />
                E'lonlar
              </Button>
              <Button 
                variant={filter === "homework" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("homework")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vazifalar
              </Button>
              <Button 
                variant={filter === "event" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("event")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Tadbirlar
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Barchasini o'qilgan deb belgilash
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredList.map((notification) => (
          <Card 
            key={notification.id} 
            className={`bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
              !notification.read ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(notification.type)}
                  <CardTitle className="text-lg">{notification.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                  )}
                </div>
              </div>
              <CardDescription className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getTypeColor(notification.type)}>
                  {notification.type === "announcement" ? "E'lon" : 
                   notification.type === "warning" ? "Ogohlantirish" : 
                   notification.type === "info" ? "Ma'lumot" : 
                   notification.type === "homework" ? "Vazifa" : "Tadbir"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {notification.category}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-700 leading-relaxed">
                {notification.message}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{notification.date}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {notification.sender}
                  </div>
                </div>
                
                {!notification.read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    O'qildi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredList.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 text-center">
          <CardContent className="p-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Hech qanday xabar topilmadi
            </h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "Hozircha hech qanday xabar yo'q" 
                : `"${filter}" turidagi xabarlar topilmadi`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentNotificationsPage;