import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        {/* Brand Section */}
        <div className="footer-col footer-brand">
          <a href="#home" className="footer-logo-card">
            <img src="/logo.png" alt="SRAA3 Foundation" />
          </a>
          <p className="footer-desc">
            Social Accountability is a matter of great responsibility. Every being on this planet is born with an innate sense of responsibility — we act on it together.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#causes">Causes</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Corporate Office Column */}
        <div className="footer-col footer-office">
          <h4>Corporate Office</h4>
          <ul className="footer-contact">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>P.O Box 3002, Main Street, Chandigarh, India</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span><a href="mailto:info@sraa3.org">info@sraa3.org</a></span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>+92 300 0000000</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="footer-bottom">
        <div className="section-inner footer-bottom-inner">
          <p>© {currentYear} SRAA3 Foundation. All rights reserved. Created by Abhishek.</p>
          <div className="footer-bottom-actions">
            <span>React + Vite Development</span>
            <button onClick={handleScrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
