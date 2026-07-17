import { useState } from 'react';
import API from '../../../api/axios';

export default function BookUpload() {
  const [file, setFile] = useState(null);
  const [bookName, setBookName] = useState('');
  const [subject, setSubject] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !bookName || !subject) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookName', bookName);
    formData.append('subject', subject);

    setUploading(true);
    setMessage('');

    try {
      await API.post('/rag/books/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Book uploaded and processed successfully!');
      setFile(null);
      setBookName('');
      setSubject('');
    } catch {
      setMessage('❌ Failed to upload book. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📖 Upload Textbook for AI</h1>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          Upload PDF textbooks here. Students can then ask AI questions from these books.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid-3">
            <div className="form-group">
              <label>Book Name *</label>
              <input required placeholder="e.g. Science Grade 10"
                value={bookName} onChange={e => setBookName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input required placeholder="e.g. Science"
                value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="form-group">
              <label>PDF File *</label>
              <input type="file" accept=".pdf" required
                onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={uploading}>
            {uploading ? '⏳ Processing...' : '📤 Upload & Process'}
          </button>
        </form>
      </div>
    </div>
  );
}
