import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Megaphone, AlertTriangle, Info, Calendar, BookOpen, Users, Clock, CheckCircle2, Filter, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
              Bildirishnomalar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Maktabdan kelgan barcha xabarlar va e'lonlar
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
              {unreadCount} ta yangi
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Jami Xabarlar
            </CardTitle>
            <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalCount}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Barcha bildirishnomalar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'qilmagan
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
              {unreadCount}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Yangi xabarlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              O'qilgan
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              {totalCount - unreadCount}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Ko'rilgan xabarlar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Faol Bo'limlar
            </CardTitle>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(list.map(item => item.sender)).size}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
              Xabar yuboruvchilar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Filtrlash va Boshqaruv
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            Xabarlarni turi bo'yicha filtrlash va boshqarish
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-xl transition-all duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Barchasi
              </Button>
              <Button 
                variant={filter === "unread" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("unread")}
                className="rounded-xl transition-all duration-200"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                O'qilmagan ({unreadCount})
              </Button>
              <Button 
                variant={filter === "announcement" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("announcement")}
                className="rounded-xl transition-all duration-200"
              >
                <Megaphone className="h-4 w-4 mr-2" />
                E'lonlar
              </Button>
              <Button 
                variant={filter === "homework" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("homework")}
                className="rounded-xl transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Vazifalar
              </Button>
              <Button 
                variant={filter === "event" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("event")}
                className="rounded-xl transition-all duration-200"
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
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
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
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
              !notification.read ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${getTypeColor(notification.type).split(' ')[0]} ${getTypeColor(notification.type).split(' ')[1]}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {notification.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)} animate-pulse`} />
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={`font-semibold px-3 py-1 rounded-full border ${getTypeColor(notification.type)}`}>
                  {notification.type === "announcement" ? "E'lon" : 
                   notification.type === "warning" ? "Ogohlantirish" : 
                   notification.type === "info" ? "Ma'lumot" : 
                   notification.type === "homework" ? "Vazifa" : "Tadbir"}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium">
                  {notification.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {notification.message}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{notification.date}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-500 font-medium">
                    {notification.sender}
                  </div>
                </div>
                
                {!notification.read && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => markAsRead(notification.id)}
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
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
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <CardContent className="p-12">
            <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Hech qanday xabar topilmadi
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {filter === "all" 
                ? "Hozircha hech qanday xabar yo'q" 
                : `"${
                    filter === "unread" ? "O'qilmagan" :
                    filter === "announcement" ? "E'lon" :
                    filter === "homework" ? "Vazifa" : "Tadbir"
                  }" turidagi xabarlar topilmadi`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentNotificationsPage;