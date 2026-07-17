import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', branchType: 'BRANCH', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    principalName: '', establishedYear: '', studentCapacity: ''
  });

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load branches'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.code) {
      toast.error('Branch name and code are required');
      return;
    }

    if (!form.phone || form.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      await API.post('/branches', form);
      toast.success('Branch created successfully!');
      setShowForm(false);
      setForm({ name: '', code: '', branchType: 'BRANCH', email: '', phone: '', address: '', city: '', state: '', pincode: '', principalName: '', establishedYear: '', studentCapacity: '' });
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create branch');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this branch?')) return;
    try {
      await API.delete(`/branches/${id}`);
      toast.success('Branch deactivated');
      fetchBranches();
    } catch { toast.error('Failed to delete branch'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div>
          <h1>🏢 Branch Management</h1>
          <p>Manage all school branches under the organization</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Branch</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {branches.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🏢</span><h3>No branches found</h3><p>Click "+ Add Branch" to create your first branch</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Principal</th>
                  <th>Phone</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.name}</strong></td>
                    <td><code>{b.code}</code></td>
                    <td><span className="badge badge-blue">{b.branchType || 'BRANCH'}</span></td>
                    <td>{b.city}</td>
                    <td>{b.principalName || '-'}</td>
                    <td>{b.phone || '-'}</td>
                    <td>{b.studentCapacity || '-'}</td>
                    <td><span className={`badge ${b.isActive !== false ? 'badge-green' : 'badge-red'}`}>{b.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn-icon" onClick={() => handleDelete(b.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Branch Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Branch</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Branch Name *</label>
                  <input required placeholder="e.g. DPS Main Campus" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Branch Code *</label>
                  <input required placeholder="e.g. DPS-MAIN" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Branch Type</label>
                  <select value={form.branchType} onChange={e => setForm({...form, branchType: e.target.value})}>
                    <option value="MAIN">Main Campus</option>
                    <option value="BRANCH">Branch</option>
                    <option value="SATELLITE">Satellite</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Principal Name</label>
                  <input placeholder="e.g. Dr. Rajesh Kumar" value={form.principalName} onChange={e => setForm({...form, principalName: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="branch@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone (10 digits) *</label>
                  <input
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    maxLength={10}
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

              <div className="form-group">
                <label>Address</label>
                <textarea rows={2} placeholder="Full address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input required placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input placeholder="110001" maxLength={6} value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value.replace(/[^0-9]/g, '')})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Established Year</label>
                  <input type="number" placeholder="e.g. 2005" value={form.establishedYear} onChange={e => setForm({...form, establishedYear: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Student Capacity</label>
                  <input type="number" placeholder="e.g. 2000" value={form.studentCapacity} onChange={e => setForm({...form, studentCapacity: e.target.value})} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
