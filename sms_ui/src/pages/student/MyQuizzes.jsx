import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
 
export default function MyQuizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [scorecard, setScorecard] = useState([]);
  const [tab, setTab] = useState('quizzes');
  const [quizId, setQuizId] = useState(null);
  const [studentId, setStudentId] = useState(null);
 
  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [warned, setWarned] = useState(false);
  const timerRef = useRef(null);
  const submittedRef = useRef(false);
 
  useEffect(() => { resolveStudentId(); }, []);
 
  const updateAnswer = (questionId, option) => {
    const updated = { ...answersRef.current, [questionId]: option };
    answersRef.current = updated;
    setAnswers(updated);
  };
 
  const resolveStudentId = async () => {
    try {
      const res = await API.get(`/students/by-user/${user?.id}`);
      setStudentId(res.data.id);
      loadData(res.data.id);
    } catch { loadData(user?.id); }
  };
  const startQuiz = async (qId) => {
    try {
      const res = await API.get(`/quizzes/${qId}/questions`);
      setActiveQuiz(res.data);
      setQuestions(res.data.questions);
      setAnswers({});
      answersRef.current = {};
      setCurrentIndex(0);
      setResult(null);
      setQuizId(qId);
      setTimeLeft((res.data.duration || 30) * 60);
      setWarned(false);
      submittedRef.current = false;
      setTab('exam');
     }catch { /* empty */ }
  };
 
  // Timer countdown
  useEffect(() => {
    if (tab !== 'exam' || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submittedRef.current) { submittedRef.current = true; submitQuiz(); }
          return 0;
        }
        // Warning at 1 minute left
        if (prev === 61 && !warned) { setWarned(true); alert('⚠️ Only 1 minute left! Your quiz will auto-submit soon.'); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tab, timeLeft > 0]);
 
  const loadData = async (sId) => {
    const id = sId || studentId;
    if (!id) return;
    try {
      const [qRes, sRes] = await Promise.all([
        API.get(`/quizzes/student/${id}`),
        API.get(`/quizzes/scorecard/${id}`)
      ]);
      setQuizzes(qRes.data);
      setScorecard(sRes.data);
      }catch { /* empty */ }
  };
 
  
 
  const submitQuiz = async () => {
    clearInterval(timerRef.current);
    // Use ref to get latest answers (avoids stale closure in timer)
    const cleanAnswers = {};
    Object.entries(answersRef.current).forEach(([key, val]) => {
      if (val) cleanAnswers[String(key)] = String(val);
    });
    try {
      const res = await API.post(`/quizzes/${quizId}/submit`, { studentId, answers: cleanAnswers });
      setResult(res.data);
      loadData(studentId);
    }catch { /* empty */ }
  };
 
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
 
  const currentQ = questions[currentIndex];
 
  return (
    <div>
      <div className="page-header">
        <h1>📝 My Quizzes</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${tab === 'quizzes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setTab('quizzes'); setResult(null); clearInterval(timerRef.current); }}>Quizzes</button>
          <button className={`btn ${tab === 'scorecard' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('scorecard')}>📊 Scorecard</button>
        </div>
      </div>
 
      {/* Quiz List */}
      {tab === 'quizzes' && (
        <div className="card">
          {quizzes.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No quizzes assigned to you yet.</p>}
          {quizzes.map(q => (
            <div key={q.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{q.title}</strong> <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({q.subject})</span>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{q.totalQuestions} questions • {q.durationMinutes} min</p>
              </div>
              {q.attempted ? (
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>✅ Completed</span>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => startQuiz(q.id)}>▶️ Start</button>
              )}
            </div>
          ))}
        </div>
      )}
 
      {/* Exam */}
      {tab === 'exam' && activeQuiz && !result && (
        <div>
          {/* Timer Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', padding: '12px 20px', borderRadius: '10px',
            background: timeLeft <= 60 ? '#fef2f2' : '#f0fdf4',
            border: timeLeft <= 60 ? '1px solid #fca5a5' : '1px solid #bbf7d0'
          }}>
            <span style={{ fontWeight: '600' }}>{activeQuiz.quiz}</span>
            <span style={{
              fontWeight: '800', fontSize: '1.2rem', fontFamily: 'monospace',
              color: timeLeft <= 60 ? '#dc2626' : '#166534'
            }}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>
 
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {/* Question Card - Fixed Height */}
            <div className="card" style={{ width: '700px', minHeight: '550px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {currentQ && (
                <div>
                  <p style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '32px', color: '#1e293b', lineHeight: '1.6' }}>
                    Q{currentIndex + 1}. {currentQ.questionText}
                  </p>
 
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <label key={opt} style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                        border: answers[currentQ.id] === opt ? '2px solid #2563eb' : '2px solid #e2e8f0',
                        background: answers[currentQ.id] === opt ? '#dbeafe' : '#fafafa',
                        transition: 'all 0.15s', fontSize: '1rem'
                      }}>
                        <input type="radio" name={`q-${currentQ.id}`} value={opt}
                          checked={answers[currentQ.id] === opt}
                          onChange={() => updateAnswer(currentQ.id, opt)}
                          style={{ width: '20px', height: '20px' }} />
                        <span style={{ fontWeight: '700', color: '#2563eb', minWidth: '22px' }}>{opt}.</span>
                        <span>{currentQ[`option${opt}`]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
 
              {/* Navigation - always at bottom */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <button className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}>
                  ← Previous
                </button>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{currentIndex + 1} / {questions.length}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {currentIndex < questions.length - 1 ? (
                    <>
                      <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        disabled={!answers[currentQ?.id]}>
                        Save & Next →
                      </button>
                      <button className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                        onClick={() => setCurrentIndex(prev => prev + 1)}>
                        Skip →
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', background: '#10b981' }}
                      onClick={submitQuiz}>
                      📤 Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
 
            {/* Question Navigation Panel */}
            <div className="card" style={{ width: '220px', flexShrink: 0 }}>
              <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#64748b' }}>📋 Questions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {questions.map((q, i) => {
                  const isActive = i === currentIndex;
                  const isAnswered = answers[q.id] !== undefined;
                  let bg = '#f1f5f9';
                  let color = '#64748b';
                  let border = '2px solid transparent';
                  if (isActive) { bg = '#fef08a'; color = '#92400e'; border = '2px solid #eab308'; }
                  else if (isAnswered) { bg = '#bbf7d0'; color = '#166534'; border = '2px solid #22c55e'; }
 
                  return (
                    <button key={q.id} onClick={() => setCurrentIndex(i)} style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: bg, color, border,
                      fontWeight: '700', fontSize: '0.85rem',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fef08a', border: '1px solid #eab308' }}></span> Current
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#bbf7d0', border: '1px solid #22c55e' }}></span> Attempted
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f1f5f9', border: '1px solid #e2e8f0' }}></span> Not visited
                </div>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
                Answered: {Object.keys(answers).length} / {questions.length}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px', background: '#10b981' }}
                onClick={submitQuiz} disabled={Object.keys(answers).length === 0}>
                📤 Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Result */}
      {result && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>{result.score >= 70 ? '🎉' : result.score >= 40 ? '👍' : '😢'}</div>
          <h2>Score: {result.score}%</h2>
 
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
            <div style={{ padding: '16px 24px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', minWidth: '120px' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534' }}>{result.correct}</p>
              <p style={{ fontSize: '0.8rem', color: '#166534' }}>✅ Correct</p>
            </div>
            <div style={{ padding: '16px 24px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fca5a5', minWidth: '120px' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#dc2626' }}>{result.wrong}</p>
              <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>❌ Wrong</p>
            </div>
            <div style={{ padding: '16px 24px', borderRadius: '12px', background: '#fffbeb', border: '1px solid #fcd34d', minWidth: '120px' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#92400e' }}>{result.unattempted}</p>
              <p style={{ fontSize: '0.8rem', color: '#92400e' }}>⏭️ Skipped</p>
            </div>
            <div style={{ padding: '16px 24px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', minWidth: '120px' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1d4ed8' }}>{result.attempted}</p>
              <p style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>📝 Attempted</p>
            </div>
          </div>
 
          <p style={{ color: '#64748b', marginTop: '20px', fontSize: '0.9rem' }}>
            Total Questions: {result.totalQuestions} &nbsp;|&nbsp; Attempted: {result.attempted} &nbsp;|&nbsp; Score based on total questions
          </p>
 
          <button className="btn btn-outline" style={{ marginTop: '24px' }} onClick={() => { setTab('quizzes'); setResult(null); }}>← Back to Quizzes</button>
        </div>
      )}
 
      {/* Scorecard */}
      {tab === 'scorecard' && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>📊 My Scorecard</h3>
          {scorecard.length === 0 && <p style={{ color: '#94a3b8' }}>No attempts yet.</p>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Quiz</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px' }}>Quiz #{s.quizId}</td>
                  <td style={{ textAlign: 'center', fontWeight: '700', color: s.score >= 70 ? '#10b981' : s.score >= 40 ? '#f59e0b' : '#ef4444' }}>{s.score}%</td>
                  <td style={{ textAlign: 'center' }}>{s.correctAnswers}/{s.totalQuestions}</td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>{new Date(s.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}