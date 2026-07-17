import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been sent. We will get back to you shortly.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="page-content">
      <section className="page-banner"><div className="container"><h1>Contact Us</h1><p>We'd Love to Hear From You</p></div></section>
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div>
              <h2>Get in Touch</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91-" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option value="">Select Subject</option>
                    <option>Admission Enquiry</option>
                    <option>Fee Related</option>
                    <option>General Query</option>
                    <option>Feedback</option>
                    <option>Complaint</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Your message..." />
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Send Message 📨</button>
              </form>
            </div>

            <div>
              <div className="contact-info-cards">
                <div className="card">
                  <h4>🏫 Main Campus</h4>
                  <p>📍 Mathura Road, New Delhi - 110001</p>
                  <p>📞 +91-11-11111111</p>
                  <p>✉️ main@dps.edu.in</p>
                </div>
                <div className="card">
                  <h4>🏫 East Campus</h4>
                  <p>📍 Patparganj, New Delhi - 110092</p>
                  <p>📞 +91-11-22222222</p>
                  <p>✉️ east@dps.edu.in</p>
                </div>
                <div className="card">
                  <h4>🏫 South Campus</h4>
                  <p>📍 Saket, New Delhi - 110017</p>
                  <p>📞 +91-11-33333333</p>
                  <p>✉️ south@dps.edu.in</p>
                </div>
                <div className="card">
                  <h4>⏰ Office Hours</h4>
                  <p>Monday - Saturday: 8:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
