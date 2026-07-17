import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function AcademicYears() {
  const [years, setYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    branchId: '', name: '', startDate: '', endDate: '', isCurrent: true
  });

  useEffect(() => {
    fetchYears();
    fetchBranches();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await API.get('/academic-years');
      const data = res.data?.data || res.data || [];
      setYears(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 1) {
        setForm(prev => ({ ...prev, branchId: String(data[0].id) }));
      }
    } catch { /* ignore */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    if (!form.startDate || !form.endDate) { toast.error('Start and end dates are required'); return; }
    if (!form.branchId) { toast.error('Please select a branch'); return; }

    try {
      await API.post('/academic-years', form);
      toast.success('Academic year created!');
      setShowForm(false);
      setForm({ branchId: '', name: '', startDate: '', endDate: '', isCurrent: true });
      fetchYears();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create academic year');
    }
  };

  // Helper to auto-fill name based on start date
  const handleStartDateChange = (startDate) => {
    const year = new Date(startDate).getFullYear();
    const name = `${year}-${year + 1}`;
    const endDate = `${year + 1}-03-31`;
    setForm({ ...form, startDate, name, endDate });
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📅 Academic Years</h1><p>Manage academic sessions and current year settings</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Academic Year</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {years.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📅</span><h3>No academic years found</h3><p>Click "+ Add Academic Year" to create one</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Branch</th><th>Start Date</th><th>End Date</th><th>Current</th></tr></thead>
              <tbody>
                {years.map(y => (
                  <tr key={y.id}>
                    <td><strong>{y.name}</strong></td>
                    <td>{y.branch?.name || '-'}</td>
                    <td>{y.startDate}</td>
                    <td>{y.endDate}</td>
                    <td><span className={`badge ${y.isCurrent ? 'badge-green' : 'badge-blue'}`}>{y.isCurrent ? 'Current' : 'Past'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Academic Year Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Add Academic Year</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Branch *</label>
                <select required value={form.branchId} onChange={e => setForm({ ...form, branchId: e.target.value })}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" required value={form.startDate} onChange={e => handleStartDateChange(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input required placeholder="e.g. 2025-2026" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <small style={{ color: 'var(--text-muted)' }}>Auto-filled from start date</small>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={form.isCurrent} onChange={e => setForm({ ...form, isCurrent: e.target.checked })} style={{ width: 'auto', marginRight: '8px' }} />
                  Set as current academic year
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Academic Year</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
