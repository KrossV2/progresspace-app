import { useState } from "react";
import { UserCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, UserRole } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

const roles: { value: UserRole; icon: string }[] = [
  { value: 'student', icon: '🎓' },
  { value: 'teacher', icon: '👨‍🏫' },
  { value: 'parent', icon: '👨‍👩‍👧‍👦' },
  { value: 'admin', icon: '⚙️' },
  { value: 'director', icon: '👔' },
];

export function RoleSwitcher() {
  const { user, switchRole } = useUser();
  const { t } = useLanguage();
  
  if (!user) return null;

  const currentRole = roles.find(role => role.value === user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{currentRole?.icon}</span>
          <span className="hidden sm:inline">{t(`role.${user.role}`)}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => switchRole(role.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{role.icon}</span>
            <span>{t(`role.${role.value}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}