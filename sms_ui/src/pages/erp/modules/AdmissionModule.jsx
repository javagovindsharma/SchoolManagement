import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdmissionModule() {
  const [tab, setTab] = useState('applications');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentName: '', dateOfBirth: '', gender: 'MALE', applyingForClass: '', fatherName: '', fatherPhone: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Application submitted!');
    setShowForm(false);
    setForm({ studentName: '', dateOfBirth: '', gender: 'MALE', applyingForClass: '', fatherName: '', fatherPhone: '', email: '' });
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📋 Admission Management</h1><p>Online applications, tracking, and enrollment</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Application</button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>Applications</button>
        <button className={`tab-btn ${tab === 'enquiries' ? 'active' : ''}`} onClick={() => setTab('enquiries')}>Enquiries</button>
        <button className={`tab-btn ${tab === 'shortlisted' ? 'active' : ''}`} onClick={() => setTab('shortlisted')}>Shortlisted</button>
        <button className={`tab-btn ${tab === 'enrolled' ? 'active' : ''}`} onClick={() => setTab('enrolled')}>Enrolled</button>
      </div>

      <div className="empty-state"><span className="empty-icon">📋</span><h3>Admission {tab}</h3><p>Data will load from backend when connected</p></div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Admission Application</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group"><label>Student Name *</label><input required value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Date of Birth *</label><input type="date" required value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
                <div className="form-group"><label>Gender</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Applying for Class *</label>
                <select required value={form.applyingForClass} onChange={e => setForm({...form, applyingForClass: e.target.value})}>
                  <option value="">Select Class</option>
                  {['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Father's Name *</label><input required value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} /></div>
                <div className="form-group"><label>Father's Phone *</label><input required value={form.fatherPhone} onChange={e => setForm({...form, fatherPhone: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
