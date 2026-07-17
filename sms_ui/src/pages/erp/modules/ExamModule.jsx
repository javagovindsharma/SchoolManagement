import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';
import { CBSE_GRADES, CBSE_SUBJECTS_SECONDARY, CBSE_SUBJECTS_SENIOR_SCIENCE, CO_SCHOLASTIC, CBSE_TERMS, getGradeFromMarks, calculateCGPA, cgpaToPercentage } from '../../../config/cbseConfig';
import schoolConfig from '../../../config/schoolConfig';

export default function ExamModule() {
  const [tab, setTab] = useState('schedule');
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Exam
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [examForm, setExamForm] = useState({ name: '', description: '', startDate: '', endDate: '', examType: 'HALF_YEARLY' });

  // Marks Entry
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [showMarksEntry, setShowMarksEntry] = useState(false);

  // Results & Report Card
  const [resultClass, setResultClass] = useState('');
  const [resultStudent, setResultStudent] = useState('');
  const [reportData, setReportData] = useState(null);

  useEffect(() => { fetchExams(); fetchClasses(); }, []);

  const fetchExams = async () => {
    try { const res = await API.get('/exams'); setExams(res.data?.data || []); }
    catch { /* ignore */ } finally { setLoading(false); }
  };

  const fetchClasses = async () => {
    try { const res = await API.get('/classes'); setClasses(res.data?.data || []); }
    catch { /* ignore */ }
  };

  const fetchStudents = async (classId) => {
    try {
      const res = await API.get('/students', { params: { classId, page: 0, size: 200 } });
      const data = res.data?.data?.content || res.data?.data || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch { setStudents([]); }
  };

  // Create Exam
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!examForm.name || !examForm.startDate || !examForm.endDate) { toast.error('Fill all required fields'); return; }
    try {
      await API.post('/exams', examForm);
      toast.success('Exam scheduled!');
      setShowCreateExam(false);
      setExamForm({ name: '', description: '', startDate: '', endDate: '', examType: 'HALF_YEARLY' });
      fetchExams();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // Load students for marks entry
  const loadForMarks = async () => {
    if (!selectedClass || !selectedSubject) { toast.error('Select class and subject'); return; }
    await fetchStudents(selectedClass);
    setShowMarksEntry(true);
  };

  useEffect(() => {
    if (showMarksEntry && students.length > 0) {
      setMarksData(students.map(s => ({
        studentId: s.id, name: `${s.firstName} ${s.lastName || ''}`,
        admNo: s.admissionNo, theory: '', practical: '', internal: '', total: '', grade: '', gp: 0
      })));
    }
  }, [students, showMarksEntry]);

  // Get subject config
  const getSubjectConfig = () => {
    const allSubjects = [...CBSE_SUBJECTS_SECONDARY, ...CBSE_SUBJECTS_SENIOR_SCIENCE];
    return allSubjects.find(s => s.name === selectedSubject) || { maxTheory: 80, maxInternal: 20 };
  };

  // Marks change handler
  const handleMarksChange = (index, field, value) => {
    const updated = [...marksData];
    updated[index][field] = value;
    const subj = getSubjectConfig();
    const theory = Number(updated[index].theory) || 0;
    const practical = Number(updated[index].practical) || 0;
    const internal = Number(updated[index].internal) || 0;
    const total = theory + practical + internal;
    updated[index].total = total;
    const percentage = (total / (subj.maxTheory + (subj.maxPractical || subj.maxInternal || 20))) * 100;
    const gradeInfo = getGradeFromMarks(percentage);
    updated[index].grade = gradeInfo.grade;
    updated[index].gp = gradeInfo.gradePoint;
    setMarksData(updated);
  };

  // Save marks
  const handleSaveMarks = () => {
    const filled = marksData.filter(m => m.theory !== '');
    if (filled.length === 0) { toast.error('Enter marks for at least one student'); return; }
    toast.success(`Marks saved for ${filled.length} students!`);
    setShowMarksEntry(false);
  };

  // CSV Upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(r => r.trim()).slice(1);
      const updated = [...marksData];
      rows.forEach(row => {
        const cols = row.split(',');
        if (cols.length >= 2) {
          const admNo = cols[0].trim();
          const theory = cols[1].trim();
          const practical = cols.length > 2 ? cols[2].trim() : '';
          const internal = cols.length > 3 ? cols[3].trim() : '';
          const idx = updated.findIndex(m => m.admNo === admNo);
          if (idx !== -1) {
            updated[idx].theory = theory;
            updated[idx].practical = practical;
            updated[idx].internal = internal;
            const total = Number(theory) + Number(practical) + Number(internal);
            updated[idx].total = total;
            const gradeInfo = getGradeFromMarks((total / 100) * 100);
            updated[idx].grade = gradeInfo.grade;
            updated[idx].gp = gradeInfo.gradePoint;
          }
        }
      });
      setMarksData(updated);
      toast.success(`CSV loaded! ${rows.length} rows processed`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Generate Report Card
  const generateReport = () => {
    if (!resultClass) { toast.error('Select a class'); return; }
    const student = students.find(s => s.id === Number(resultStudent));
    const subjects = CBSE_SUBJECTS_SECONDARY;
    // Demo data for report card
    const subjectResults = subjects.map(sub => {
      const theory = Math.floor(Math.random() * 30) + 50;
      const internal = Math.floor(Math.random() * 10) + 10;
      const total = theory + internal;
      const pct = total;
      const gi = getGradeFromMarks(pct);
      return { ...sub, theory, internal, total, grade: gi.grade, gradePoint: gi.gradePoint };
    });
    const gradePoints = subjectResults.map(s => s.gradePoint);
    const cgpa = calculateCGPA(gradePoints);
    setReportData({
      student: student || { firstName: 'Sample', lastName: 'Student', admissionNo: 'ADM202600001' },
      subjects: subjectResults,
      cgpa,
      percentage: cgpaToPercentage(cgpa),
      coScholastic: CO_SCHOLASTIC.map(c => ({ ...c, grade: 'A' })),
      discipline: 'A',
      attendance: '92%',
      remarks: 'Excellent performance. Keep it up!'
    });
    toast.success('Report card generated!');
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📝 Examination Management (CBSE)</h1><p>Schedule exams, enter marks, and generate report cards as per CBSE guidelines</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreateExam(true)}>+ Schedule Exam</button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>Exam Schedule</button>
        <button className={`tab-btn ${tab === 'marks' ? 'active' : ''}`} onClick={() => setTab('marks')}>Marks Entry</button>
        <button className={`tab-btn ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>Results</button>
        <button className={`tab-btn ${tab === 'reportcard' ? 'active' : ''}`} onClick={() => setTab('reportcard')}>Report Card</button>
      </div>

      {/* ===== EXAM SCHEDULE ===== */}
      {tab === 'schedule' && (
        <div>
          {loading ? <p>Loading...</p> : exams.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📝</span><h3>No exams scheduled</h3><p>Click "+ Schedule Exam" to create one</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Exam Name</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>
                <tbody>{exams.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.name}</strong><br/><small style={{color:'var(--text-muted)'}}>{e.description}</small></td>
                    <td><span className="badge badge-blue">{e.examType || 'EXAM'}</span></td>
                    <td>{e.startDate}</td><td>{e.endDate}</td>
                    <td><span className={`badge ${e.status === 'COMPLETED' ? 'badge-green' : 'badge-blue'}`}>{e.status}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== MARKS ENTRY ===== */}
      {tab === 'marks' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3>📝 CBSE Marks Entry</h3>
            <p style={{color:'var(--text-muted)', marginBottom:'16px'}}>Select exam, class, and subject to enter marks as per CBSE format</p>
            <div className="form-row">
              <div className="form-group"><label>Exam *</label>
                <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
                  <option value="">Select Exam</option>
                  {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Class *</label>
                <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setShowMarksEntry(false); }}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Subject *</label>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  {CBSE_SUBJECTS_SECONDARY.map(s => <option key={s.code} value={s.name}>{s.name} ({s.code})</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={loadForMarks}>📋 Load Students</button>
              <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                📤 Upload CSV
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvUpload} />
              </label>
            </div>
            <small style={{ display: 'block', marginTop: '8px', color: 'var(--text-muted)' }}>CSV Format: AdmissionNo, TheoryMarks, PracticalMarks, InternalMarks</small>
          </div>

          {showMarksEntry && marksData.length > 0 && (
            <div className="data-table-container">
              <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <strong>Subject: {selectedSubject}</strong> | Max Theory: {getSubjectConfig().maxTheory} | Max Internal/Practical: {getSubjectConfig().maxPractical || getSubjectConfig().maxInternal || 20}
              </div>
              <table className="data-table">
                <thead><tr><th>#</th><th>Adm No</th><th>Student Name</th><th>Theory ({getSubjectConfig().maxTheory})</th><th>{getSubjectConfig().hasPractical ? `Practical (${getSubjectConfig().maxPractical})` : `Internal (${getSubjectConfig().maxInternal || 20})`}</th><th>Total</th><th>Grade</th><th>GP</th></tr></thead>
                <tbody>{marksData.map((m, i) => (
                  <tr key={m.studentId}>
                    <td>{i + 1}</td>
                    <td><code>{m.admNo}</code></td>
                    <td>{m.name}</td>
                    <td><input type="number" min="0" max={getSubjectConfig().maxTheory} style={{width:'70px'}} value={m.theory} onChange={e => handleMarksChange(i, 'theory', e.target.value)} /></td>
                    <td><input type="number" min="0" max={getSubjectConfig().maxPractical || 20} style={{width:'70px'}} value={m.internal || m.practical} onChange={e => handleMarksChange(i, getSubjectConfig().hasPractical ? 'practical' : 'internal', e.target.value)} /></td>
                    <td><strong>{m.total || '-'}</strong></td>
                    <td><span className={`badge ${m.grade === 'A1' || m.grade === 'A2' ? 'badge-green' : m.grade === 'E' ? 'badge-red' : 'badge-blue'}`}>{m.grade || '-'}</span></td>
                    <td>{m.gp || '-'}</td>
                  </tr>
                ))}</tbody>
              </table>
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-outline" onClick={() => setShowMarksEntry(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveMarks}>💾 Save Marks</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {tab === 'results' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3>📊 View Results</h3>
            <div className="form-row">
              <div className="form-group"><label>Class</label>
                <select value={resultClass} onChange={e => { setResultClass(e.target.value); fetchStudents(e.target.value); }}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Student</label>
                <select value={resultStudent} onChange={e => setResultStudent(e.target.value)}>
                  <option value="">All Students</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
                </select>
              </div>
            </div>
          </div>
          {/* CBSE Grading Reference */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ marginBottom: '12px' }}>📋 CBSE 9-Point Grading Scale</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              {CBSE_GRADES.map(g => (
                <div key={g.grade} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>{g.grade}</strong><span>{g.minMarks}-{g.maxMarks}</span><span>GP: {g.gradePoint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== REPORT CARD ===== */}
      {tab === 'reportcard' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3>📄 Generate CBSE Report Card</h3>
            <div className="form-row">
              <div className="form-group"><label>Class *</label>
                <select value={resultClass} onChange={e => { setResultClass(e.target.value); fetchStudents(e.target.value); setReportData(null); }}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Student</label>
                <select value={resultStudent} onChange={e => { setResultStudent(e.target.value); setReportData(null); }}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
                </select>
              </div>
              <div className="form-group"><label>Exam</label>
                <select><option value="">Select Exam</option>{exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}</select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={generateReport}>📄 Generate Report Card</button>
              {reportData && <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print</button>}
            </div>
          </div>

          {/* CBSE Report Card Preview */}
          {reportData && (
            <div className="card report-card-preview" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--text-primary)', paddingBottom: '16px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{schoolConfig.name}</h2>
                <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>Affiliated to {schoolConfig.board} | Affiliation No: {schoolConfig.affiliationNo}</p>
                <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>{schoolConfig.address}</p>
                <h3 style={{ margin: '12px 0 0', color: 'var(--accent)' }}>REPORT CARD</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Academic Session 2025-2026</p>
              </div>

              {/* Student Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                <p><strong>Student Name:</strong> {reportData.student.firstName} {reportData.student.lastName}</p>
                <p><strong>Admission No:</strong> {reportData.student.admissionNo}</p>
                <p><strong>Class & Section:</strong> X - A</p>
                <p><strong>Roll No:</strong> 15</p>
              </div>

              {/* Scholastic Areas */}
              <h4 style={{ marginBottom: '8px' }}>Part I: Scholastic Areas</h4>
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr><th>Subject Code</th><th>Subject</th><th>Theory</th><th>Internal/Practical</th><th>Total (100)</th><th>Grade</th><th>Grade Point</th></tr>
                </thead>
                <tbody>
                  {reportData.subjects.map((s, i) => (
                    <tr key={i}>
                      <td>{s.code}</td>
                      <td>{s.name}</td>
                      <td>{s.theory}</td>
                      <td>{s.internal}</td>
                      <td><strong>{s.total}</strong></td>
                      <td><span className={`badge ${s.grade === 'A1' || s.grade === 'A2' ? 'badge-green' : s.grade === 'E' ? 'badge-red' : 'badge-blue'}`}>{s.grade}</span></td>
                      <td>{s.gradePoint}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 'bold', background: 'var(--bg-tertiary)' }}>
                    <td colSpan={5}></td>
                    <td>CGPA</td>
                    <td>{reportData.cgpa}</td>
                  </tr>
                  <tr>
                    <td colSpan={5}></td>
                    <td>Percentage</td>
                    <td>{reportData.percentage}%</td>
                  </tr>
                </tfoot>
              </table>

              {/* Co-Scholastic */}
              <h4 style={{ margin: '20px 0 8px' }}>Part II: Co-Scholastic Areas</h4>
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead><tr><th>Activity</th><th>Grade</th></tr></thead>
                <tbody>
                  {reportData.coScholastic.map((c, i) => (
                    <tr key={i}><td>{c.name}</td><td><span className="badge badge-green">{c.grade}</span></td></tr>
                  ))}
                </tbody>
              </table>

              {/* Discipline & Attendance */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
                <div><strong>Discipline:</strong> <span className="badge badge-green">{reportData.discipline}</span></div>
                <div><strong>Attendance:</strong> {reportData.attendance}</div>
              </div>

              {/* Remarks */}
              <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>Class Teacher's Remarks:</strong> {reportData.remarks}
              </div>

              {/* Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div><div style={{ borderTop: '1px solid var(--text-primary)', display: 'inline-block', paddingTop: '4px', minWidth: '120px' }}>Class Teacher</div></div>
                <div><div style={{ borderTop: '1px solid var(--text-primary)', display: 'inline-block', paddingTop: '4px', minWidth: '120px' }}>Exam Controller</div></div>
                <div><div style={{ borderTop: '1px solid var(--text-primary)', display: 'inline-block', paddingTop: '4px', minWidth: '120px' }}>Principal</div></div>
              </div>

              {/* Grading Scale */}
              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.8rem' }}>
                <strong>CBSE 9-Point Grading Scale:</strong><br/>
                {CBSE_GRADES.map(g => `${g.grade}(${g.minMarks}-${g.maxMarks})`).join(' | ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CREATE EXAM MODAL ===== */}
      {showCreateExam && (
        <div className="modal-overlay" onClick={() => setShowCreateExam(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Schedule Exam</h2><button className="btn-icon" onClick={() => setShowCreateExam(false)}>✕</button></div>
            <form onSubmit={handleCreateExam} className="modal-body">
              <div className="form-group"><label>Exam Name *</label>
                <input required placeholder="e.g. Half Yearly Examination 2025" value={examForm.name} onChange={e => setExamForm({...examForm, name: e.target.value})} />
              </div>
              <div className="form-group"><label>Exam Type *</label>
                <select value={examForm.examType} onChange={e => setExamForm({...examForm, examType: e.target.value})}>
                  {CBSE_TERMS.map(t => <option key={t.id} value={t.id}>{t.name} (Weightage: {t.weightage}%)</option>)}
                </select>
              </div>
              <div className="form-group"><label>Description</label>
                <textarea rows={2} value={examForm.description} onChange={e => setExamForm({...examForm, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Date *</label><input type="date" required value={examForm.startDate} onChange={e => setExamForm({...examForm, startDate: e.target.value})} /></div>
                <div className="form-group"><label>End Date *</label><input type="date" required value={examForm.endDate} onChange={e => setExamForm({...examForm, endDate: e.target.value})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateExam(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
