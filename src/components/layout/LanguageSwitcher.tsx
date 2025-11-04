import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";

// Типизация для объекта языка
interface LanguageOption {
  code: Language;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  flag: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { 
    code: 'uz', 
    name: {
      uz: 'O\'zbekcha',
      ru: 'Узбекский',
      en: 'Uzbek'
    }, 
    flag: '🇺🇿',
    nativeName: 'O\'zbekcha'
  },
  { 
    code: 'ru', 
    name: {
      uz: 'Ruscha',
      ru: 'Русский',
      en: 'Russian'
    }, 
    flag: '🇷🇺',
    nativeName: 'Русский'
  },
  { 
    code: 'en', 
    name: {
      uz: 'Inglizcha',
      ru: 'Английский',
      en: 'English'
    }, 
    flag: '🇺🇸',
    nativeName: 'English'
  },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const currentLang = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang?.flag}</span>
          <span className="hidden md:inline">
            {currentLang?.name[language]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          {t('language.select')}
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">
                  {lang.name[language]}
                </span>
              </div>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}