export default function Achievements() {
  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Achievements</h1><p>Our Students, Our Pride</p></div></section>
      <section className="section">
        <div className="container">
          <div className="section-header"><h2>🏆 Academic Achievements</h2></div>
          <div className="achievement-grid">
            {[
              { name: 'Arjun Verma', class: 'XII', score: '99.2%', exam: 'CBSE Board 2025', medal: '🥇' },
              { name: 'Priya Singh', class: 'XII', score: '98.8%', exam: 'CBSE Board 2025', medal: '🥇' },
              { name: 'Rahul Kumar', class: 'X', score: '99.0%', exam: 'CBSE Board 2025', medal: '🥇' },
              { name: 'Sneha Kapoor', class: 'X', score: '98.6%', exam: 'CBSE Board 2025', medal: '🥈' },
            ].map((a, i) => (
              <div key={i} className="achievement-card">
                <div className="achievement-icon">{a.medal}</div>
                <h3>{a.name}</h3>
                <p>Class {a.class} | {a.score}</p>
                <span className="achievement-badge">{a.exam}</span>
              </div>
            ))}
          </div>

          <div className="section-header" style={{marginTop:'3rem'}}><h2>🏅 Sports Achievements</h2></div>
          <div className="achievement-grid">
            {[
              { title: 'National Football Champions', desc: 'U-17 team won CBSE National Championship', medal: '🥇' },
              { title: 'Swimming - 5 Gold Medals', desc: 'State-level swimming championship 2025', medal: '🥇' },
              { title: 'Athletics - National Level', desc: '3 students qualified for national athletics', medal: '🥈' },
              { title: 'Chess - State Champions', desc: 'Team won state chess championship', medal: '🥇' },
            ].map((a, i) => (
              <div key={i} className="achievement-card">
                <div className="achievement-icon">{a.medal}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="achievement-badge">Sports</span>
              </div>
            ))}
          </div>

          <div className="section-header" style={{marginTop:'3rem'}}><h2>🧠 Olympiad & Competitive Exams</h2></div>
          <div className="achievement-grid">
            {[
              { title: '15 Gold in NSO', desc: 'National Science Olympiad 2025', medal: '🥇' },
              { title: '12 KVPY Selections', desc: 'KVPY Fellowship 2025', medal: '🏅' },
              { title: '8 NTSE Scholars', desc: 'National Talent Search Examination', medal: '🏅' },
              { title: '5 JEE Advanced Top 500', desc: 'IIT JEE Advanced 2025', medal: '🥇' },
            ].map((a, i) => (
              <div key={i} className="achievement-card">
                <div className="achievement-icon">{a.medal}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="achievement-badge">Competitive</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
