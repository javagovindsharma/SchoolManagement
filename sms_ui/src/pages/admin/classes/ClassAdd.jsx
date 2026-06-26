import { useState, useEffect } from 'react';
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
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/teachers')
      .then(res => setTeachers(res.data))
      .catch(() => setTeachers([]));
  }, []);

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
        teacherId: form.teacherId || null,
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
              <select
                required
                value={form.className}
                onChange={(e) => update('className', e.target.value)}
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section *</label>
              <select
                required
                value={form.section}
                onChange={(e) => update('section', e.target.value)}
              >
                <option value="">Select Section</option>
                <option value="Section-A">Section-A</option>
                <option value="Section-B">Section-B</option>
                <option value="Section-C">Section-C</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Class Teacher</label>
            <select
              value={form.teacherId}
              onChange={(e) => update('teacherId', e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName || teacher.name}
                </option>
              ))}
            </select>
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
