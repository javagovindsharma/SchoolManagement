import { useLanguage } from '../../context/LanguageContext';

export default function Schedule() {
  const { t } = useLanguage();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const schedule = {
    Monday:    [{ time: '8:00',  class: 'Grade 10A', subject: 'Mathematics', room: 'R101' }, { time: '10:00', class: 'Grade 9C', subject: 'Mathematics', room: 'R203' }],
    Tuesday:   [{ time: '9:00',  class: 'Grade 11B', subject: 'Mathematics', room: 'R105' }],
    Wednesday: [{ time: '8:00',  class: 'Grade 10A', subject: 'Mathematics', room: 'R101' }],
    Thursday:  [{ time: '9:00',  class: 'Grade 11B', subject: 'Mathematics', room: 'R105' }],
    Friday:    [{ time: '8:00',  class: 'Grade 10A', subject: 'Mathematics', room: 'R101' }],
  };

  return (
    <div>
      <div className="page-header">
        <h1>📅 {t('mySchedule')}</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {days.map(day => (
          <div key={day} className="card">
            <h3>📅 {day}</h3>
            {schedule[day]?.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                {schedule[day].map((s, i) => (
                  <div key={i} style={{
                    background: '#f0f4ff', borderRadius: '10px', padding: '12px 16px',
                    borderLeft: '4px solid #2563eb', minWidth: '200px'
                  }}>
                    <div style={{ fontWeight: '700', color: '#1e3a5f' }}>{s.time} AM</div>
                    <div style={{ fontSize: '0.9rem', color: '#2563eb', marginTop: '4px' }}>{s.class}</div>
                    <div style={{ fontSize: '0.83rem', color: '#94a3b8' }}>{s.subject} · Room {s.room}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', marginTop: '10px' }}>No classes scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}