import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 5000, totalStaff: 250, totalBranches: 3,
    attendanceToday: 92.5, feeCollected: 1250000, pendingFees: 350000,
    upcomingEvents: 4, notifications: 8
  });

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <p className="welcome-greeting">
            👋 Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
          </p>
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p className="welcome-role">{user?.role?.displayName || 'Administrator'} • DPS ERP System</p>
        </div>
        <div className="welcome-quick-stats">
          <div className="quick-stat">
            <span className="qs-number">{stats.totalStudents}</span>
            <span className="qs-label">Students</span>
          </div>
          <div className="quick-stat">
            <span className="qs-number">{stats.totalStaff}</span>
            <span className="qs-label">Staff</span>
          </div>
          <div className="quick-stat">
            <span className="qs-number">{stats.attendanceToday}%</span>
            <span className="qs-label">Attendance</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-4">
        {[
          { icon: '🎓', label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: '+125 this month', color: '#2563eb' },
          { icon: '👨‍🏫', label: 'Total Staff', value: stats.totalStaff, change: '+5 this month', color: '#16a34a' },
          { icon: '💰', label: 'Fee Collected', value: `₹${(stats.feeCollected/100000).toFixed(1)}L`, change: 'This month', color: '#7c3aed' },
          { icon: '📋', label: 'Pending Fees', value: `₹${(stats.pendingFees/100000).toFixed(1)}L`, change: 'Overdue', color: '#dc2626' },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Attendance Overview */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>📊 Attendance Today</h3>
            <span className="badge badge-green">{stats.attendanceToday}%</span>
          </div>
          <div className="attendance-bars">
            {[
              { label: 'Class 12', pct: 95 },
              { label: 'Class 11', pct: 92 },
              { label: 'Class 10', pct: 88 },
              { label: 'Class 9', pct: 91 },
              { label: 'Class 8', pct: 94 },
            ].map((item, i) => (
              <div key={i} className="att-bar-row">
                <span className="att-label">{item.label}</span>
                <div className="att-bar">
                  <div className="att-fill" style={{ width: `${item.pct}%`, background: item.pct > 90 ? '#16a34a' : '#d97706' }} />
                </div>
                <span className="att-pct">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-card">
          <div className="dash-card-header"><h3>⚡ Quick Actions</h3></div>
          <div className="quick-actions-grid">
            {[
              { icon: '🎓', label: 'Add Student', path: '/erp/students' },
              { icon: '👨‍🏫', label: 'Add Staff', path: '/erp/staff' },
              { icon: '💰', label: 'Collect Fee', path: '/erp/fees' },
              { icon: '📢', label: 'Send Notice', path: '/erp/communication' },
              { icon: '📝', label: 'Create Exam', path: '/erp/exams' },
              { icon: '📋', label: 'Admissions', path: '/erp/admissions' },
            ].map((action, i) => (
              <a key={i} href={action.path} className="quick-action-btn">
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dash-card">
          <div className="dash-card-header"><h3>🕒 Recent Activities</h3></div>
          <div className="activity-list">
            {[
              { time: '2 min ago', text: 'New admission application received - Nursery', type: 'admission' },
              { time: '15 min ago', text: 'Fee payment received - ₹15,000 - Rahul Sharma', type: 'fee' },
              { time: '1 hour ago', text: 'Attendance marked by Mrs. Gupta - Class 10A', type: 'attendance' },
              { time: '2 hours ago', text: 'New staff member added - Mr. Anil Kumar', type: 'staff' },
              { time: '3 hours ago', text: 'Exam schedule published - Half Yearly', type: 'exam' },
            ].map((activity, i) => (
              <div key={i} className="activity-item">
                <span className="activity-dot" />
                <div className="activity-content">
                  <p>{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dash-card">
          <div className="dash-card-header"><h3>📅 Upcoming Events</h3></div>
          <div className="events-list-mini">
            {[
              { date: 'Jul 25', title: 'Annual Sports Day', type: 'Sports' },
              { date: 'Aug 05', title: 'Science Exhibition', type: 'Academic' },
              { date: 'Aug 15', title: 'Independence Day', type: 'Cultural' },
              { date: 'Sep 01', title: 'PTM', type: 'Meeting' },
            ].map((event, i) => (
              <div key={i} className="event-mini-item">
                <div className="event-mini-date">{event.date}</div>
                <div className="event-mini-info">
                  <strong>{event.title}</strong>
                  <span>{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Performance (for Super Admin / Org Admin) */}
      <div className="dash-card full-width">
        <div className="dash-card-header"><h3>🏢 Branch Performance</h3></div>
        <div className="branch-performance-grid">
          {[
            { name: 'Main Campus', students: 3000, attendance: 94, feeCollection: 85, toppers: 12 },
            { name: 'East Campus', students: 2000, attendance: 91, feeCollection: 78, toppers: 8 },
            { name: 'South Campus', students: 1500, attendance: 93, feeCollection: 82, toppers: 6 },
          ].map((branch, i) => (
            <div key={i} className="branch-perf-card">
              <h4>🏫 {branch.name}</h4>
              <div className="perf-stats">
                <div><span className="perf-label">Students</span><span className="perf-value">{branch.students}</span></div>
                <div><span className="perf-label">Attendance</span><span className="perf-value">{branch.attendance}%</span></div>
                <div><span className="perf-label">Fee Collection</span><span className="perf-value">{branch.feeCollection}%</span></div>
                <div><span className="perf-label">Top Rankers</span><span className="perf-value">{branch.toppers}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
