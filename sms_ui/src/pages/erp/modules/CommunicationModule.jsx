import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

export default function CommunicationModule() {
  const [tab, setTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', notificationType: 'IN_APP', targetType: 'ALL', priority: 'MEDIUM' });

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data?.data || res.data || []);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notifications', form);
      toast.success('Notification sent!');
      setShowForm(false);
      setForm({ title: '', message: '', notificationType: 'IN_APP', targetType: 'ALL', priority: 'MEDIUM' });
      fetchNotifications();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send notification'); }
  };

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📢 Communication</h1><p>Notifications, circulars, and messaging</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Send Notification</button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'notifications' ? 'active' : ''}`} onClick={() => setTab('notifications')}>Notifications</button>
        <button className={`tab-btn ${tab === 'circulars' ? 'active' : ''}`} onClick={() => setTab('circulars')}>Circulars</button>
        <button className={`tab-btn ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>Messages</button>
      </div>

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <div className="data-table-container">
          {notifications.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📢</span><h3>No notifications yet</h3><p>Click "+ Send Notification" to create one</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Title</th><th>Type</th><th>Target</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {notifications.map(n => (
                  <tr key={n.id}>
                    <td><strong>{n.title}</strong><br/><small style={{color:'var(--text-muted)'}}>{n.message?.substring(0,50)}...</small></td>
                    <td>{n.notificationType}</td>
                    <td>{n.targetType}</td>
                    <td><span className={`badge ${n.priority === 'HIGH' ? 'badge-red' : n.priority === 'URGENT' ? 'badge-purple' : 'badge-blue'}`}>{n.priority}</span></td>
                    <td><span className="badge badge-green">{n.status || 'SENT'}</span></td>
                    <td>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '-'}</td>
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
            <div className="modal-header"><h2>Send Notification</h2><button className="btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group"><label>Title *</label><input required placeholder="Notification title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="form-group"><label>Message *</label><textarea required rows={4} placeholder="Write your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Type</label>
                  <select value={form.notificationType} onChange={e => setForm({...form, notificationType: e.target.value})}>
                    <option value="IN_APP">In-App</option><option value="EMAIL">Email</option><option value="SMS">SMS</option><option value="PUSH">Push</option>
                  </select>
                </div>
                <div className="form-group"><label>Target</label>
                  <select value={form.targetType} onChange={e => setForm({...form, targetType: e.target.value})}>
                    <option value="ALL">All</option><option value="BRANCH">Branch</option><option value="CLASS">Class</option><option value="ROLE">Role</option><option value="INDIVIDUAL">Individual</option>
                  </select>
                </div>
                <div className="form-group"><label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Notification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
