import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import schoolConfig from '../../config/schoolConfig';

export default function Homepage() {
  const [stats, setStats] = useState({ students: 5000, teachers: 250, branches: 3, awards: 150 });

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-badge">🏆 {schoolConfig.board} Affiliated | Estd. {schoolConfig.establishedYear}</div>
          <h1 className="hero-title">
            Welcome to <span className="highlight">{schoolConfig.name}</span>
          </h1>
          <p className="hero-subtitle">
            {schoolConfig.tagline}
          </p>
          <div className="hero-actions">
            <Link to="/admissions" className="btn btn-primary btn-lg">
              📋 Apply for Admission
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              🔐 ERP Login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><span className="stat-number">5000+</span><span className="stat-label">Students</span></div>
            <div className="stat-item"><span className="stat-number">250+</span><span className="stat-label">Faculty</span></div>
            <div className="stat-item"><span className="stat-number">3</span><span className="stat-label">Campuses</span></div>
            <div className="stat-item"><span className="stat-number">100%</span><span className="stat-label">Results</span></div>
          </div>
        </div>
      </section>

      {/* School Introduction */}
      <section className="section section-intro">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-content">
              <span className="section-badge">About DPS</span>
              <h2>A Legacy of Academic Excellence</h2>
              <p>
                Delhi Public School has been a beacon of quality education since 1949. 
                With state-of-the-art infrastructure, dedicated faculty, and a holistic 
                approach to education, we prepare students to excel in academics, sports, 
                and life.
              </p>
              <p>
                Our CBSE curriculum is enriched with innovative teaching methodologies, 
                technology-enabled classrooms, and a focus on all-round development.
              </p>
              <Link to="/about" className="btn btn-primary">Learn More →</Link>
            </div>
            <div className="intro-image">
              <div className="image-placeholder school-building">
                <span>🏫</span>
                <p>School Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="section section-message">
        <div className="container">
          <div className="message-card">
            <div className="message-avatar">
              <div className="avatar-circle">👨‍💼</div>
              <h3>Dr. Rajesh Kumar</h3>
              <p>Principal, DPS Main Campus</p>
            </div>
            <div className="message-content">
              <h2>Principal's Message</h2>
              <blockquote>
                "At DPS, we believe that every child is unique and has the potential to 
                excel. Our mission is to provide a nurturing environment that fosters 
                intellectual curiosity, creativity, and a strong moral compass. We are 
                committed to preparing our students to be responsible global citizens 
                who can lead with integrity and compassion."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-why">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why DPS</span>
            <h2>Why Choose Delhi Public School?</h2>
            <p>We offer a comprehensive education that goes beyond textbooks</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '🎯', title: 'Academic Excellence', desc: '100% board results with top ranks every year' },
              { icon: '🧪', title: 'Modern Labs', desc: 'State-of-the-art science, computer & language labs' },
              { icon: '🏃', title: 'Sports Academy', desc: 'Olympic-size pool, cricket ground, indoor stadium' },
              { icon: '🎨', title: 'Creative Arts', desc: 'Music, dance, drama, fine arts programs' },
              { icon: '💻', title: 'Smart Classrooms', desc: 'Technology-enabled interactive learning' },
              { icon: '🌍', title: 'Global Exposure', desc: 'International exchange programs & competitions' },
              { icon: '🚌', title: 'Safe Transport', desc: 'GPS-tracked buses covering all areas' },
              { icon: '🏥', title: 'Health & Safety', desc: 'Full-time nurse, counselor & security' },
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

      {/* Achievements */}
      <section className="section section-achievements">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🏆 Achievements</span>
            <h2>Our Pride</h2>
          </div>
          <div className="achievement-grid">
            {[
              { icon: '🥇', title: 'CBSE Board Toppers', desc: 'School topper scored 99.2% in Class 12, 2025', badge: 'Academic' },
              { icon: '🏅', title: 'National Science Olympiad', desc: '15 Gold, 22 Silver medals in NSO 2025', badge: 'Olympiad' },
              { icon: '⚽', title: 'National Sports Champions', desc: 'U-17 Football team - National Champions', badge: 'Sports' },
              { icon: '🖥️', title: 'KVPY Selections', desc: '12 students selected for KVPY Fellowship', badge: 'Competitive' },
            ].map((item, i) => (
              <div key={i} className="achievement-card">
                <div className="achievement-icon">{item.icon}</div>
                <span className="achievement-badge">{item.badge}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/achievements" className="btn btn-primary">View All Achievements →</Link>
          </div>
        </div>
      </section>

      {/* Statistics Counter */}
      <section className="section section-stats">
        <div className="container">
          <div className="stats-counter-grid">
            {[
              { number: '5000+', label: 'Students Enrolled', icon: '🎓' },
              { number: '250+', label: 'Experienced Faculty', icon: '👨‍🏫' },
              { number: '150+', label: 'Awards Won', icon: '🏆' },
              { number: '25+', label: 'Years of Excellence', icon: '⭐' },
              { number: '3', label: 'Campuses', icon: '🏫' },
              { number: '100%', label: 'Board Results', icon: '📊' },
            ].map((item, i) => (
              <div key={i} className="counter-card">
                <span className="counter-icon">{item.icon}</span>
                <span className="counter-number">{item.number}</span>
                <span className="counter-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & News */}
      <section className="section section-events">
        <div className="container">
          <div className="events-news-grid">
            <div className="events-col">
              <h2>📅 Upcoming Events</h2>
              {[
                { date: 'Jul 25', title: 'Annual Sports Day', type: 'Sports' },
                { date: 'Aug 05', title: 'Science Exhibition', type: 'Academic' },
                { date: 'Aug 15', title: 'Independence Day Celebration', type: 'Cultural' },
                { date: 'Sep 01', title: 'Parent-Teacher Meeting', type: 'Meeting' },
              ].map((event, i) => (
                <div key={i} className="event-item">
                  <div className="event-date">
                    <span className="date-day">{event.date.split(' ')[1]}</span>
                    <span className="date-month">{event.date.split(' ')[0]}</span>
                  </div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <span className="event-type">{event.type}</span>
                  </div>
                </div>
              ))}
              <Link to="/events" className="btn btn-outline">View All Events →</Link>
            </div>

            <div className="news-col">
              <h2>📰 Latest News</h2>
              {[
                { date: 'Jul 10, 2025', title: 'DPS students win National Robotics Competition', category: 'Achievement' },
                { date: 'Jul 08, 2025', title: 'New Science Lab inaugurated at East Campus', category: 'Infrastructure' },
                { date: 'Jul 05, 2025', title: 'Admissions open for 2025-26 academic session', category: 'Admission' },
                { date: 'Jul 01, 2025', title: 'Annual Day celebrations concluded with grand show', category: 'Cultural' },
              ].map((news, i) => (
                <div key={i} className="news-item">
                  <span className="news-date">{news.date}</span>
                  <h4>{news.title}</h4>
                  <span className="news-category">{news.category}</span>
                </div>
              ))}
              <Link to="/news" className="btn btn-outline">View All News →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">💬 Testimonials</span>
            <h2>What Parents Say</h2>
          </div>
          <div className="testimonial-grid">
            {[
              { name: 'Mrs. Priya Sharma', relation: 'Parent', text: 'DPS has been instrumental in shaping my child\'s academic and personal growth. The teachers are dedicated and the infrastructure is world-class.' },
              { name: 'Mr. Rajiv Mehta', relation: 'Parent', text: 'The holistic approach to education at DPS ensures that children develop not just academically but also in sports, arts, and life skills.' },
              { name: 'Dr. Anita Kapoor', relation: 'Alumni Parent', text: 'Both my children graduated from DPS and are now successful professionals. The foundation DPS provided is unmatched.' },
            ].map((item, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p>{item.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{item.name[0]}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.relation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-cta">
        <div className="container cta-content">
          <h2>Begin Your Child's Journey to Excellence</h2>
          <p>Admissions are now open for the academic year 2025-26</p>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-primary btn-lg">Apply Now</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Schedule a Visit</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
