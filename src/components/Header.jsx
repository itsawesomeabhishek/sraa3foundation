import { useState } from 'react';
import './Header.css';

export default function Header({ onDonateClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="inner">
          <div className="topbar-contact">
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:info@sraa3.org">info@sraa3.org</a>
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +92 300 0000000
            </span>
          </div>
          <span className="topbar-goal">Our Goal: <strong style={{ color: '#7fc4e8' }}>Empowering Communities, Changing Lives</strong></span>
          <div className="topbar-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#home" className="logo">
            <img src="/logo.png" alt="SRAA3 Foundation" style={{ height: '46px', display: 'block' }} />
          </a>
          <div className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#about">About Us</a>
            <a href="#causes">Causes</a>
            <a href="#blog">Blog</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
            <button className="btn-donate" onClick={onDonateClick}>💛 Donate Now</button>
          </div>
          <div className="hamburger" onClick={toggleMenu} aria-label="Menu">
            <span className={mobileMenuOpen ? 'open-span1' : ''}></span>
            <span className={mobileMenuOpen ? 'open-span2' : ''}></span>
            <span className={mobileMenuOpen ? 'open-span3' : ''}></span>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <span className="close-btn" onClick={toggleMenu}>✕</span>
        <a href="#home" onClick={toggleMenu}>Home</a>
        <a href="#about" onClick={toggleMenu}>About Us</a>
        <a href="#causes" onClick={toggleMenu}>Causes</a>
        <a href="#blog" onClick={toggleMenu}>Blog</a>
        <a href="#gallery" onClick={toggleMenu}>Gallery</a>
        <a href="#contact" onClick={toggleMenu}>Contact</a>
        <button 
          onClick={() => { onDonateClick(); toggleMenu(); }} 
          style={{ color: 'var(--green)', background: 'none', border: 'none', fontSize: '22px', fontWeight: '800', cursor: 'pointer' }}
        >
          💛 Donate Now
        </button>
      </div>
    </>
  );
}
