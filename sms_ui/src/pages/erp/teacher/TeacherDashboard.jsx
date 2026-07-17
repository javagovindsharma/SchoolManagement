export default function TeacherDashboard() {
  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>👨‍🏫 Teacher Dashboard</h1>
          <p>Welcome back! Here's your day at a glance.</p>
        </div>
      </div>
      <div className="stats-grid-4">
        {[
          { icon: '📚', label: 'My Classes', value: '4', color: '#2563eb' },
          { icon: '🎓', label: 'Total Students', value: '160', color: '#16a34a' },
          { icon: '✅', label: 'Attendance Today', value: '94%', color: '#7c3aed' },
          { icon: '📋', label: 'Pending Tasks', value: '3', color: '#d97706' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{borderTopColor: s.color}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info"><span className="stat-label">{s.label}</span><span className="stat-value" style={{color:s.color}}>{s.value}</span></div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-card-header"><h3>📅 Today's Schedule</h3></div>
          <div className="schedule-list">
            {[
              { time: '8:00 - 8:40', class: '10A', subject: 'Mathematics' },
              { time: '8:40 - 9:20', class: '10B', subject: 'Mathematics' },
              { time: '10:00 - 10:40', class: '11A', subject: 'Applied Math' },
              { time: '11:20 - 12:00', class: '9C', subject: 'Mathematics' },
            ].map((p, i) => (
              <div key={i} className="schedule-item"><span className="schedule-time">{p.time}</span><span className="schedule-detail">{p.class} - {p.subject}</span></div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header"><h3>📋 Pending Tasks</h3></div>
          <div className="task-list">
            {['Mark attendance - Class 10A', 'Submit marks - Unit Test 2', 'Upload homework - Class 9C'].map((t, i) => (
              <div key={i} className="task-item"><span className="task-dot" /><span>{t}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
