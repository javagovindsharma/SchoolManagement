import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import schoolConfig from '../config/schoolConfig';

const menuConfig = {
  SUPER_ADMIN: [
    { section: 'Main', items: [
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/branches', icon: '🏢', label: 'Branches' },
      { path: '/erp/users', icon: '👥', label: 'Users' },
    ]},
    { section: 'Academic', items: [
      { path: '/erp/students', icon: '🎓', label: 'Students' },
      { path: '/erp/staff', icon: '👨‍🏫', label: 'Staff' },
      { path: '/erp/classes', icon: '🏫', label: 'Classes' },
      { path: '/erp/subjects', icon: '📚', label: 'Subjects' },
      { path: '/erp/academic-years', icon: '📅', label: 'Academic Years' },
    ]},
    { section: 'Modules', items: [
      { path: '/erp/fees', icon: '💰', label: 'Fees' },
      { path: '/erp/exams', icon: '📝', label: 'Exams' },
      { path: '/erp/hr', icon: '🧑‍💼', label: 'HR & Payroll' },
      { path: '/erp/transport', icon: '🚌', label: 'Transport' },
      { path: '/erp/library', icon: '📖', label: 'Library' },
      { path: '/erp/inventory', icon: '📦', label: 'Inventory' },
      { path: '/erp/communication', icon: '📢', label: 'Communication' },
      { path: '/erp/admissions', icon: '📋', label: 'Admissions' },
    ]},
  ],
  ORG_ADMIN: [
    { section: 'Main', items: [
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/branches', icon: '🏢', label: 'Branches' },
      { path: '/erp/users', icon: '👥', label: 'Users' },
    ]},
    { section: 'Academic', items: [
      { path: '/erp/students', icon: '🎓', label: 'Students' },
      { path: '/erp/staff', icon: '👨‍🏫', label: 'Staff' },
      { path: '/erp/classes', icon: '🏫', label: 'Classes' },
      { path: '/erp/subjects', icon: '📚', label: 'Subjects' },
    ]},
    { section: 'Modules', items: [
      { path: '/erp/fees', icon: '💰', label: 'Fees' },
      { path: '/erp/exams', icon: '📝', label: 'Exams' },
      { path: '/erp/hr', icon: '🧑‍💼', label: 'HR & Payroll' },
      { path: '/erp/communication', icon: '📢', label: 'Communication' },
      { path: '/erp/admissions', icon: '📋', label: 'Admissions' },
    ]},
  ],
  BRANCH_ADMIN: [
    { section: 'Main', items: [
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/students', icon: '🎓', label: 'Students' },
      { path: '/erp/staff', icon: '👨‍🏫', label: 'Staff' },
      { path: '/erp/classes', icon: '🏫', label: 'Classes' },
      { path: '/erp/subjects', icon: '📚', label: 'Subjects' },
    ]},
    { section: 'Modules', items: [
      { path: '/erp/fees', icon: '💰', label: 'Fees' },
      { path: '/erp/exams', icon: '📝', label: 'Exams' },
      { path: '/erp/transport', icon: '🚌', label: 'Transport' },
      { path: '/erp/library', icon: '📖', label: 'Library' },
      { path: '/erp/communication', icon: '📢', label: 'Communication' },
      { path: '/erp/admissions', icon: '📋', label: 'Admissions' },
    ]},
  ],
  PRINCIPAL: [
    { section: 'Main', items: [
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/students', icon: '🎓', label: 'Students' },
      { path: '/erp/staff', icon: '👨‍🏫', label: 'Staff' },
      { path: '/erp/classes', icon: '🏫', label: 'Classes' },
    ]},
    { section: 'Modules', items: [
      { path: '/erp/exams', icon: '📝', label: 'Exams' },
      { path: '/erp/fees', icon: '💰', label: 'Fee Reports' },
      { path: '/erp/communication', icon: '📢', label: 'Communication' },
    ]},
  ],
  TEACHER: [
    { section: 'Teaching', items: [
      { path: '/erp/teacher/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/teacher/attendance', icon: '✅', label: 'Attendance' },
      { path: '/erp/teacher/marks', icon: '📝', label: 'Marks Entry' },
      { path: '/erp/teacher/schedule', icon: '📅', label: 'My Schedule' },
      { path: '/erp/teacher/assignments', icon: '📋', label: 'Assignments' },
    ]},
  ],
  STUDENT: [
    { section: 'My Portal', items: [
      { path: '/erp/student/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/student/attendance', icon: '✅', label: 'Attendance' },
      { path: '/erp/student/results', icon: '📝', label: 'Results' },
      { path: '/erp/student/schedule', icon: '📅', label: 'Timetable' },
      { path: '/erp/student/assignments', icon: '📋', label: 'Assignments' },
    ]},
  ],
  PARENT: [
    { section: 'My Children', items: [
      { path: '/erp/parent/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/erp/parent/attendance', icon: '✅', label: 'Attendance' },
      { path: '/erp/parent/fees', icon: '💰', label: 'Fees' },
      { path: '/erp/parent/results', icon: '📝', label: 'Results' },
    ]},
  ],
  ACCOUNTANT: [
    { section: 'Finance', items: [
      { path: '/erp/fees', icon: '💰', label: 'Fee Management' },
      { path: '/erp/dashboard', icon: '📊', label: 'Reports' },
    ]},
  ],
  LIBRARIAN: [
    { section: 'Library', items: [
      { path: '/erp/library', icon: '📖', label: 'Library Management' },
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
    ]},
  ],
  HR_MANAGER: [
    { section: 'HR', items: [
      { path: '/erp/hr', icon: '🧑‍💼', label: 'HR & Payroll' },
      { path: '/erp/staff', icon: '👨‍🏫', label: 'Staff' },
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
    ]},
  ],
  TRANSPORT_MANAGER: [
    { section: 'Transport', items: [
      { path: '/erp/transport', icon: '🚌', label: 'Transport' },
      { path: '/erp/dashboard', icon: '📊', label: 'Dashboard' },
    ]},
  ],
};

export default function ERPLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const roleName = user?.role?.name || user?.role || 'TEACHER';
  const menu = menuConfig[roleName] || menuConfig.TEACHER;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`erp-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="erp-sidebar">
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand">
              <span className="brand-icon">{schoolConfig.logo}</span>
              <span className="brand-text">{schoolConfig.erpShortName}</span>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menu.map((group, gi) => (
            <div key={gi} className="nav-section">
              {!collapsed && <span className="nav-section-title">{group.section}</span>}
              {group.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn" title="Logout">
            <span className="nav-icon">🚪</span>
            {!collapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="erp-main">
        {/* Top Header */}
        <header className="erp-topbar">
          <div className="topbar-left">
            <h2 className="page-title">{getPageTitle(pathname)}</h2>
          </div>
          <div className="topbar-right">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-info">
              <span className="user-avatar">{user?.firstName?.[0] || '?'}</span>
              <div className="user-details">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">{roleName.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="erp-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || 'Dashboard';
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
