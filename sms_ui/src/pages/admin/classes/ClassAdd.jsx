import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';
import { useLanguage } from '../../../context/LanguageContext';

export default function ClassAdd() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    className: '',
    section: '',
    teacherName: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.className || !form.section) {
      setError('Class name and section are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await API.post('/classes', {
        className: form.className,
        section: form.section,
        teacherName: form.teacherName || null,
        description: form.description || null,
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/classes'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>➕ {t('addClassTitle') || 'Add Class'}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/admin/classes')}>
          ← Back
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          ✅ Class added successfully! Redirecting to classes...
        </div>
      )}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Class Name *</label>
              <input
                required
                placeholder="Grade 10"
                value={form.className}
                onChange={(e) => update('className', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Section *</label>
              <input
                required
                placeholder="A"
                value={form.section}
                onChange={(e) => update('section', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Class Teacher</label>
            <input
              placeholder="Mr. Sunil Perera"
              value={form.teacherName}
              onChange={(e) => update('teacherName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              placeholder="Optional description for this class"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? '⏳ Saving...' : '💾 Save Class'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/classes')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
