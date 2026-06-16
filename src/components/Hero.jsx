import { useState } from 'react';
import './Hero.css';

export default function Hero({ onDonateClick, settings, stats }) {
  const [imageFailed, setImageFailed] = useState(false);
  const siteName = settings?.siteName || "SRAA3 Foundation";
  const rawTitle = settings?.heroTitle || "Our Small *Effort* Makes A *Powerful* Change";
  const heroSubtitle = settings?.heroSubtitle || "Social accountability is at the heart of everything we do. Every being on this planet is born with an innate sense of responsibility — we act on it together.";
  const heroBadgePercent = settings?.heroBadgePercent || "98%";
  const heroBadgeText = settings?.heroBadgeText || "Donation Reaches Beneficiaries";

  const defaultStats = [
    { number: '8,500+', label: 'Lives Touched' },
    { number: '120+', label: 'Volunteers' },
    { number: '15+', label: 'Active Causes' }
  ];

  const heroStats = stats ? stats.slice(0, 3).map(s => ({ number: s.number, label: s.label })) : defaultStats;

  const formatTitle = (title) => {
    if (!title.includes('*')) {
      // For compatibility with previous hardcoded text format
      return (
        <>
          Our Small <em>Effort</em>
          <br />
          Makes A <em>Powerful</em>
          <br />
          Change
        </>
      );
    }
    const parts = title.split('*');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <em key={index}>{part}</em>;
      }
      return part;
    });
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const heroImgUrl = settings?.heroImage ? (settings.heroImage.startsWith('http') || settings.heroImage.startsWith('/') ? settings.heroImage : `${API_URL}${settings.heroImage}`) : '/food-distribution-team.jpeg';

  return (
    <section className="hero" id="home">
      {/* Interactive 3D Ambient Background Logo */}
      <div className="hero-bg-3d">
        <model-viewer
          src="/sraa3 foundation 1.glb"
          alt="SRAA3 Foundation 3D Background"
          auto-rotate
          camera-controls="false"
          interaction-prompt="none"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        ></model-viewer>
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-label">{siteName}</div>
          <h1>
            {formatTitle(rawTitle)}
          </h1>
          <p>
            {heroSubtitle}
          </p>
          <div className="hero-btns">
            <a href="#causes" className="btn-primary">Explore Causes</a>
            <button className="btn-outline" onClick={onDonateClick}>Donate Now</button>
          </div>
          <div className="hero-stats">
            {heroStats.map((stat, idx) => (
              <div className="hero-stat" key={idx}>
                <div className="num">{stat.number}</div>
                <div className="lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-img-wrap">
          <div className="hero-img-card">
            {!imageFailed ? (
              <img 
                src={heroImgUrl} 
                alt="SRAA3 Foundation" 
                className="hero-img"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="hero-img-placeholder">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="70" r="30" fill="#fff" />
                  <path d="M50 150 Q100 110 150 150" stroke="#fff" strokeWidth="8" fill="none" />
                  <path d="M70 140 Q100 120 130 140" stroke="#3DB054" strokeWidth="5" fill="none" />
                </svg>
              </div>
            )}
          </div>
          <div className="hero-badge">
            <div className="hero-badge-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="hero-badge-text">
              <div className="big">{heroBadgePercent}</div>
              <small>{heroBadgeText}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
