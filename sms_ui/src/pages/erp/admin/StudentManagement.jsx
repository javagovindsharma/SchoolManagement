import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'MALE',
    dateOfBirth: '', address: '', city: '', state: '', pincode: '', branchId: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchBranches();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students', { params: { search, page: 0, size: 50 } });
      setStudents(res.data?.data?.content || res.data?.data || []);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      // Handle different response formats: {data: [...]}, {success, data: [...]}, or direct array
      const branchData = res.data?.data || res.data || [];
      const list = Array.isArray(branchData) ? branchData : [];
      setBranches(list);
      // Auto-select first branch if only one
      if (list.length === 1 && !form.branchId) {
        setForm(prev => ({...prev, branchId: String(list[0].id)}));
      }
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation - must be 10 digits
    if (form.phone) {
      const cleanPhone = form.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        toast.error('Phone number must be 10-13 digits');
        return;
      }
    }

    // DOB validation - must be at least 3 years old
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
      if (dob > minDate) {
        toast.error('Student must be at least 3 years old');
        return;
      }
    }

    // Email validation
    if (!form.email || !form.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await API.post('/students', form);
      toast.success('Student added successfully!');
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', gender: 'MALE', dateOfBirth: '', address: '', city: '', state: '', pincode: '', branchId: '' });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this student?')) return;
    try {
      await API.delete(`/students/${id}`);
      toast.success('Student deactivated');
      fetchStudents();
    } catch { toast.error('Failed to delete'); }
  };

  // Calculate max DOB date (3 years ago from today)
  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3);
    return d.toISOString().split('T')[0];
  })();

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>🎓 Student Management</h1><p>Manage student registrations and profiles</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Student</button>
      </div>

      <div className="filter-bar">
        <input type="search" placeholder="Search by name, admission no..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchStudents()} />
        <button className="btn btn-primary" onClick={fetchStudents}>Search</button>
      </div>

      {/* Student List */}
      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {students.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🎓</span><h3>No students found</h3><p>Click "+ Add Student" to add a new student</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Adm. No</th><th>Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>DOB</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><code>{s.admissionNo}</code></td>
                    <td><strong>{s.firstName} {s.lastName}</strong></td>
                    <td>{s.user?.email || s.email}</td>
                    <td>{s.user?.phone || s.phone}</td>
                    <td>{s.gender}</td>
                    <td>{s.dateOfBirth}</td>
                    <td><span className={`badge ${s.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{s.status || 'Active'}</span></td>
                    <td><button className="btn-icon" onClick={() => handleDelete(s.id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Student Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">

              {/* Branch Selection */}
              <div className="form-group">
                <label>Branch *</label>
                <select required value={form.branchId} onChange={e => setForm({...form, branchId: e.target.value})}>
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                  ))}
                </select>
                {branches.length === 0 && <small style={{color: 'var(--danger)'}}>No branches found. Please create a branch first.</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input required placeholder="Enter first name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input placeholder="Enter last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="student@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone (10 digits) *</label>
                  <input
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={e => {
                      // Only allow numbers, +, -, spaces
                      const val = e.target.value.replace(/[^0-9+\-\s]/g, '');
                      setForm({...form, phone: val});
                    }}
                    maxLength={13}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select required value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth * (min 3 yrs old)</label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={e => setForm({...form, dateOfBirth: e.target.value})}
                    max={maxDob}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea rows={2} placeholder="Enter full address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input placeholder="e.g. 110001" maxLength={6} value={form.pincode} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setForm({...form, pincode: val});
                  }} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
