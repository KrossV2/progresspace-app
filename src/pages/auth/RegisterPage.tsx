import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, School, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/contexts/AuthContext";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole | "";
  class: string;
  subject: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    class: "",
    subject: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { register, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Инициализация темы из localStorage или системных настроек
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.email || !formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.role) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Parollar mos kelmadi",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Xatolik",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    const success = await register({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role as UserRole,
      class: formData.class || undefined,
      subject: formData.subject || undefined
    });

    if (success) {
      toast({
        title: "Muvaffaqiyat",
        description: "Hisob muvaffaqiyatli yaratildi",
      });
      navigate("/");
    } else {
      toast({
        title: "Xatolik",
        description: "Bu email yoki username allaqachon mavjud",
        variant: "destructive",
      });
    }
  };

  const classes = ["10-A", "9-B", "11-A", "8-V"];
  const subjects = ["Matematika", "Fizika", "Ona tili", "Ingliz tili", "Biologiya", "Kimyo", "Tarix"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      {/* Кнопка переключения темы */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" />
        )}
      </Button>

      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <School className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Yangi hisob yaratish
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Yangi hisob yaratish uchun quyidagi maydonlarni to'ldiring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                  Ism
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Ismingiz"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                  Familiya
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Familiyangiz"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-900 dark:text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="foydalanuvchi_nomi"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={loading}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-white">
                  Parol
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kamida 6 ta belgi"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    disabled={loading}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white">
                  Parolni tasdiqlash
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Parolni qayta kiriting"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    disabled={loading}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-900 dark:text-white">
                  Rol
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: UserRole) => handleChange("role", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Rolni tanlang" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectItem value="student" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">O'quvchi</SelectItem>
                    <SelectItem value="teacher" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">O'qituvchi</SelectItem>
                    <SelectItem value="parent" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">Ota-ona</SelectItem>
                    <SelectItem value="admin" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">Administrator</SelectItem>
                    <SelectItem value="director" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">Direktor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-gray-900 dark:text-white">
                    Sinf
                  </Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => handleChange("class", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Sinfni tanlang" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.role === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-900 dark:text-white">
                    Fan
                  </Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleChange("subject", value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yarilmoqda...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Hisob yaratish
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground text-gray-600 dark:text-gray-400">
              Allaqachon hisobingiz bormi?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-4"
              >
                Tizimga kirish
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;