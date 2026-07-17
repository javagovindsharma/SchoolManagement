import { Link } from 'react-router-dom';

export default function Branches() {
  const branches = [
    { name: 'DPS Main Campus', code: 'DPS-MAIN', type: 'Main Campus', principal: 'Dr. Rajesh Kumar', address: 'Mathura Road, New Delhi - 110001', phone: '+91-11-11111111', students: 3000, established: 1949 },
    { name: 'DPS East Campus', code: 'DPS-EAST', type: 'Branch', principal: 'Mrs. Priya Sharma', address: 'Patparganj, New Delhi - 110092', phone: '+91-11-22222222', students: 2000, established: 2005 },
    { name: 'DPS South Campus', code: 'DPS-SOUTH', type: 'Branch', principal: 'Mr. Anil Verma', address: 'Saket, New Delhi - 110017', phone: '+91-11-33333333', students: 1500, established: 2010 },
  ];

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Our Branches</h1><p>3 Campuses Across Delhi NCR</p></div></section>
      <section className="section">
        <div className="container">
          <div className="branches-grid">
            {branches.map((b, i) => (
              <div key={i} className="branch-card">
                <div className="branch-header">
                  <span className="branch-icon">🏫</span>
                  <span className="branch-type-badge">{b.type}</span>
                </div>
                <h3>{b.name}</h3>
                <div className="branch-details">
                  <p>👤 <strong>Principal:</strong> {b.principal}</p>
                  <p>📍 {b.address}</p>
                  <p>📞 {b.phone}</p>
                  <p>🎓 {b.students}+ Students</p>
                  <p>📅 Established: {b.established}</p>
                </div>
                <Link to="/contact" className="btn btn-outline w-full">Contact This Branch</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
