import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

// Интерфейсы для типизации переводов
interface LanguageTranslations {
  language: {
    select: string;
  };
  app: {
    name: string;
    subtitle: string;
  };
  nav: {
    profile: string;
    attendance: string;
    grades: string;
    homeworks: string;
    timetables: string;
    behaviors: string;
    notifications: string;
    students: string;
    parents: string;
    classes: string;
    teachers: string;
    regions: string;
    cities: string;
    schools: string;
    subjects: string;
    users: string;
    directors: string;
    grade_requests: string;
    statistics: string;
    files: string;
  };
  role: {
    student: string;
    teacher: string;
    parent: string;
    admin: string;
    director: string;
  };
  menu: {
    main: string;
    management: string;
    academic: string;
    resources: string;
  };
}

type Translations = {
  [key in Language]: LanguageTranslations;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Переводы для всех языков с правильной типизацией
const translations: Translations = {
  uz: {
    language: {
      select: "Tilni tanlang",
    },
    app: {
      name: "Maktab Tizimi",
      subtitle: "Ta'lim platformasi"
    },
    nav: {
      profile: "Profil",
      attendance: "Davomat",
      grades: "Baholar",
      homeworks: "Uy vazifalari",
      timetables: "Dars jadvali",
      behaviors: "Xulq-atvor",
      notifications: "Bildirishnomalar",
      students: "O'quvchilar",
      parents: "Ota-onalar",
      classes: "Sinflar",
      teachers: "O'qituvchilar",
      regions: "Viloyatlar",
      cities: "Shaharlar",
      schools: "Maktablar",
      subjects: "Fanlar",
      users: "Foydalanuvchilar",
      directors: "Direktorlar",
      grade_requests: "Baho so'rovlari",
      statistics: "Statistika",
      files: "Fayllar"
    },
    role: {
      student: "O'quvchi",
      teacher: "O'qituvchi",
      parent: "Ota-ona",
      admin: "Administrator",
      director: "Direktor"
    },
    menu: {
      main: "Asosiy",
      management: "Boshqaruv",
      academic: "O'quv",
      resources: "Resurslar"
    }
  },
  ru: {
    language: {
      select: "Выберите язык",
    },
    app: {
      name: "Школьная Система",
      subtitle: "Образовательная платформа"
    },
    nav: {
      profile: "Профиль",
      attendance: "Посещаемость",
      grades: "Оценки",
      homeworks: "Домашние задания",
      timetables: "Расписание",
      behaviors: "Поведение",
      notifications: "Уведомления",
      students: "Ученики",
      parents: "Родители",
      classes: "Классы",
      teachers: "Учителя",
      regions: "Регионы",
      cities: "Города",
      schools: "Школы",
      subjects: "Предметы",
      users: "Пользователи",
      directors: "Директора",
      grade_requests: "Запросы оценок",
      statistics: "Статистика",
      files: "Файлы"
    },
    role: {
      student: "Ученик",
      teacher: "Учитель",
      parent: "Родитель",
      admin: "Администратор",
      director: "Директор"
    },
    menu: {
      main: "Основное",
      management: "Управление",
      academic: "Учебное",
      resources: "Ресурсы"
    }
  },
  en: {
    language: {
      select: "Select language",
    },
    app: {
      name: "Sinfdosh AI",
      subtitle: "Education Platform"
    },
    nav: {
      profile: "Profile",
      attendance: "Attendance",
      grades: "Grades",
      homeworks: "Homeworks",
      timetables: "Timetables",
      behaviors: "Behaviors",
      notifications: "Notifications",
      students: "Students",
      parents: "Parents",
      classes: "Classes",
      teachers: "Teachers",
      regions: "Regions",
      cities: "Cities",
      schools: "Schools",
      subjects: "Subjects",
      users: "Users",
      directors: "Directors",
      grade_requests: "Grade Requests",
      statistics: "Statistics",
      files: "Files"
    },
    role: {
      student: "Student",
      teacher: "Teacher",
      parent: "Parent",
      admin: "Admin",
      director: "Director"
    },
    menu: {
      main: "Main",
      management: "Management",
      academic: "Academic",
      resources: "Resources"
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Функция для получения перевода с правильной типизацией
  const t = (key: string): string => {
    const keys = key.split('.');
    
    // Начинаем с корневого объекта переводов для текущего языка
    let current: unknown = translations[language];
    
    // Рекурсивно идем по ключам
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Проверяем, что конечное значение - строка
    if (typeof current === 'string') {
      return current;
    }
    
    console.warn(`Translation value is not a string for key: ${key}`);
    return key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}