import { useState } from 'react';
import API from '../../api/axios';

export default function AiChat() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ question: currentQuestion, subject })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      setMessages(prev => [...prev, { role: 'ai', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE data lines
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            aiText += line.slice(5);
          } else if (line.trim() && !line.startsWith(':')) {
            aiText += line;
          }
        }
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'ai', text: aiText };
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '❌ Failed to get answer. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AI Study Assistant</h1>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Subject (optional)</label>
          <input placeholder="e.g. Science, Math, History" value={subject}
            onChange={e => setSubject(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📚</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Ask anything from your textbooks!</p>
              <p style={{ fontSize: '0.85rem' }}>Type a question below to get started</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.role === 'ai' && <span style={{ fontWeight: '700' }}>🤖 </span>}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.text === '' && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
              <div style={{ padding: '12px 16px', borderRadius: '16px', background: '#f1f5f9', color: '#64748b' }}>
                🤖 Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ flex: 1 }}
            placeholder="Ask a question... e.g. What is photosynthesis?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !question.trim()}>
            {loading ? '⏳' : '📤 Ask'}
          </button>
        </form>
      </div>
    </div>
  );
}
