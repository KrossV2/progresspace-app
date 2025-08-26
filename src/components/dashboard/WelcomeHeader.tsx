import { Calendar, Clock } from "lucide-react";

export function WelcomeHeader() {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('uz-UZ', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Xayrli tong";
    if (hour < 17) return "Xayrli kun";
    return "Xayrli kech";
  };

  return (
    <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-floating">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, <span className="text-gradient-hero">Aziz!</span>
          </h1>
          <p className="text-white/80 text-lg">
            Bugun sizni yangi yutuqlar kutmoqda
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{getCurrentDate()}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleTimeString('uz-UZ', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}