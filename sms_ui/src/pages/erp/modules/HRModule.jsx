import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

const LEAVE_TYPES = [
  { code: 'CL', name: 'Casual Leave', maxDays: 12, paid: true },
  { code: 'SL', name: 'Sick Leave', maxDays: 10, paid: true },
  { code: 'EL', name: 'Earned Leave', maxDays: 30, paid: true },
  { code: 'ML', name: 'Maternity Leave', maxDays: 180, paid: true },
  { code: 'PL', name: 'Paternity Leave', maxDays: 15, paid: true },
  { code: 'UL', name: 'Unpaid Leave', maxDays: 30, paid: false },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function HRModule() {
  const [tab, setTab] = useState('employees');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payroll state
  const [payrollMonth, setPayrollMonth] = useState(new Date().getMonth() + 1);
  const [payrollYear, setPayrollYear] = useState(new Date().getFullYear());
  const [payrollData, setPayrollData] = useState([]);
  const [showGeneratePayroll, setShowGeneratePayroll] = useState(false);

  // Leave state
  const [leaveApplications, setLeaveApplications] = useState([
    { id: 1, staff: 'Anita Gupta', department: 'Mathematics', leaveType: 'CL', fromDate: '2025-07-20', toDate: '2025-07-22', days: 3, reason: 'Family function', status: 'PENDING' },
    { id: 2, staff: 'Raj Kumar', department: 'Science', leaveType: 'SL', fromDate: '2025-07-15', toDate: '2025-07-16', days: 2, reason: 'Medical checkup', status: 'APPROVED' },
    { id: 3, staff: 'Meena Sharma', department: 'English', leaveType: 'EL', fromDate: '2025-08-01', toDate: '2025-08-10', days: 10, reason: 'Vacation', status: 'PENDING' },
  ]);
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ staffId: '', leaveType: 'CL', fromDate: '', toDate: '', reason: '' });

  // Recruitment state
  const [openings, setOpenings] = useState([
    { id: 1, title: 'PGT Physics', department: 'Science', vacancies: 2, experience: '5+ years', qualification: 'M.Sc Physics + B.Ed', status: 'OPEN', applications: 12 },
    { id: 2, title: 'TGT Mathematics', department: 'Mathematics', vacancies: 1, experience: '3+ years', qualification: 'B.Sc Maths + B.Ed', status: 'OPEN', applications: 8 },
    { id: 3, title: 'Librarian', department: 'Library', vacancies: 1, experience: '3+ years', qualification: 'M.Lib', status: 'CLOSED', applications: 5 },
  ]);
  const [showAddOpening, setShowAddOpening] = useState(false);
  const [openingForm, setOpeningForm] = useState({ title: '', department: '', vacancies: 1, experience: '', qualification: '', description: '' });

  // Staff Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffAttendance, setStaffAttendance] = useState([]);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get('/teachers', { params: { page: 0, size: 100 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setStaff(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  // Generate Payroll
  const handleGeneratePayroll = () => {
    if (staff.length === 0) {
      // Demo payroll data
      setPayrollData([
        { id: 1, name: 'Anita Gupta', empId: 'EMP001', designation: 'PGT', basic: 45000, hra: 9000, da: 4500, ta: 2000, gross: 60500, pf: 5400, tds: 3000, esi: 450, deductions: 8850, net: 51650, status: 'PENDING' },
        { id: 2, name: 'Raj Kumar', empId: 'EMP002', designation: 'TGT', basic: 38000, hra: 7600, da: 3800, ta: 2000, gross: 51400, pf: 4560, tds: 2000, esi: 380, deductions: 6940, net: 44460, status: 'PENDING' },
        { id: 3, name: 'Meena Sharma', empId: 'EMP003', designation: 'PRT', basic: 32000, hra: 6400, da: 3200, ta: 2000, gross: 43600, pf: 3840, tds: 1500, esi: 320, deductions: 5660, net: 37940, status: 'PENDING' },
      ]);
    } else {
      setPayrollData(staff.map((s, i) => {
        const basic = 35000 + (i * 5000);
        const hra = basic * 0.2;
        const da = basic * 0.1;
        const ta = 2000;
        const gross = basic + hra + da + ta;
        const pf = basic * 0.12;
        const tds = gross > 50000 ? gross * 0.05 : 0;
        const esi = basic < 21000 ? basic * 0.0075 : 0;
        const deductions = pf + tds + esi;
        const net = gross - deductions;
        return {
          id: s.id, name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`,
          empId: s.employeeId, designation: s.designation, basic, hra, da, ta,
          gross, pf, tds, esi, deductions, net, status: 'PENDING'
        };
      }));
    }
    toast.success(`Payroll generated for ${MONTHS[payrollMonth - 1]} ${payrollYear}`);
    setShowGeneratePayroll(false);
  };

  // Process salary
  const processSalary = (id) => {
    setPayrollData(prev => prev.map(p => p.id === id ? { ...p, status: 'PAID' } : p));
    toast.success('Salary processed!');
  };

  const processAllSalaries = () => {
    setPayrollData(prev => prev.map(p => ({ ...p, status: 'PAID' })));
    toast.success('All salaries processed!');
  };

  // Leave Management
  const handleLeaveAction = (id, action) => {
    setLeaveApplications(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    toast.success(`Leave ${action.toLowerCase()}`);
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) { toast.error('Fill all fields'); return; }
    const days = Math.ceil((new Date(leaveForm.toDate) - new Date(leaveForm.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
    setLeaveApplications(prev => [{ id: Date.now(), staff: 'Current User', department: '-', leaveType: leaveForm.leaveType, fromDate: leaveForm.fromDate, toDate: leaveForm.toDate, days, reason: leaveForm.reason, status: 'PENDING' }, ...prev]);
    toast.success('Leave applied!');
    setShowApplyLeave(false);
    setLeaveForm({ staffId: '', leaveType: 'CL', fromDate: '', toDate: '', reason: '' });
  };

  // Recruitment
  const handleAddOpening = (e) => {
    e.preventDefault();
    if (!openingForm.title || !openingForm.department) { toast.error('Title and department required'); return; }
    setOpenings(prev => [{ id: Date.now(), ...openingForm, status: 'OPEN', applications: 0 }, ...prev]);
    toast.success('Job opening created!');
    setShowAddOpening(false);
    setOpeningForm({ title: '', department: '', vacancies: 1, experience: '', qualification: '', description: '' });
  };

  // Staff Attendance
  const loadStaffAttendance = () => {
    const data = (staff.length > 0 ? staff : [
      { id: 1, user: { firstName: 'Anita', lastName: 'Gupta' }, employeeId: 'EMP001', designation: 'PGT' },
      { id: 2, user: { firstName: 'Raj', lastName: 'Kumar' }, employeeId: 'EMP002', designation: 'TGT' },
      { id: 3, user: { firstName: 'Meena', lastName: 'Sharma' }, employeeId: 'EMP003', designation: 'PRT' },
    ]).map(s => ({
      staffId: s.id, name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`,
      empId: s.employeeId, designation: s.designation,
      checkIn: '08:30', checkOut: '', status: 'PRESENT'
    }));
    setStaffAttendance(data);
  };

  const updateStaffAttendance = (index, field, value) => {
    const updated = [...staffAttendance];
    updated[index][field] = value;
    setStaffAttendance(updated);
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>🧑‍💼 HR & Payroll Management</h1><p>Employee management, payroll, attendance, leave, and recruitment</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tab === 'payroll' && <button className="btn btn-primary" onClick={() => setShowGeneratePayroll(true)}>💰 Generate Payroll</button>}
          {tab === 'leave' && <button className="btn btn-primary" onClick={() => setShowApplyLeave(true)}>+ Apply Leave</button>}
          {tab === 'recruitment' && <button className="btn btn-primary" onClick={() => setShowAddOpening(true)}>+ Add Opening</button>}
        </div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'employees' ? 'active' : ''}`} onClick={() => setTab('employees')}>👥 Employees</button>
        <button className={`tab-btn ${tab === 'payroll' ? 'active' : ''}`} onClick={() => setTab('payroll')}>💰 Payroll</button>
        <button className={`tab-btn ${tab === 'attendance' ? 'active' : ''}`} onClick={() => setTab('attendance')}>✅ Staff Attendance</button>
        <button className={`tab-btn ${tab === 'leave' ? 'active' : ''}`} onClick={() => setTab('leave')}>📋 Leave Management</button>
        <button className={`tab-btn ${tab === 'recruitment' ? 'active' : ''}`} onClick={() => setTab('recruitment')}>🎯 Recruitment</button>
      </div>

      {/* ===== EMPLOYEES TAB ===== */}
      {tab === 'employees' && (
        <div>
          {loading ? <p>Loading...</p> : staff.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">👥</span><h3>No employees found</h3><p>Add staff from Staff Management page</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Emp ID</th><th>Name</th><th>Designation</th><th>Department</th><th>Qualification</th><th>Status</th></tr></thead>
                <tbody>{staff.map(s => (
                  <tr key={s.id}>
                    <td><code>{s.employeeId}</code></td>
                    <td><strong>{s.user?.firstName} {s.user?.lastName}</strong></td>
                    <td>{s.designation}</td>
                    <td>{s.department}</td>
                    <td>{s.qualification}</td>
                    <td><span className="badge badge-green">{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== PAYROLL TAB ===== */}
      {tab === 'payroll' && (
        <div>
          <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{marginBottom:0}}><label>Month</label>
              <select value={payrollMonth} onChange={e => setPayrollMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}><label>Year</label>
              <input type="number" value={payrollYear} onChange={e => setPayrollYear(e.target.value)} style={{width:'100px'}} />
            </div>
            <button className="btn btn-primary" onClick={handleGeneratePayroll}>Generate</button>
            {payrollData.length > 0 && <button className="btn btn-outline" onClick={processAllSalaries}>✅ Process All</button>}
          </div>

          {payrollData.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">💰</span><h3>No payroll generated</h3><p>Select month/year and click "Generate Payroll"</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table" style={{ fontSize: '0.82rem' }}>
                <thead><tr><th>Emp ID</th><th>Name</th><th>Basic</th><th>HRA</th><th>DA</th><th>TA</th><th>Gross</th><th>PF</th><th>TDS</th><th>Deductions</th><th>Net Salary</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>{payrollData.map(p => (
                  <tr key={p.id}>
                    <td><code>{p.empId}</code></td>
                    <td><strong>{p.name}</strong><br/><small>{p.designation}</small></td>
                    <td>₹{p.basic.toLocaleString()}</td>
                    <td>₹{Math.round(p.hra).toLocaleString()}</td>
                    <td>₹{Math.round(p.da).toLocaleString()}</td>
                    <td>₹{p.ta.toLocaleString()}</td>
                    <td><strong>₹{Math.round(p.gross).toLocaleString()}</strong></td>
                    <td>₹{Math.round(p.pf).toLocaleString()}</td>
                    <td>₹{Math.round(p.tds).toLocaleString()}</td>
                    <td style={{color:'var(--danger)'}}>₹{Math.round(p.deductions).toLocaleString()}</td>
                    <td><strong style={{color:'var(--success)'}}>₹{Math.round(p.net).toLocaleString()}</strong></td>
                    <td><span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span></td>
                    <td>{p.status !== 'PAID' && <button className="btn btn-primary" style={{padding:'2px 8px',fontSize:'0.75rem'}} onClick={() => processSalary(p.id)}>Pay</button>}</td>
                  </tr>
                ))}</tbody>
                <tfoot>
                  <tr style={{ fontWeight: 'bold', background: 'var(--bg-tertiary)' }}>
                    <td colSpan={6}>TOTAL</td>
                    <td>₹{Math.round(payrollData.reduce((s, p) => s + p.gross, 0)).toLocaleString()}</td>
                    <td colSpan={3}>₹{Math.round(payrollData.reduce((s, p) => s + p.deductions, 0)).toLocaleString()}</td>
                    <td>₹{Math.round(payrollData.reduce((s, p) => s + p.net, 0)).toLocaleString()}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== STAFF ATTENDANCE TAB ===== */}
      {tab === 'attendance' && (
        <div>
          <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'end' }}>
            <div className="form-group" style={{marginBottom:0}}><label>Date</label><input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} /></div>
            <button className="btn btn-primary" onClick={loadStaffAttendance}>Load Staff</button>
            {staffAttendance.length > 0 && <button className="btn btn-outline" onClick={() => toast.success('Attendance saved!')}>💾 Save</button>}
          </div>

          {staffAttendance.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">✅</span><h3>Select date and click "Load Staff"</h3></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>#</th><th>Emp ID</th><th>Name</th><th>Designation</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
                <tbody>{staffAttendance.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><code>{s.empId}</code></td>
                    <td>{s.name}</td>
                    <td>{s.designation}</td>
                    <td><input type="time" value={s.checkIn} onChange={e => updateStaffAttendance(i, 'checkIn', e.target.value)} style={{width:'110px'}} /></td>
                    <td><input type="time" value={s.checkOut} onChange={e => updateStaffAttendance(i, 'checkOut', e.target.value)} style={{width:'110px'}} /></td>
                    <td>
                      <select value={s.status} onChange={e => updateStaffAttendance(i, 'status', e.target.value)} style={{width:'110px'}}>
                        <option value="PRESENT">Present</option><option value="ABSENT">Absent</option><option value="LATE">Late</option><option value="HALF_DAY">Half Day</option><option value="ON_LEAVE">On Leave</option>
                      </select>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== LEAVE MANAGEMENT TAB ===== */}
      {tab === 'leave' && (
        <div>
          {/* Leave Balance */}
          <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>📋 Leave Policy</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              {LEAVE_TYPES.map(lt => (
                <div key={lt.code} style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '6px', textAlign: 'center' }}>
                  <strong>{lt.code}</strong><br/>
                  <small>{lt.name}</small><br/>
                  <span style={{color:'var(--accent)', fontWeight:'700'}}>{lt.maxDays} days</span><br/>
                  <small style={{color: lt.paid ? 'var(--success)' : 'var(--danger)'}}>{lt.paid ? 'Paid' : 'Unpaid'}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Applications */}
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Staff</th><th>Department</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{leaveApplications.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.staff}</strong></td>
                  <td>{l.department}</td>
                  <td><span className="badge badge-blue">{l.leaveType}</span></td>
                  <td>{l.fromDate}</td>
                  <td>{l.toDate}</td>
                  <td>{l.days}</td>
                  <td>{l.reason}</td>
                  <td><span className={`badge ${l.status === 'APPROVED' ? 'badge-green' : l.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'}`}>{l.status}</span></td>
                  <td>
                    {l.status === 'PENDING' && (
                      <div style={{display:'flex', gap:'4px'}}>
                        <button className="btn-icon" title="Approve" onClick={() => handleLeaveAction(l.id, 'APPROVED')}>✅</button>
                        <button className="btn-icon" title="Reject" onClick={() => handleLeaveAction(l.id, 'REJECTED')}>❌</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== RECRUITMENT TAB ===== */}
      {tab === 'recruitment' && (
        <div>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Position</th><th>Department</th><th>Vacancies</th><th>Experience</th><th>Qualification</th><th>Applications</th><th>Status</th></tr></thead>
              <tbody>{openings.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.title}</strong></td>
                  <td>{o.department}</td>
                  <td>{o.vacancies}</td>
                  <td>{o.experience}</td>
                  <td>{o.qualification}</td>
                  <td><span className="badge badge-blue">{o.applications}</span></td>
                  <td><span className={`badge ${o.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>{o.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== APPLY LEAVE MODAL ===== */}
      {showApplyLeave && (
        <div className="modal-overlay" onClick={() => setShowApplyLeave(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>📋 Apply Leave</h2><button className="btn-icon" onClick={() => setShowApplyLeave(false)}>✕</button></div>
            <form onSubmit={handleApplyLeave} className="modal-body">
              <div className="form-group"><label>Leave Type *</label>
                <select required value={leaveForm.leaveType} onChange={e => setLeaveForm({...leaveForm, leaveType: e.target.value})}>
                  {LEAVE_TYPES.map(lt => <option key={lt.code} value={lt.code}>{lt.name} ({lt.maxDays} days/year)</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>From Date *</label><input type="date" required value={leaveForm.fromDate} onChange={e => setLeaveForm({...leaveForm, fromDate: e.target.value})} /></div>
                <div className="form-group"><label>To Date *</label><input type="date" required value={leaveForm.toDate} onChange={e => setLeaveForm({...leaveForm, toDate: e.target.value})} min={leaveForm.fromDate} /></div>
              </div>
              {leaveForm.fromDate && leaveForm.toDate && (
                <p style={{color:'var(--accent)', fontWeight:'600'}}>Total Days: {Math.ceil((new Date(leaveForm.toDate) - new Date(leaveForm.fromDate)) / (1000*60*60*24)) + 1}</p>
              )}
              <div className="form-group"><label>Reason *</label><textarea required rows={3} placeholder="Reason for leave..." value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowApplyLeave(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD JOB OPENING MODAL ===== */}
      {showAddOpening && (
        <div className="modal-overlay" onClick={() => setShowAddOpening(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>🎯 Add Job Opening</h2><button className="btn-icon" onClick={() => setShowAddOpening(false)}>✕</button></div>
            <form onSubmit={handleAddOpening} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Position Title *</label><input required placeholder="e.g. PGT Physics" value={openingForm.title} onChange={e => setOpeningForm({...openingForm, title: e.target.value})} /></div>
                <div className="form-group"><label>Department *</label><input required placeholder="e.g. Science" value={openingForm.department} onChange={e => setOpeningForm({...openingForm, department: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Vacancies</label><input type="number" min="1" value={openingForm.vacancies} onChange={e => setOpeningForm({...openingForm, vacancies: e.target.value})} /></div>
                <div className="form-group"><label>Experience Required</label><input placeholder="e.g. 5+ years" value={openingForm.experience} onChange={e => setOpeningForm({...openingForm, experience: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Qualification Required</label><input placeholder="e.g. M.Sc Physics + B.Ed" value={openingForm.qualification} onChange={e => setOpeningForm({...openingForm, qualification: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea rows={3} placeholder="Job description, responsibilities..." value={openingForm.description} onChange={e => setOpeningForm({...openingForm, description: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddOpening(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
