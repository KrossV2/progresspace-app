import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickCards } from "@/components/dashboard/QuickCards";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { useState, useEffect } from "react";
import "@/styles/dashboard.css"; // ← измените на .css


// Типы для пропсов
interface ActivityItemProps {
  icon: string;
  title: string;
  time: string;
  color: "success" | "primary" | "warning" | "info";
}

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: "primary" | "success" | "warning";
  icon: string;
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
    <div className="dashboard-page smooth-appear">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="schedule-column">
          <TodaySchedule />
        </div>
        
        <div className="quick-cards-column">
          <QuickCards />
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="dashboard-content-grid">
        {/* Recent Activity */}
        <div className="dashboard-card card-lift">
          <div className="card-header">
            <h3 className="card-title">
              <div className="status-dot dot-success"></div>
              So'nggi faoliyat
            </h3>
            <div className="badge badge-new">Yangi</div>
          </div>
          <div className="activity-feed">
            <ActivityItem 
              icon="📚"
              title="Matematika uy vazifasi topshirildi"
              time="30 daqiqa oldin"
              color="success"
            />
            <ActivityItem 
              icon="🎓"
              title="Ingliz tili darsiga qatnashildi"
              time="2 soat oldin"
              color="primary"
            />
            <ActivityItem 
              icon="⚡"
              title="Fizika fanidan yangi material"
              time="4 soat oldin"
              color="warning"
            />
            <ActivityItem 
              icon="🧪"
              title="Kimyo laboratoriya ishi"
              time="Kun oldin"
              color="info"
            />
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="dashboard-card">
          <h3 className="card-title">
            <div className="status-dot dot-pulse"></div>
            Haftalik progress
          </h3>
          <div className="progress-section">
            <ProgressBar 
              label="Darslar" 
              percentage={85} 
              color="primary"
              icon="📖"
            />
            <ProgressBar 
              label="Uy vazifalari" 
              percentage={92} 
              color="success"
              icon="✏️"
            />
            <ProgressBar 
              label="Testlar" 
              percentage={78} 
              color="primary"
              icon="📝"
            />
            <ProgressBar 
              label="Loyihalar" 
              percentage={65} 
              color="warning"
              icon="🚀"
            />
          </div>
          
          {/* Weekly Streak */}
          <div className="streak-widget">
            <div className="streak-content">
              <div className="streak-text">
                <p>Ketma-ket kelish</p>
                <span>12 kun davomiy</span>
              </div>
              <div className="streak-emoji">🔥</div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <div className="status-dot dot-warning"></div>
              Yaqinlashayotgan hodisalar
            </h3>
            <div className="badge badge-count">3 ta yangi</div>
          </div>
          <div className="events-list">
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
          </div>
        </div>
      </div>

      {/* Motivational Widget */}
      {mounted && (
        <div className="motivation-widget">
          <div className="motivation-content">
            <div className="motivation-text">
              <h3>Bugun ajoyib ish qildingiz! 🎉</h3>
              <p>5 ta vazifani bajarildi, 3 ta darsga qatnashildi. Davom eting!</p>
            </div>
            <div className="motivation-emoji">🌟</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, time, color }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className="activity-icon">{icon}</div>
      <div className="activity-content">
        <p className="activity-text">{title}</p>
        <p className="activity-time">{time}</p>
      </div>
      <div className={`activity-status status-${color}`}></div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ label, percentage, color, icon }: ProgressBarProps) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span className="progress-label">
          {icon} {label}
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-track">
        <div 
          className={`progress-fill fill-${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Event Item Component
function EventItem({ title, time, priority, type, subject }: EventItemProps) {
  const getTypeIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      exam: "📝",
      project: "🚀", 
      meeting: "👥",
      lab: "🧪"
    };
    return icons[eventType] || "📅";
  };

  return (
    <div className={`event-item event-${priority}`}>
      <div className="event-icon">{getTypeIcon(type)}</div>
      <div className="event-content">
        <p className="event-title">{title}</p>
        <p className="event-time">{time}</p>
        <span className="event-subject">
          {subject}
        </span>
      </div>
    </div>
  );
}