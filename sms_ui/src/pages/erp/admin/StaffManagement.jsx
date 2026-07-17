import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Science',
  'Computer Science', 'Physical Education', 'Art & Craft', 'Music',
  'Sanskrit', 'Commerce', 'Economics', 'Psychology', 'Administration',
  'Library', 'Transport', 'Accounts', 'Housekeeping', 'Security'
];

const DESIGNATIONS = [
  'Principal', 'Vice Principal', 'Head of Department (HOD)',
  'PGT (Post Graduate Teacher)', 'TGT (Trained Graduate Teacher)',
  'PRT (Primary Teacher)', 'NTT (Nursery Teacher)',
  'Lab Assistant', 'Librarian', 'Sports Coach',
  'Counselor', 'Accountant', 'Clerk', 'Peon', 'Security Guard',
  'Driver', 'Receptionist', 'IT Administrator'
];

const QUALIFICATIONS = [
  'Ph.D', 'M.Phil', 'M.Ed', 'M.A', 'M.Sc', 'M.Com', 'MBA', 'MCA',
  'B.Ed', 'B.A', 'B.Sc', 'B.Com', 'BCA', 'B.Tech',
  'D.El.Ed', 'NTT Diploma', 'ITI', '12th Pass', '10th Pass'
];

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: 'Teacher@123',
    designation: '', department: '', qualification: '', specialization: '',
    branchId: ''
  });

  useEffect(() => {
    fetchStaff();
    fetchBranches();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get('/teachers', { params: { search, page: 0, size: 50 } });
      setStaff(res.data?.data?.content || res.data?.data || []);
    } catch { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 1 && !form.branchId) {
        setForm(prev => ({...prev, branchId: String(data[0].id)}));
      }
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!form.firstName.trim()) { toast.error('First name is required'); return; }
    if (!form.email || !form.email.includes('@')) { toast.error('Valid email is required'); return; }

    // Phone - exactly 10 digits
    if (!form.phone || form.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    // Department required
    if (!form.department) { toast.error('Department is required'); return; }

    // Designation required
    if (!form.designation) { toast.error('Designation is required'); return; }

    // Qualification required
    if (!form.qualification) { toast.error('Qualification is required'); return; }

    try {
      await API.post('/teachers', form);
      toast.success('Staff member added successfully!');
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', password: 'Teacher@123', designation: '', department: '', qualification: '', specialization: '', branchId: '' });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add staff');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;
    try {
      await API.delete(`/teachers/${id}`);
      toast.success('Staff deactivated');
      fetchStaff();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>👨‍🏫 Staff Management</h1><p>Manage teaching and non-teaching staff</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Staff</button>
      </div>

      <div className="filter-bar">
        <input type="search" placeholder="Search staff..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchStaff()} />
        <button className="btn btn-primary" onClick={fetchStaff}>Search</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {staff.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">👨‍🏫</span><h3>No staff found</h3><p>Click "+ Add Staff" to add new staff member</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Employee ID</th><th>Designation</th><th>Department</th><th>Qualification</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.user?.firstName || ''} {s.user?.lastName || ''}</strong></td>
                    <td>{s.user?.email}</td>
                    <td>{s.user?.phone || '-'}</td>
                    <td><code>{s.employeeId}</code></td>
                    <td>{s.designation}</td>
                    <td>{s.department}</td>
                    <td>{s.qualification}</td>
                    <td><span className={`badge ${s.isActive !== false ? 'badge-green' : 'badge-red'}`}>{s.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="btn-icon" onClick={() => handleDelete(s.id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Add New Staff</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">

              {/* Branch */}
              <div className="form-group">
                <label>Branch *</label>
                <select required value={form.branchId} onChange={e => setForm({...form, branchId: e.target.value})}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                </select>
              </div>

              {/* Name */}
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

              {/* Contact */}
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="staff@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Mobile Number * (10 digits)</label>
                  <input
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 10) setForm({...form, phone: val});
                    }}
                  />
                  {form.phone && form.phone.length !== 10 && (
                    <small style={{color: 'var(--danger)'}}>Must be exactly 10 digits</small>
                  )}
                </div>
              </div>

              {/* Department & Designation */}
              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select required value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Designation *</label>
                  <select required value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}>
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Qualification & Specialization */}
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification *</label>
                  <select required value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})}>
                    <option value="">Select Qualification</option>
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input placeholder="e.g. Organic Chemistry, Algebra" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <small style={{color: 'var(--text-muted)'}}>Default: Teacher@123</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
