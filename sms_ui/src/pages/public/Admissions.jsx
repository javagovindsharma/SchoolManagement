import { Link } from 'react-router-dom';

export default function Admissions() {
  return (
    <div className="page-content">
      <section className="page-banner">
        <div className="container">
          <h1>Admissions 2025-26</h1>
          <p>Join the DPS Family — Applications Now Open</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div>
              <h2>Admission Process</h2>
              <div className="process-steps">
                {[
                  { step: 1, title: 'Online Application', desc: 'Fill the online admission form with required details' },
                  { step: 2, title: 'Document Submission', desc: 'Upload required documents (birth certificate, photos, etc.)' },
                  { step: 3, title: 'Entrance Assessment', desc: 'Age-appropriate assessment for the applying class' },
                  { step: 4, title: 'Interview', desc: 'Interaction with parents and child' },
                  { step: 5, title: 'Selection & Enrollment', desc: 'Merit-based selection and fee payment' },
                ].map(item => (
                  <div key={item.step} className="step-item">
                    <div className="step-number">{item.step}</div>
                    <div className="step-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card admission-cta-card">
                <h3>📋 Apply Online</h3>
                <p>Start your child's journey at DPS today</p>
                <div className="admission-info">
                  <p><strong>Classes Available:</strong> Nursery to Class 11</p>
                  <p><strong>Application Fee:</strong> ₹1,000</p>
                  <p><strong>Last Date:</strong> August 31, 2025</p>
                </div>
                <Link to="/login" className="btn btn-primary btn-lg w-full">Apply Now →</Link>
              </div>

              <div className="card" style={{ marginTop: '1rem' }}>
                <h4>📞 Admission Helpline</h4>
                <p>+91-11-12345678 (Mon-Sat, 9 AM - 4 PM)</p>
                <p>✉️ admissions@dps.edu.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Required Documents</h2>
          </div>
          <div className="grid-3">
            {[
              'Birth Certificate', 'Aadhar Card (Student)', 'Aadhar Card (Parents)',
              'Previous School TC', 'Report Card (Last 2 years)', 'Passport Size Photos (6)',
              'Address Proof', 'Category Certificate (if applicable)', 'Medical Fitness Certificate'
            ].map((doc, i) => (
              <div key={i} className="doc-item">
                <span className="doc-icon">📄</span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
