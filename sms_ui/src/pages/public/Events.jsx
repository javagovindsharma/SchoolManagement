export default function Events() {
  const events = [
    { date: 'Jul 25, 2025', title: 'Annual Sports Day', type: 'Sports', venue: 'Main Ground', desc: 'Inter-house athletics and sports competitions' },
    { date: 'Aug 05, 2025', title: 'Science Exhibition', type: 'Academic', venue: 'Science Block', desc: 'Student projects and working models display' },
    { date: 'Aug 15, 2025', title: 'Independence Day', type: 'Cultural', venue: 'Main Auditorium', desc: 'Flag hoisting and cultural program' },
    { date: 'Sep 01, 2025', title: 'Parent-Teacher Meeting', type: 'Meeting', venue: 'All Classrooms', desc: 'Half-yearly progress discussion' },
    { date: 'Sep 15, 2025', title: 'Inter-School Debate', type: 'Academic', venue: 'Auditorium', desc: 'Annual inter-school debate competition' },
    { date: 'Oct 10, 2025', title: 'Annual Day', type: 'Cultural', venue: 'Main Auditorium', desc: 'Grand annual day celebration with performances' },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Events & Activities</h1><p>Learning Beyond Classrooms</p></div></section>
      <section className="section">
        <div className="container">
          <div className="events-list">
            {events.map((event, i) => (
              <div key={i} className="event-card">
                <div className="event-date-block">
                  <span className="date-day">{event.date.split(' ')[1].replace(',', '')}</span>
                  <span className="date-month">{event.date.split(' ')[0]}</span>
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                  <div className="event-meta">
                    <span>📍 {event.venue}</span>
                    <span className="event-type-badge">{event.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
