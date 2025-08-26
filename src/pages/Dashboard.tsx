import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickCards } from "@/components/dashboard/QuickCards";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Today's Schedule - Takes up 3 columns on large screens */}
        <div className="lg:col-span-3">
          <TodaySchedule />
        </div>

        {/* Quick Cards - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <QuickCards />
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-semibold text-lg mb-4 text-card-foreground">So'nggi faoliyat</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Matematika uy vazifasi topshirildi</p>
                <p className="text-xs text-muted-foreground">30 daqiqa oldin</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ingliz tili darsiga qatnashildi</p>
                <p className="text-xs text-muted-foreground">2 soat oldin</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Fizika fanidan yangi material</p>
                <p className="text-xs text-muted-foreground">4 soat oldin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-semibold text-lg mb-4 text-card-foreground">Haftalik progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Darslar</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Uy vazifalari</span>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-success h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Testlar</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-semibold text-lg mb-4 text-card-foreground">Yaqinlashayotgan hodisalar</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Matematika imtihoni</p>
                <p className="text-xs text-muted-foreground">Ertaga, 09:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="w-3 h-3 rounded-full bg-warning mt-1"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ingliz tili projekti</p>
                <p className="text-xs text-muted-foreground">3 kun ichida</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="w-3 h-3 rounded-full bg-success mt-1"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ota-onalar yig'ilishi</p>
                <p className="text-xs text-muted-foreground">Keyingi hafta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}