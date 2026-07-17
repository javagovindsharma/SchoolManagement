export default function Academics() {
  return (
    <div className="page-content">
      <section className="page-banner">
        <div className="container">
          <h1>Academics</h1>
          <p>CBSE Curriculum | Nursery to Class 12</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Academic Programs</h2>
            <p>Comprehensive education from Pre-Primary to Senior Secondary</p>
          </div>

          <div className="programs-grid">
            {[
              { level: 'Pre-Primary', classes: 'Nursery, LKG, UKG', icon: '🧒', desc: 'Play-based learning with focus on motor skills, language development, and social interaction.' },
              { level: 'Primary', classes: 'Class 1 to 5', icon: '📚', desc: 'Foundation building with emphasis on reading, writing, mathematics, and environmental studies.' },
              { level: 'Middle School', classes: 'Class 6 to 8', icon: '🔬', desc: 'Exploratory learning with introduction to specialized subjects, labs, and project-based learning.' },
              { level: 'Secondary', classes: 'Class 9 to 10', icon: '📝', desc: 'CBSE board preparation with balanced focus on academics, co-curriculars, and life skills.' },
              { level: 'Senior Secondary', classes: 'Class 11 to 12', icon: '🎓', desc: 'Specialized streams - Science, Commerce, Humanities with career counseling and competitive exam prep.' },
            ].map((item, i) => (
              <div key={i} className="program-card">
                <div className="program-icon">{item.icon}</div>
                <h3>{item.level}</h3>
                <span className="program-classes">{item.classes}</span>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Subjects Offered</h2>
          </div>
          <div className="grid-3">
            <div className="card">
              <h4>🔬 Science Stream</h4>
              <ul className="subject-list">
                <li>Physics</li><li>Chemistry</li><li>Mathematics</li>
                <li>Biology</li><li>Computer Science</li><li>English</li>
              </ul>
            </div>
            <div className="card">
              <h4>💼 Commerce Stream</h4>
              <ul className="subject-list">
                <li>Accountancy</li><li>Business Studies</li><li>Economics</li>
                <li>Mathematics</li><li>English</li><li>Informatics Practices</li>
              </ul>
            </div>
            <div className="card">
              <h4>📜 Humanities Stream</h4>
              <ul className="subject-list">
                <li>History</li><li>Political Science</li><li>Geography</li>
                <li>Economics</li><li>Psychology</li><li>English</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
