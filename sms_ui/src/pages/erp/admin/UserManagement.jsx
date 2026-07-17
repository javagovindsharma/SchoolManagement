import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

const ROLES = [
  { name: 'SUPER_ADMIN', label: 'Super Admin' },
  { name: 'ORG_ADMIN', label: 'Organization Admin' },
  { name: 'BRANCH_ADMIN', label: 'Branch Admin' },
  { name: 'PRINCIPAL', label: 'Principal' },
  { name: 'TEACHER', label: 'Teacher' },
  { name: 'STUDENT', label: 'Student' },
  { name: 'PARENT', label: 'Parent' },
  { name: 'ACCOUNTANT', label: 'Accountant' },
  { name: 'LIBRARIAN', label: 'Librarian' },
  { name: 'HR_MANAGER', label: 'HR Manager' },
  { name: 'TRANSPORT_MANAGER', label: 'Transport Manager' },
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: 'Admin@123',
    roleId: '', branchId: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users', { params: { search, page: 0, size: 50 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  };

  const fetchRoles = async () => {
    // Use static roles list since we know them
    setRoles(ROLES);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName) { toast.error('First name is required'); return; }
    if (!form.email || !form.email.includes('@')) { toast.error('Valid email is required'); return; }
    if (!form.roleId) { toast.error('Please select a role'); return; }
    if (!form.password || form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    // Phone validation
    if (form.phone) {
      const cleanPhone = form.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) { toast.error('Phone must be exactly 10 digits'); return; }
    }

    try {
      await API.post('/users', form);
      toast.success('User created successfully!');
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: 'Admin@123', roleId: '', branchId: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success('User deactivated');
      fetchUsers();
    } catch { toast.error('Failed to deactivate user'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>👥 User Management</h1><p>Manage all system users across branches</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add User</button>
      </div>

      <div className="filter-bar">
        <input type="search" placeholder="Search by name or email..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchUsers()} />
        <button className="btn btn-primary" onClick={fetchUsers}>Search</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {users.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">👥</span><h3>No users found</h3><p>Click "+ Add User" to create a new user</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Branch</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.firstName} {u.lastName}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td><span className="badge badge-blue">{u.role?.displayName || u.role?.name || '-'}</span></td>
                    <td>{u.branch?.name || 'All'}</td>
                    <td><span className={`badge ${u.isActive !== false ? 'badge-green' : 'badge-red'}`}>{u.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="btn-icon" onClick={() => handleDelete(u.id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input required placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="user@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone (10 digits)</label>
                  <input
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 10) setForm({...form, phone: val});
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select required value={form.roleId} onChange={e => setForm({...form, roleId: e.target.value})}>
                    <option value="">Select Role</option>
                    {roles.map((r, i) => (
                      <option key={r.name} value={i + 1}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select value={form.branchId} onChange={e => setForm({...form, branchId: e.target.value})}>
                    <option value="">All Branches</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  minLength={6}
                />
                <small style={{color: 'var(--text-muted)'}}>Default: Admin@123</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
