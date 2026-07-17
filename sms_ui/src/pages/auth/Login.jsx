import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import API from '../../api/axios';
import schoolConfig from '../../config/schoolConfig';

const demoAccounts = [
  { role: 'Super Admin', email: 'superadmin@dps.edu.in', icon: '🔑' },
  { role: 'Branch Admin', email: 'branchadmin@dps.edu.in', icon: '🏢' },
  { role: 'Principal', email: 'principal@dps.edu.in', icon: '👨‍💼' },
  { role: 'Teacher', email: 'teacher1@dps.edu.in', icon: '👨‍🏫' },
  { role: 'Student', email: 'student1@dps.edu.in', icon: '🎓' },
  { role: 'Parent', email: 'parent1@dps.edu.in', icon: '👨‍👩‍👧' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getDashboardPath } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleDemoSelect = (account) => {
    setForm({ email: account.email, password: 'Admin@123' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      // Backend wraps response in ApiResponse: { success, message, data: { token, refreshToken, user } }
      const responseData = res.data;
      const payload = responseData?.data || responseData;
      const token = payload?.token || payload?.refreshToken;
      const user = payload?.user;

      if (!token || !user) {
        console.error('Login response:', res.data);
        throw new Error('Invalid response from server');
      }

      // Ensure role is accessible
      const role = user.role?.name || user.role || '';
      console.log('Login successful:', { email: user.email, role });

      login(user, token);

      // Navigate based on role
      switch (role) {
        case 'SUPER_ADMIN':
        case 'ORG_ADMIN':
        case 'BRANCH_ADMIN':
        case 'PRINCIPAL':
        case 'ACCOUNTANT':
        case 'LIBRARIAN':
        case 'HR_MANAGER':
        case 'TRANSPORT_MANAGER':
          navigate('/erp/dashboard');
          break;
        case 'TEACHER':
          navigate('/erp/teacher/dashboard');
          break;
        case 'STUDENT':
          navigate('/erp/student/dashboard');
          break;
        case 'PARENT':
          navigate('/erp/parent/dashboard');
          break;
        default:
          navigate('/erp/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <Link to="/" className="login-logo">
            <span className="logo-icon">{schoolConfig.logo}</span>
            <h1>{schoolConfig.name}</h1>
            <p>{schoolConfig.erpName}</p>
          </Link>
        </div>
        <div className="login-features">
          <h2>Welcome to {schoolConfig.shortName} ERP Portal</h2>
          <p>Access your personalized dashboard</p>
          <ul>
            <li>📊 Real-time analytics & reports</li>
            <li>📱 Mobile responsive design</li>
            <li>🔒 Secure multi-factor authentication</li>
            <li>🏢 Multi-branch management</li>
          </ul>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access the ERP portal</p>
            <button onClick={toggleTheme} className="theme-toggle-login">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          {error && <div className="alert alert-error">❌ {error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your.email@dps.edu.in"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="demo-accounts">
            <p className="demo-title">Quick Demo Login</p>
            <div className="demo-grid">
              {demoAccounts.map((acc, i) => (
                <button key={i} className="demo-btn" onClick={() => handleDemoSelect(acc)}>
                  <span>{acc.icon}</span>
                  <span>{acc.role}</span>
                </button>
              ))}
            </div>
            <p className="demo-hint">Password for all: <code>Admin@123</code></p>
          </div>

          <div className="login-footer">
            <Link to="/">← Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
