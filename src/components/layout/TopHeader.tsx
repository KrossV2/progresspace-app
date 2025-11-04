import { useState, useEffect } from "react";
import { Bell, Search, Moon, Sun, MessageCircle, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChat } from "@/contexts/ChatContext";

interface TopHeaderProps {
  onToggleSidebar?: () => void;
}

export function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const { t } = useLanguage();
  const { isChatOpen, setIsChatOpen, unreadCount } = useChat();
  const [isDark, setIsDark] = useState<boolean>(() => {
    // начальная проверка темы
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Применяем тему при изменении состояния
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const getCurrentTime = (): string =>
    new Date().toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const getCurrentDate = (): string =>
    new Date().toLocaleDateString("uz-UZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const toggleChat = (): void => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6 w-full">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={onToggleSidebar}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Fan, vazifa, o'qituvchi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end text-sm mr-4">
            <div className="font-mono text-primary font-semibold">
              {getCurrentTime()}
            </div>
            <div className="text-muted-foreground text-xs">
              {getCurrentDate()}
            </div>
          </div>

          <RoleSwitcher />
          <LanguageSwitcher />

          <Button variant="ghost" size="icon" onClick={toggleChat} className="relative h-9 w-9">
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 border-2 border-background flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive border-2 border-background flex items-center justify-center">
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

          {/* ✅ Theme toggle — всегда срабатывает */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
