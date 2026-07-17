import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', section: 'A', numericName: '', description: '' });

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const res = await API.get('/classes');
      setClasses(res.data?.data || res.data || []);
    } catch { toast.error('Failed to load classes'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/classes', form);
      toast.success('Class created!');
      setShowForm(false);
      setForm({ name: '', section: 'A', numericName: '', description: '' });
      fetchClasses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create class'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try { await API.delete(`/classes/${id}`); toast.success('Deleted'); fetchClasses(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>🏫 Class & Section Management</h1><p>Manage classes and sections</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Class</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {classes.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🏫</span><h3>No classes found</h3><p>Click "+ Add Class" to create one</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Class Name</th><th>Section</th><th>Numeric</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.section}</td>
                    <td>{c.numericName}</td>
                    <td>{c.description}</td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td><button className="btn-icon" onClick={() => handleDelete(c.id)}>🗑️</button></td>
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
            <div className="modal-header"><h2>Add New Class</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group"><label>Class Name *</label><input required placeholder="e.g. Class 10" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Section *</label>
                  <select required value={form.section} onChange={e => setForm({...form, section: e.target.value})}>
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option>
                  </select>
                </div>
                <div className="form-group"><label>Numeric Name</label><input type="number" placeholder="e.g. 10" value={form.numericName} onChange={e => setForm({...form, numericName: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
