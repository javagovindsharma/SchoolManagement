import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page-content">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h1>About Delhi Public School</h1>
          <p>A Legacy of Excellence Since 1949</p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="card">
              <div className="card-icon">🎯</div>
              <h3>Our Vision</h3>
              <p>To nurture young minds into responsible global citizens with strong values, academic excellence, and a spirit of inquiry that drives innovation and progress.</p>
            </div>
            <div className="card">
              <div className="card-icon">🚀</div>
              <h3>Our Mission</h3>
              <p>To provide holistic education fostering intellectual growth, creativity, physical fitness, and moral values in a nurturing environment that prepares students for life's challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="section section-alt">
        <div className="container">
          <div className="message-card">
            <div className="message-avatar">
              <div className="avatar-circle">👨‍💼</div>
              <h3>Mr. Ashok Kumar</h3>
              <p>Chairman, DPS Society</p>
            </div>
            <div className="message-content">
              <h2>Chairman's Message</h2>
              <p>
                "Education is the most powerful weapon which you can use to change the world. 
                At Delhi Public School, we are committed to providing world-class education that 
                empowers our students to become leaders of tomorrow. Our schools are not just 
                institutions of learning but cradles of innovation, creativity, and values."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <p>From a humble beginning to a leading educational institution</p>
          </div>
          <div className="timeline">
            {[
              { year: '1949', event: 'Delhi Public School Society established' },
              { year: '1972', event: 'First DPS campus inaugurated in Mathura Road' },
              { year: '2005', event: 'DPS East Campus established' },
              { year: '2010', event: 'DPS South Campus established' },
              { year: '2020', event: 'Digital transformation and smart classrooms' },
              { year: '2025', event: 'Over 5000 students across 3 campuses' },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: '📖', title: 'Knowledge', desc: 'Pursuit of academic excellence and lifelong learning' },
              { icon: '🤝', title: 'Integrity', desc: 'Upholding truth, honesty, and ethical conduct' },
              { icon: '🌱', title: 'Growth', desc: 'Continuous personal and intellectual development' },
              { icon: '🌍', title: 'Service', desc: 'Contributing to community and nation-building' },
              { icon: '💡', title: 'Innovation', desc: 'Embracing creativity and forward thinking' },
              { icon: '❤️', title: 'Compassion', desc: 'Empathy, respect, and care for others' },
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
