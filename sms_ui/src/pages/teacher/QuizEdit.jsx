import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
 
export default function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingQ, setEditingQ] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
 
  // Add students state
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
 
  const loadQuiz = async () => {
    try {
      const res = await API.get(`/quizzes/${id}`);
      setQuiz(res.data);
      const sRes = await API.get('/students');
      setStudents(sRes.data);
      const cRes = await API.get('/classes');
      setClasses(cRes.data);
    } catch {}
  };
 
  useEffect(() => { loadQuiz(); }, []);
 
  const getStudentName = (sid) => {
    const s = students.find(st => st.id === sid);
    return s ? s.fullName : `Student #${sid}`;
  };
 
  const handleUnassign = async (studentId) => {
    try {
      await API.post(`/quizzes/${id}/unassign`, { studentIds: [studentId] });
      setMessage('✅ Student removed');
      loadQuiz();
    } catch { setMessage('❌ Failed'); }
  };
 
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    if (classId) {
      const filtered = students.filter(s => s.classEntity?.id === parseInt(classId));
      setClassStudents(filtered);
    } else {
      setClassStudents([]);
    }
    setSelectedStudents([]);
  };
 
  const toggleStudent = (sid) => {
    setSelectedStudents(prev => prev.includes(sid) ? prev.filter(i => i !== sid) : [...prev, sid]);
  };
 
  const handleAssign = async () => {
    if (selectedStudents.length === 0) return;
    try {
      await API.post(`/quizzes/${id}/assign`, { studentIds: selectedStudents });
      setMessage(`✅ Assigned ${selectedStudents.length} students!`);
      setSelectedStudents([]);
      setSelectedClass('');
      setClassStudents([]);
      loadQuiz();
    } catch { setMessage('❌ Assign failed'); }
  };
 
  const filteredClassStudents = classStudents.filter(s =>
    !quiz?.assignedStudentIds?.includes(s.id) &&
    (s.fullName?.toLowerCase().includes(searchStudent.toLowerCase()) || s.email?.toLowerCase().includes(searchStudent.toLowerCase()))
  );
 
  const startEdit = (q) => {
    setEditingQ(q.id);
    setEditForm({ ...q });
  };
 
  const saveQuestion = async () => {
    try {
      await API.put(`/quizzes/${id}/questions/${editingQ}`, editForm);
      setMessage('✅ Question updated');
      setEditingQ(null);
      loadQuiz();
    } catch { setMessage('❌ Failed to update'); }
  };
 
  const deleteQuestion = async (qId) => {
    if (!confirm('Delete this question?')) return;
    try {
      await API.delete(`/quizzes/${id}/questions/${qId}`);
      setMessage('✅ Question deleted');
      loadQuiz();
    } catch { setMessage('❌ Failed'); }
  };
 
  if (!quiz) return <div className="card" style={{ padding: '40px', textAlign: 'center' }}>⏳ Loading...</div>;
 
  return (
    <div>
      <div className="page-header">
        <h1>✏️ Edit Quiz: {quiz.title}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/teacher/quizzes')}>← Back</button>
      </div>
 
      {message && <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
 
      {/* Quiz Info */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <p><strong>Subject:</strong> {quiz.subject} &nbsp; <strong>Duration:</strong> {quiz.durationMinutes} min &nbsp; <strong>Questions:</strong> {quiz.questions?.length}</p>
      </div>
 
      {/* Assigned Students */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>👥 Assigned Students ({quiz.assignedStudentIds?.length || 0})</h3>
        {(!quiz.assignedStudentIds || quiz.assignedStudentIds.length === 0) && (
          <p style={{ color: '#94a3b8' }}>No students assigned yet.</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {quiz.assignedStudentIds?.map(sid => (
            <div key={sid} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px',
              padding: '6px 12px', fontSize: '0.85rem'
            }}>
              <span>{getStudentName(sid)}</span>
              <button onClick={() => handleUnassign(sid)} style={{
                background: '#ef4444', color: 'white', border: 'none',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.7rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>
          ))}
        </div>
 
        {/* Add Students */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>➕ Add Students</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <select value={selectedClass} onChange={e => handleClassChange(e.target.value)} style={{ minWidth: '180px' }}>
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.className} - {c.section}</option>
              ))}
            </select>
            <input placeholder="🔍 Search student..." value={searchStudent} onChange={e => setSearchStudent(e.target.value)} style={{ flex: 1, minWidth: '150px' }} />
          </div>
          {filteredClassStudents.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedStudents(filteredClassStudents.map(s => s.id))}>Select All</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedStudents([])}>Deselect All</button>
                <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>{selectedStudents.length} selected</span>
              </div>
            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', marginBottom: '10px' }}>
              {filteredClassStudents.map(s => (
                <label key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px',
                  borderRadius: '6px', cursor: 'pointer',
                  background: selectedStudents.includes(s.id) ? '#dbeafe' : 'transparent'
                }}>
                  <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                  <span style={{ fontSize: '0.85rem' }}>{s.fullName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({s.email})</span>
                </label>
              ))}
            </div>
            </>
          )}
          {selectedClass && filteredClassStudents.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>All students from this class are already assigned.</p>
          )}
          {selectedStudents.length > 0 && (
            <button className="btn btn-primary" style={{ marginTop: '12px', padding: '10px 20px' }} onClick={handleAssign}>
              ✅ Add {selectedStudents.length} Students
            </button>
          )}
          {selectedClass && selectedStudents.length === 0 && filteredClassStudents.length > 0 && (
            <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '10px' }}>⚠️ Select students then click Add button</p>
          )}
        </div>
      </div>
 
      {/* Questions */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>📋 Questions</h3>
        {quiz.questions?.map((q, i) => (
          <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
            {editingQ === q.id ? (
              <>
                <div className="form-group"><label>Question</label><input value={editForm.questionText} onChange={e => setEditForm({ ...editForm, questionText: e.target.value })} /></div>
                <div className="grid-3">
                  <div className="form-group"><label>A</label><input value={editForm.optionA} onChange={e => setEditForm({ ...editForm, optionA: e.target.value })} /></div>
                  <div className="form-group"><label>B</label><input value={editForm.optionB} onChange={e => setEditForm({ ...editForm, optionB: e.target.value })} /></div>
                  <div className="form-group"><label>C</label><input value={editForm.optionC} onChange={e => setEditForm({ ...editForm, optionC: e.target.value })} /></div>
                  <div className="form-group"><label>D</label><input value={editForm.optionD} onChange={e => setEditForm({ ...editForm, optionD: e.target.value })} /></div>
                  <div className="form-group"><label>Correct</label>
                    <select value={editForm.correctAnswer} onChange={e => setEditForm({ ...editForm, correctAnswer: e.target.value })}>
                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={saveQuestion}>💾 Save</button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingQ(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>Q{i + 1}. {q.questionText}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    A: {q.optionA} &nbsp; B: {q.optionB} &nbsp; C: {q.optionC} &nbsp; D: {q.optionD}
                    &nbsp; <span style={{ color: '#10b981', fontWeight: '700' }}>✓ {q.correctAnswer}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-warning btn-sm" onClick={() => startEdit(q)}>✏️</button>
                  <button className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} onClick={() => deleteQuestion(q.id)}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}