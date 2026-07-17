import { useState } from 'react';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('photos');

  const albums = [
    { title: 'Annual Day 2025', count: 45, cover: '🎭' },
    { title: 'Sports Day 2025', count: 32, cover: '🏃' },
    { title: 'Science Exhibition', count: 28, cover: '🔬' },
    { title: 'Independence Day', count: 20, cover: '🇮🇳' },
    { title: 'Teacher\'s Day', count: 15, cover: '👨‍🏫' },
    { title: 'School Infrastructure', count: 22, cover: '🏫' },
    { title: 'Art & Craft Exhibition', count: 18, cover: '🎨' },
    { title: 'Graduation Ceremony', count: 35, cover: '🎓' },
  ];

  const videos = [
    { title: 'Annual Day Highlights 2025', duration: '5:30' },
    { title: 'DPS School Tour', duration: '3:45' },
    { title: 'Sports Champions 2025', duration: '4:20' },
    { title: 'Science Lab Demonstration', duration: '6:15' },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Gallery</h1><p>Capturing Memories & Moments</p></div></section>
      <section className="section">
        <div className="container">
          <div className="tab-nav">
            <button className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>📷 Photo Gallery</button>
            <button className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>🎬 Video Gallery</button>
          </div>

          {activeTab === 'photos' && (
            <div className="gallery-grid">
              {albums.map((album, i) => (
                <div key={i} className="gallery-card">
                  <div className="gallery-cover">{album.cover}</div>
                  <div className="gallery-info">
                    <h4>{album.title}</h4>
                    <span>{album.count} Photos</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="gallery-grid">
              {videos.map((video, i) => (
                <div key={i} className="gallery-card video-card">
                  <div className="gallery-cover">🎬</div>
                  <div className="gallery-info">
                    <h4>{video.title}</h4>
                    <span>⏱️ {video.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
