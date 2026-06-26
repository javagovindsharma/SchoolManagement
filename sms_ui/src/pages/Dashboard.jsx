import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { label: 'Total Students', value: 120, color: '',       icon: '🎓' },
    { label: 'Total Teachers', value: 15,  color: 'green',  icon: '👨‍🏫' },
    { label: 'Total Classes',  value: 8,   color: 'yellow', icon: '🏫' },
    { label: 'Total Grades',   value: 340, color: 'red',    icon: '📊' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="badge badge-blue">{new Date().toDateString()}</span>
      </div>

      <div className="grid-4" style={{ marginBottom: '30px' }}>
        {stats.map(card => (
          <div key={card.label} className={`card stat-card ${card.color}`}>
            <div className="card-title">{card.icon} {card.label}</div>
            <div className="card-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>📋 Recent Activity</h3>
          <p style={{ marginTop: '12px', color: '#888' }}>No recent activity yet.</p>
        </div>
        <div className="card">
          <h3>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <Link to="/students/add" className="btn btn-primary btn-sm">➕ Add Student</Link>
            <Link to="/teachers/add" className="btn btn-success btn-sm">➕ Add Teacher</Link>
          </div>
        </div>
      </div>
    </div>
  );
}