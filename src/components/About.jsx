import { useState } from 'react';
import './About.css';

export default function About({ settings }) {
  const [failedImages, setFailedImages] = useState({});
  const aboutLead = settings?.aboutLead || "Social Accountability is a matter of great and important responsibility. Every being on this planet is born with an innate sense of responsibility. We human beings may not always be able to carry out our duties, but we try our best.";
  const aboutDesc = settings?.aboutDesc || "SRAA3 Foundation works tirelessly across education, healthcare, nutrition, and community development — reaching those who need it most.";
  
  const defaultFeatures = [
    {
      title: 'Education For All',
      description: 'Providing quality learning opportunities to underprivileged children and youth.'
    },
    {
      title: 'Health & Wellness',
      description: 'Free medical camps and healthcare services for remote and underserved communities.'
    },
    {
      title: 'Long-Term Impact',
      description: 'We focus on sustainable change, not just immediate relief.'
    }
  ];

  const features = settings?.aboutFeatures || defaultFeatures;

  const handleImgError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const getIconForIndex = (index) => {
    const icons = [
      <svg viewBox="0 0 24 24" key="i1">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>,
      <svg viewBox="0 0 24 24" key="i2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>,
      <svg viewBox="0 0 24 24" key="i3">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ];
    return icons[index % icons.length];
  };

  return (
    <section id="about" className="about-section">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-imgs">
            <div className="about-img">
              {!failedImages[1] ? (
                <img 
                  src="/education-girl.jpeg" 
                  alt="Education" 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  onError={() => handleImgError(1)}
                />
              ) : (
                <div className="about-img-ph">
                  <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="22" r="12" fill="#fff" />
                    <path d="M12 52 Q32 36 52 52" stroke="#fff" strokeWidth="4" fill="none" />
                  </svg>
                </div>
              )}
            </div>
            <div className="about-img">
              {!failedImages[2] ? (
                <img 
                  src="/food-distribution-queue.jpeg" 
                  alt="Nutrition" 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  onError={() => handleImgError(2)}
                />
              ) : (
                <div className="about-img-ph">
                  <svg viewBox="0 0 64 64">
                    <rect x="14" y="18" width="36" height="28" rx="3" fill="#fff" />
                    <path d="M22 46 L22 52 M42 46 L42 52" stroke="#fff" strokeWidth="3" fill="none" />
                  </svg>
                </div>
              )}
            </div>
            <div className="about-img" style={{ gridColumn: 'span 2' }}>
              {!failedImages[3] ? (
                <img 
                  src="/blood-donation-2.jpeg" 
                  alt="Healthcare" 
                  style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }}
                  onError={() => handleImgError(3)}
                />
              ) : (
                <div className="about-img-ph" style={{ height: '130px', background: 'linear-gradient(135deg, var(--navy), var(--green))' }}>
                  <svg viewBox="0 0 64 64">
                    <path d="M8 48 C16 32 48 32 56 48" stroke="#fff" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="20" r="8" fill="#fff" />
                    <circle cx="16" cy="26" r="6" fill="rgba(255,255,255,.5)" />
                    <circle cx="48" cy="26" r="6" fill="rgba(255,255,255,.5)" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="about-content">
            <div className="section-label">About Us</div>
            <h2 className="section-title">
              Welcome To <em>SRAA3</em> Foundation
            </h2>
            <p className="about-lead-text">
              {aboutLead}
            </p>
            <p className="about-desc-text">
              {aboutDesc}
            </p>
            <div className="about-feat">
              {features.map((feat, idx) => (
                <div className="about-feat-item" key={idx}>
                  <div className="feat-icon">{getIconForIndex(idx)}</div>
                  <div className="feat-text">
                    <h4>{feat.title}</h4>
                    <p>{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="#causes" className="btn-primary" style={{ marginTop: '28px' }}>
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
