import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-72"
      }`}>
        <TopHeader onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}