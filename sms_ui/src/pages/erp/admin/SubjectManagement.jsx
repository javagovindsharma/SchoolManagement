import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', subjectType: 'THEORY', category: 'CORE', maxMarksTheory: 100, passingMarks: 33 });

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects');
      setSubjects(res.data?.data || res.data || []);
    } catch { toast.error('Failed to load subjects'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/subjects', form);
      toast.success('Subject created!');
      setShowForm(false);
      setForm({ name: '', code: '', subjectType: 'THEORY', category: 'CORE', maxMarksTheory: 100, passingMarks: 33 });
      fetchSubjects();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create subject'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try { await API.delete(`/subjects/${id}`); toast.success('Deleted'); fetchSubjects(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📚 Subject Management</h1><p>Manage subjects and allocations</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Subject</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {subjects.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📚</span><h3>No subjects found</h3><p>Click "+ Add Subject" to create one</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Subject</th><th>Code</th><th>Type</th><th>Category</th><th>Max Marks</th><th>Pass Marks</th><th>Actions</th></tr></thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td><code>{s.code}</code></td>
                    <td>{s.subjectType}</td>
                    <td><span className="badge badge-blue">{s.category}</span></td>
                    <td>{s.maxMarksTheory}</td>
                    <td>{s.passingMarks}</td>
                    <td><button className="btn-icon" onClick={() => handleDelete(s.id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Add New Subject</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Subject Name *</label><input required placeholder="e.g. Mathematics" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label>Code</label><input placeholder="e.g. MAT" value={form.code} onChange={e => setForm({...form, code: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Type</label>
                  <select value={form.subjectType} onChange={e => setForm({...form, subjectType: e.target.value})}>
                    <option value="THEORY">Theory</option><option value="PRACTICAL">Practical</option><option value="BOTH">Both</option>
                  </select>
                </div>
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="CORE">Core</option><option value="ELECTIVE">Elective</option><option value="OPTIONAL">Optional</option><option value="EXTRA_CURRICULAR">Extra Curricular</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Max Marks</label><input type="number" value={form.maxMarksTheory} onChange={e => setForm({...form, maxMarksTheory: e.target.value})} /></div>
                <div className="form-group"><label>Passing Marks</label><input type="number" value={form.passingMarks} onChange={e => setForm({...form, passingMarks: e.target.value})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
