import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickCards } from "@/components/dashboard/QuickCards";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ActivityItemProps {
  image: string;
  title: string;
  time: string;
  color: "success" | "primary" | "warning" | "info";
}

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: "primary" | "success" | "warning";
  image: string;
}

interface EventItemProps {
  title: string;
  time: string;
  priority: "high" | "medium" | "low";
  type: "exam" | "project" | "meeting" | "lab";
  subject: string;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 p-4 md:p-8 space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <TodaySchedule />
        </div>
        
        <div className="xl:col-span-1">
          <QuickCards />
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center">
        {/* Recent Activity */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              So'nggi faoliyat
            </CardTitle>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
              Yangi
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityItem 
              image="/img/img1.png"
              title="Matematika uy vazifasi topshirildi"
              time="30 daqiqa oldin"
              color="success"
            />
            <ActivityItem 
              image="/img/img2.png"
              title="Ingliz tili darsiga qatnashildi"
              time="2 soat oldin"
              color="primary"
            />
            <ActivityItem 
              image="/img/img3.png"
              title="Fizika fanidan yangi material"
              time="4 soat oldin"
              color="warning"
            />
            <ActivityItem 
              image="/img/img1.png"
              title="Kimyo laboratoriya ishi"
              time="Kun oldin"
              color="info"
            />
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Haftalik progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <ProgressBar 
                label="Darslar" 
                percentage={85} 
                color="primary"
                image="/img/img1.png"
              />
              <ProgressBar 
                label="Uy vazifalari" 
                percentage={92} 
                color="success"
                image="/img/img2.png"
              />
              <ProgressBar 
                label="Testlar" 
                percentage={78} 
                color="primary"
                image="/img/img3.png"
              />
              <ProgressBar 
                label="Loyihalar" 
                percentage={65} 
                color="warning"
                image="/img/img1.png"
              />
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ketma-ket kelish</p>
                  <span className="text-2xl font-bold">12 kun</span>
                </div>
                <div className="text-3xl">
                  <img src="/img/img2.png" alt="Flame" className="h-8 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Yaqinlashayotgan hodisalar
            </CardTitle>
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
              3 ta yangi
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <EventItem 
              title="Matematika imtihoni"
              time="Ertaga, 09:00"
              priority="high"
              type="exam"
              subject="Matematika"
            />
            <EventItem 
              title="Ingliz tili projekti"
              time="3 kun ichida"
              priority="medium"
              type="project"
              subject="Ingliz tili"
            />
            <EventItem 
              title="Ota-onalar yig'ilishi"
              time="Keyingi hafta"
              priority="low"
              type="meeting"
              subject="Umumiy"
            />
            <EventItem 
              title="Fizika laboratoriyasi"
              time="2 kun ichida"
              priority="high"
              type="lab"
              subject="Fizika"
            />
          </CardContent>
        </Card>
      </div>

      {/* Motivational Widget */}
      {mounted && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Bugun ajoyib ish qildingiz! 🎉</h3>
                <p className="text-purple-100">5 ta vazifani bajarildi, 3 ta darsga qatnashildi. Davom eting!</p>
              </div>
              <div className="text-4xl">
                <img src="/img/img3.png" alt="Star" className="h-12 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Activity Item Component
function ActivityItem({ image, title, time, color }: ActivityItemProps) {
  const colorClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    primary: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-orange-100 text-orange-800 border-orange-200",
    info: "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <img src={image} alt={title} className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{time}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        color === 'success' ? 'bg-green-500' :
        color === 'primary' ? 'bg-blue-500' :
        color === 'warning' ? 'bg-orange-500' : 'bg-purple-500'
      }`}></div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ label, percentage, color, image }: ProgressBarProps) {
  const colorClasses = {
    primary: "bg-blue-500",
    success: "bg-green-500", 
    warning: "bg-orange-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${
            color === 'primary' ? 'bg-blue-100 text-blue-600' :
            color === 'success' ? 'bg-green-100 text-green-600' :
            'bg-orange-100 text-orange-600'
          }`}>
            <img src={image} alt={label} className="h-4 w-4" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{label}</span>
        </div>
        <span className="font-bold text-gray-700 dark:text-gray-300">{percentage}%</span>
      </div>
      <Progress value={percentage} className={`h-2 ${
        color === 'primary' ? 'bg-blue-100' :
        color === 'success' ? 'bg-green-100' :
        'bg-orange-100'
      }`} />
      <div 
        className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%`, marginTop: '-8px' }}
      ></div>
    </div>
  );
}

// Event Item Component
function EventItem({ title, time, priority, type, subject }: EventItemProps) {
  const getTypeImage = (eventType: string) => {
    const images = {
      exam: "/img/img1.png",
      project: "/img/img2.png",
      meeting: "/img/img3.png",
      lab: "/img/img1.png"
    };
    return images[eventType as keyof typeof images] || "/img/img2.png";
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    low: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 transition-colors">
      <div className={`p-2 rounded-lg ${
        type === 'exam' ? 'bg-blue-100 text-blue-600' :
        type === 'project' ? 'bg-purple-100 text-purple-600' :
        type === 'meeting' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
      }`}>
        <img src={getTypeImage(type)} alt={type} className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">{time}</p>
        <Badge variant="secondary" className="mt-1 text-xs">
          {subject}
        </Badge>
      </div>
      <Badge className={`text-xs ${priorityColors[priority]}`}>
        {priority === 'high' ? 'Yuqori' : priority === 'medium' ? "O'rta" : 'Past'}
      </Badge>
    </div>
  );
}