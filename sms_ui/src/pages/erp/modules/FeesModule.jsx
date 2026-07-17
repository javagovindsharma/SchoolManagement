import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function FeesModule() {
  const [tab, setTab] = useState('payments');
  const [payments, setPayments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    branchId: '', classId: '', studentId: '', amountPaid: '', paymentMethod: 'CASH', remarks: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchBranches();
    fetchClasses();
  }, []);

  // When branch or class changes, fetch students
  useEffect(() => {
    if (form.branchId || form.classId) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [form.branchId, form.classId]);

  const fetchPayments = async () => {
    try {
      const res = await API.get('/fees/payments', { params: { page: 0, size: 50 } });
      setPayments(res.data?.data?.content || res.data?.data || []);
    } catch { toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get('/branches');
      const data = res.data?.data || res.data || [];
      setBranches(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get('/classes');
      const data = res.data?.data || res.data || [];
      setClasses(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  };

  const fetchStudents = async () => {
    try {
      const params = { page: 0, size: 200 };
      if (form.classId) params.classId = form.classId;
      const res = await API.get('/students', { params });
      const data = res.data?.data?.content || res.data?.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch { setStudents([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId) { toast.error('Please select a student'); return; }
    if (!form.amountPaid || Number(form.amountPaid) <= 0) { toast.error('Enter a valid amount'); return; }

    try {
      await API.post('/fees/payments', {
        studentId: form.studentId,
        branchId: form.branchId,
        amountPaid: form.amountPaid,
        totalAmount: form.amountPaid,
        paymentMethod: form.paymentMethod,
        remarks: form.remarks
      });
      toast.success('Fee collected successfully!');
      setShowForm(false);
      setForm({ branchId: '', classId: '', studentId: '', amountPaid: '', paymentMethod: 'CASH', remarks: '' });
      fetchPayments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to collect fee'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>💰 Fee Management</h1><p>Manage fee structures, payments, and reports</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Collect Fee</button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
        <button className={`tab-btn ${tab === 'structure' ? 'active' : ''}`} onClick={() => setTab('structure')}>Fee Structure</button>
        <button className={`tab-btn ${tab === 'due' ? 'active' : ''}`} onClick={() => setTab('due')}>Due/Defaulters</button>
        <button className={`tab-btn ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>Reports</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {payments.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">💰</span><h3>No payments found</h3><p>Click "+ Collect Fee" to record a payment</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Receipt #</th><th>Student</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td><code>{p.receiptNumber || `#${p.id}`}</code></td>
                    <td>{p.student?.firstName} {p.student?.lastName}</td>
                    <td><strong>₹{p.amountPaid}</strong></td>
                    <td>{p.paymentMethod}</td>
                    <td>{p.paymentDate}</td>
                    <td><span className={`badge ${p.paymentStatus === 'COMPLETED' ? 'badge-green' : 'badge-yellow'}`}>{p.paymentStatus || 'COMPLETED'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Collect Fee Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Collect Fee</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">

              {/* Branch Selection */}
              <div className="form-group">
                <label>Branch *</label>
                <select required value={form.branchId} onChange={e => setForm({...form, branchId: e.target.value, studentId: ''})}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              {/* Class Selection */}
              <div className="form-group">
                <label>Class</label>
                <select value={form.classId} onChange={e => setForm({...form, classId: e.target.value, studentId: ''})}>
                  <option value="">All Classes</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} {c.section ? `- ${c.section}` : ''}</option>)}
                </select>
              </div>

              {/* Student Selection (populated based on branch/class) */}
              <div className="form-group">
                <label>Student *</label>
                <select required value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}>
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} {s.admissionNo ? `(${s.admissionNo})` : ''}
                    </option>
                  ))}
                </select>
                {students.length === 0 && form.branchId && (
                  <small style={{color: 'var(--text-muted)'}}>No students found for selected branch/class</small>
                )}
              </div>

              {/* Amount & Payment Method */}
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter amount"
                    value={form.amountPaid}
                    onChange={e => setForm({...form, amountPaid: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method *</label>
                  <select required value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div className="form-group">
                <label>Remarks</label>
                <input placeholder="e.g. Tuition fee for July 2025" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Collect Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
