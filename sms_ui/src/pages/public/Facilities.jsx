export default function Facilities() {
  const facilities = [
    { icon: '🔬', title: 'Science Labs', desc: 'Fully equipped Physics, Chemistry, Biology labs with modern instruments' },
    { icon: '💻', title: 'Computer Lab', desc: '200+ workstations with high-speed internet and latest software' },
    { icon: '📚', title: 'Library', desc: '50,000+ books, digital resources, reading rooms, and research corner' },
    { icon: '🏊', title: 'Swimming Pool', desc: 'Olympic-size swimming pool with trained coaches' },
    { icon: '🏟️', title: 'Sports Complex', desc: 'Cricket ground, football field, basketball, badminton, tennis courts' },
    { icon: '🎭', title: 'Auditorium', desc: '1500-seat air-conditioned auditorium for events and performances' },
    { icon: '🎨', title: 'Art Studio', desc: 'Dedicated spaces for painting, sculpture, pottery, and crafts' },
    { icon: '🎵', title: 'Music Room', desc: 'Sound-proof music room with all Indian and Western instruments' },
    { icon: '🏥', title: 'Medical Room', desc: 'Full-time nurse, first-aid, and tie-up with nearby hospitals' },
    { icon: '🍽️', title: 'Cafeteria', desc: 'Hygienic cafeteria serving nutritious meals and snacks' },
    { icon: '🚌', title: 'Transport', desc: 'GPS-tracked AC buses covering all major routes' },
    { icon: '📡', title: 'Smart Classes', desc: 'Interactive whiteboards and projectors in every classroom' },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Facilities</h1><p>World-Class Infrastructure for Holistic Development</p></div></section>
      <section className="section">
        <div className="container">
          <div className="features-grid">
            {facilities.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
