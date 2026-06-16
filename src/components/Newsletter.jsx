import { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Error subscribing email:', err);
      alert('Connection error. Please check if server is running.');
    }
  };

  return (
    <section id="newsletter" className="newsletter-section">
      <div className="section-inner newsletter-inner">
        <div className="newsletter-content">
          <div className="section-label" style={{ border: 'none', padding: 0 }}>Stay Updated</div>
          <h2>Subscribe To Our Newsletter</h2>
          <p>Get the latest news, stories of impact, and opportunities to help — straight to your inbox.</p>
          
          {subscribed ? (
            <div className="newsletter-success">
              🎉 Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="nl-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
              <button type="submit">Subscribe Now</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
