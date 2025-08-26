import { Search, Bell, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function TopHeader() {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme toggle functionality
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('uz-UZ', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Search Section */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Fan, vazifa, o'qituvchi bo'yicha qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 border-border focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Current Time & Date */}
          <div className="hidden md:flex flex-col items-end text-sm">
            <div className="font-mono text-primary font-semibold">
              {getCurrentTime()}
            </div>
            <div className="text-muted-foreground text-xs">
              {getCurrentDate()}
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Bildirishnomalar</h3>
                <p className="text-sm text-muted-foreground">Sizda 3 ta yangi xabar bor</p>
              </div>
              <div className="p-2">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Yangi uy vazifasi</p>
                    <p className="text-xs text-muted-foreground">Matematika fanidan yangi vazifa berildi</p>
                    <p className="text-xs text-muted-foreground">15 daqiqa oldin</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Baho qo'yildi</p>
                    <p className="text-xs text-muted-foreground">Fizika fanidan 5 baho oldingiz</p>
                    <p className="text-xs text-muted-foreground">1 soat oldin</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">Jadval o'zgarishi</p>
                    <p className="text-xs text-muted-foreground">Ertangi ingliz tili darsi bekor qilindi</p>
                    <p className="text-xs text-muted-foreground">2 soat oldin</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}