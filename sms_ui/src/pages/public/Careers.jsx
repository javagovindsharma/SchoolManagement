export default function Careers() {
  const openings = [
    { title: 'PGT Physics', department: 'Science', experience: '5+ years', type: 'Full Time', deadline: 'Aug 15, 2025' },
    { title: 'TGT Mathematics', department: 'Mathematics', experience: '3+ years', type: 'Full Time', deadline: 'Aug 20, 2025' },
    { title: 'PGT Computer Science', department: 'Technology', experience: '4+ years', type: 'Full Time', deadline: 'Aug 25, 2025' },
    { title: 'Sports Coach (Swimming)', department: 'Sports', experience: '5+ years', type: 'Full Time', deadline: 'Aug 30, 2025' },
    { title: 'School Counselor', department: 'Student Welfare', experience: '3+ years', type: 'Full Time', deadline: 'Sep 05, 2025' },
    { title: 'Librarian', department: 'Library', experience: '3+ years', type: 'Full Time', deadline: 'Sep 10, 2025' },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Careers at DPS</h1><p>Join Our Team of Dedicated Educators</p></div></section>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Current Openings</h2>
            <p>We are looking for passionate educators to join our team</p>
          </div>
          <div className="careers-list">
            {openings.map((job, i) => (
              <div key={i} className="career-card">
                <div className="career-info">
                  <h3>{job.title}</h3>
                  <div className="career-meta">
                    <span>🏢 {job.department}</span>
                    <span>⏰ {job.experience}</span>
                    <span>📋 {job.type}</span>
                  </div>
                </div>
                <div className="career-action">
                  <span className="deadline">Deadline: {job.deadline}</span>
                  <button className="btn btn-primary">Apply →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
