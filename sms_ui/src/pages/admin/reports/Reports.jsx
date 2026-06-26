import { useLanguage } from '../../../context/LanguageContext';

export default function Reports() {
  const { t } = useLanguage();

  const reportCards = [
    { title: t('studentList'),    icon: '🎓', desc: 'Full student list with status',       color: '#dbeafe' },
    { title: 'Attendance Report', icon: '✅', desc: 'Monthly attendance per class',         color: '#dcfce7' },
    { title: 'Marks Report',      icon: '📝', desc: 'Student marks and grade performance', color: '#ede9fe' },
    { title: t('teachers'),       icon: '👨‍🏫', desc: 'Teacher details and subjects',        color: '#fef9c3' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>📊 {t('reports')}</h1>
        <span className="badge badge-blue">2025/2026</span>
      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {reportCards.map(r => (
          <div key={r.title} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px',
                background: r.color, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>
                {r.icon}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{r.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>{r.desc}</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm">📥 Download PDF</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>📈 Quick Stats</h3>
        <div className="grid-4" style={{ marginTop: '16px' }}>
          {[
            { label: 'Avg Attendance',  value: '87%', color: 'progress-green'  },
            { label: 'Pass Rate',       value: '92%', color: 'progress-blue'   },
            { label: 'Active Students', value: '95%', color: 'progress-purple' },
            { label: 'Assignments Done',value: '78%', color: 'progress-yellow' },
          ].map(item => (
            <div key={item.label} className="card" style={{ background: '#f8fafc', boxShadow: 'none' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a5f', marginBottom: '4px' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>{item.label}</div>
              <div className="progress-bar">
                <div className={`progress-fill ${item.color}`} style={{ width: item.value }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}