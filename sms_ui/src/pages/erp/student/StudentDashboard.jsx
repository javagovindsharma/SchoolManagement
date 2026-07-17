export default function StudentDashboard() {
  return (
    <div className="dashboard">
      <div className="welcome-banner student-banner">
        <div className="welcome-content"><h1>🎓 Student Dashboard</h1><p>Welcome back! Track your academic progress.</p></div>
      </div>
      <div className="stats-grid-4">
        {[
          { icon: '✅', label: 'Attendance', value: '94%', color: '#16a34a' },
          { icon: '📝', label: 'CGPA', value: '9.2', color: '#2563eb' },
          { icon: '📚', label: 'Assignments Due', value: '2', color: '#d97706' },
          { icon: '🏆', label: 'Class Rank', value: '#5', color: '#7c3aed' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{borderTopColor: s.color}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info"><span className="stat-label">{s.label}</span><span className="stat-value" style={{color:s.color}}>{s.value}</span></div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dash-card"><div className="dash-card-header"><h3>📅 Today's Timetable</h3></div>
          <div className="schedule-list">
            {['8:00 - English', '9:00 - Mathematics', '10:00 - Science', '11:00 - Hindi', '12:00 - Social Studies'].map((s, i) => (
              <div key={i} className="schedule-item"><span>{s}</span></div>
            ))}
          </div>
        </div>
        <div className="dash-card"><div className="dash-card-header"><h3>📢 Notices</h3></div>
          <div className="notice-list">
            {['PTM on Sep 1 - Parents requested', 'Sports Day - Jul 25 - All students', 'Submit project by Aug 10'].map((n, i) => (
              <div key={i} className="notice-item"><span className="notice-dot" /><span>{n}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
