import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../../api/axios';

import { useAuth } from '../../context/AuthContext';



export default function QuizManage() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({ title: '', subject: '', description: '', durationMinutes: 30 });

  const [questions, setQuestions] = useState([{ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);

  const [csvFile, setCsvFile] = useState(null);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [message, setMessage] = useState('');



  // Assign state

  const [classes, setClasses] = useState([]);

  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [searchStudent, setSearchStudent] = useState('');



  const loadQuizzes = async () => {

    try {

      const res = await API.get(`/quizzes/teacher/${user?.id || 0}`);

      setQuizzes(res.data);

    } catch { setQuizzes([]); }

  };



  const loadClasses = async () => {

    try {

      const res = await API.get('/classes');

      setClasses(res.data);

    } catch { setClasses([]); }

  };



  const loadStudentsByClass = async (classId) => {

    try {

      const res = await API.get('/students');

      const filtered = res.data.filter(s => s.classEntity?.id === parseInt(classId));

      setStudents(filtered);

    } catch { setStudents([]); }

  };



  useEffect(() => { loadQuizzes(); loadClasses(); }, []);



  const handleClassChange = (classId) => {

    setSelectedClass(classId);

    if (classId) loadStudentsByClass(classId);

    else setStudents([]);

  };



  const toggleStudent = (studentId) => {

    setSelectedStudents(prev =>

      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]

    );

  };



  const selectAll = () => setSelectedStudents(students.map(s => s.id));

  const deselectAll = () => setSelectedStudents([]);



  const addQuestion = () => setQuestions(prev => [...prev, { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);



  const updateQuestion = (i, field, value) => {

    const updated = [...questions];

    updated[i][field] = value;

    setQuestions(updated);

  };



  const handleCreate = async (e) => {

    e.preventDefault();

    try {

      const payload = { ...form, createdBy: user?.id, questions };

      await API.post('/quizzes', payload);

      setMessage('✅ Quiz created!');

      setShowCreate(false);

      setForm({ title: '', subject: '', description: '', durationMinutes: 30 });

      setQuestions([{ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);

      loadQuizzes();

    } catch { setMessage('❌ Failed to create quiz'); }

  };



  const handleCsvUpload = async (quizId) => {

    if (!csvFile) return;

    const formData = new FormData();

    formData.append('file', csvFile);

    try {

      await API.post(`/quizzes/${quizId}/upload-csv`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      setMessage('✅ CSV uploaded!');

      setCsvFile(null);

      loadQuizzes();

    } catch { setMessage('❌ CSV upload failed'); }

  };



  const handleAssign = async (quizId) => {

    if (selectedStudents.length === 0) { setMessage('❌ Select at least one student'); return; }

    try {

      await API.post(`/quizzes/${quizId}/assign`, { studentIds: selectedStudents });

      setMessage(`✅ Assigned to ${selectedStudents.length} students!`);

      setSelectedStudents([]);

    } catch { setMessage('❌ Assign failed'); }

  };



  const filteredStudents = students.filter(s =>

    s.fullName?.toLowerCase().includes(searchStudent.toLowerCase()) ||

    s.email?.toLowerCase().includes(searchStudent.toLowerCase())

  );



  return (

    <div>

      <div className="page-header">

        <h1>📝 Quiz Management</h1>

        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>

          {showCreate ? '✕ Cancel' : '+ Create Quiz'}

        </button>

      </div>



      {message && <div className={` ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}



      {showCreate && (

        <div className="card" style={{ marginBottom: '20px' }}>

          <h3 style={{ marginBottom: '16px' }}>Create New Quiz</h3>

          <form onSubmit={handleCreate}>

            <div className="grid-3">

              <div className="form-group"><label>Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>

              <div className="form-group"><label>Subject *</label><input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>

              <div className="form-group"><label>Duration (min)</label><input type="number" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: parseInt(e.target.value) })} /></div>

            </div>



            <h4 style={{ margin: '16px 0 10px' }}>Questions</h4>

            {questions.map((q, i) => (

              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '10px', position: 'relative' }}>

                {questions.length > 1 && (

                  <button type="button" onClick={() => setQuestions(prev => prev.filter((_, idx) => idx !== i))}

                    style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>

                )}

                <div className="form-group"><label>Q{i + 1}</label><input required value={q.questionText} onChange={e => updateQuestion(i, 'questionText', e.target.value)} /></div>

                <div className="grid-3" style={{ fontSize: '0.85rem' }}>

                  <div className="form-group"><label>A</label><input required value={q.optionA} onChange={e => updateQuestion(i, 'optionA', e.target.value)} /></div>

                  <div className="form-group"><label>B</label><input required value={q.optionB} onChange={e => updateQuestion(i, 'optionB', e.target.value)} /></div>

                  <div className="form-group"><label>C</label><input required value={q.optionC} onChange={e => updateQuestion(i, 'optionC', e.target.value)} /></div>

                  <div className="form-group"><label>D</label><input required value={q.optionD} onChange={e => updateQuestion(i, 'optionD', e.target.value)} /></div>

                  <div className="form-group"><label>Correct</label>

                    <select value={q.correctAnswer} onChange={e => updateQuestion(i, 'correctAnswer', e.target.value)}>

                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>

                    </select>

                  </div>

                </div>

              </div>

            ))}

            <button type="button" className="btn btn-outline" onClick={addQuestion} style={{ marginBottom: '12px' }}>+ Add Question</button>

            <br />

            <button type="submit" className="btn btn-primary btn-lg">💾 Create Quiz</button>

          </form>

        </div>

      )}



      {/* Quiz List */}

      <div className="card">

        <h3 style={{ marginBottom: '16px' }}>My Quizzes ({quizzes.length})</h3>

        {quizzes.length === 0 && <p style={{ color: '#94a3b8' }}>No quizzes created yet.</p>}

        {quizzes.map(q => (

          <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <div>

                <strong>{q.title}</strong> <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({q.subject})</span>

                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{q.questions?.length || 0} questions • {q.durationMinutes} min</p>

              </div>

              <button className="btn btn-outline btn-sm" onClick={() => setSelectedQuiz(selectedQuiz === q.id ? null : q.id)}>

                {selectedQuiz === q.id ? 'Hide' : '⚙️ Actions'}

              </button>

              <button className="btn btn-warning btn-sm" style={{ marginLeft: '6px' }} onClick={() => navigate(`/teacher/quizzes/edit/${q.id}`)}>

                👁️ View/Edit

              </button>

            </div>

            {selectedQuiz === q.id && (

              <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>

                {/* CSV Upload */}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '16px' }}>

                  <div className="form-group" style={{ marginBottom: 0 }}>

                    <label style={{ fontSize: '0.8rem' }}>Upload CSV</label>

                    <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} />

                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => handleCsvUpload(q.id)}>Upload</button>

                </div>



                {/* Assign Students */}

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>

                  <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block' }}>📋 Assign to Students</label>



                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>

                    <select value={selectedClass} onChange={e => handleClassChange(e.target.value)} style={{ minWidth: '180px' }}>

                      <option value="">-- Select Class --</option>

                      {classes.map(c => (

                        <option key={c.id} value={c.id}>{c.className} - {c.section}</option>

                      ))}

                    </select>

                    <input placeholder="🔍 Search student..." value={searchStudent} onChange={e => setSearchStudent(e.target.value)} style={{ flex: 1, minWidth: '150px' }} />

                  </div>



                  {students.length > 0 && (

                    <>

                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>

                        <button type="button" className="btn btn-outline btn-sm" onClick={selectAll}>Select All</button>

                        <button type="button" className="btn btn-outline btn-sm" onClick={deselectAll}>Deselect All</button>

                        <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>

                          {selectedStudents.length} selected

                        </span>

                      </div>



                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>

                        {filteredStudents.map(s => (

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



                  <button className="btn btn-primary btn-sm" style={{ marginTop: '10px' }} onClick={() => handleAssign(q.id)}

                    disabled={selectedStudents.length === 0}>

                    ✅ Assign to {selectedStudents.length} Students

                  </button>

                </div>



                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>

                  CSV format: questionText,optionA,optionB,optionC,optionD,correctAnswer

                </p>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}