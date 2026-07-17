export default function ParentDashboard() {
  return (
    <div className="dashboard">
      <div className="welcome-banner parent-banner">
        <div className="welcome-content"><h1>👨‍👩‍👧 Parent Dashboard</h1><p>Monitor your child's academic progress</p></div>
      </div>
      <div className="stats-grid-4">
        {[
          { icon: '✅', label: 'Attendance', value: '94%', color: '#16a34a' },
          { icon: '📝', label: 'Last Exam Score', value: '89%', color: '#2563eb' },
          { icon: '💰', label: 'Fee Status', value: 'Paid', color: '#7c3aed' },
          { icon: '📋', label: 'Pending Tasks', value: '1', color: '#d97706' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{borderTopColor: s.color}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info"><span className="stat-label">{s.label}</span><span className="stat-value" style={{color:s.color}}>{s.value}</span></div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dash-card"><div className="dash-card-header"><h3>👦 Child: Rahul Sharma</h3><span className="badge badge-green">Class 10A</span></div>
          <div className="child-info"><p>Roll No: 15 | Admission No: DPS2020001</p><p>Class Teacher: Mrs. Anita Gupta</p></div>
        </div>
        <div className="dash-card"><div className="dash-card-header"><h3>📢 Recent Notifications</h3></div>
          <div className="notice-list">
            {['PTM scheduled on Sep 1', 'Fee due reminder - Q2', 'Annual Day practice starts Jul 20'].map((n, i) => (
              <div key={i} className="notice-item"><span className="notice-dot" /><span>{n}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
