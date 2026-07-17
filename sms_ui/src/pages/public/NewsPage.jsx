export default function NewsPage() {
  const news = [
    { date: 'Jul 10, 2025', title: 'DPS Students Win National Robotics Competition', category: 'Achievement', excerpt: 'Three students from Class 11 won first prize at the National Robotics Championship held in Bengaluru.' },
    { date: 'Jul 08, 2025', title: 'New Science Lab Inaugurated at East Campus', category: 'Infrastructure', excerpt: 'State-of-the-art Physics and Chemistry labs inaugurated by the Education Minister.' },
    { date: 'Jul 05, 2025', title: 'Admissions Open for 2025-26', category: 'Admission', excerpt: 'Online applications are now being accepted for Nursery to Class 11 for the upcoming academic session.' },
    { date: 'Jul 01, 2025', title: 'Annual Day 2025 - A Grand Celebration', category: 'Cultural', excerpt: 'Annual Day celebrations concluded with spectacular performances by over 500 students.' },
    { date: 'Jun 28, 2025', title: '12 Students Selected for KVPY', category: 'Academic', excerpt: 'Proud moment for DPS as 12 students from Class 12 selected for KVPY Fellowship.' },
    { date: 'Jun 25, 2025', title: 'DPS Football Team Wins National Championship', category: 'Sports', excerpt: 'The U-17 football team won the CBSE National Championship defeating 200+ school teams.' },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Latest News</h1><p>Stay Updated with DPS</p></div></section>
      <section className="section">
        <div className="container">
          <div className="news-grid">
            {news.map((item, i) => (
              <div key={i} className="news-card">
                <div className="news-card-header">
                  <span className="news-category-badge">{item.category}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <button className="btn btn-text">Read More →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
