import './Causes.css';

export default function Causes({ onDonateClick, causes }) {
  const defaultCauses = [
    {
      id: 1,
      tag: 'Education',
      title: 'Better Education For All',
      description: 'Every child deserves access to quality education regardless of their background or economic status.',
      percentage: 91,
      raised: 38500,
      goal: 42000,
      gradientClass: ''
    },
    {
      id: 2,
      tag: 'Healthcare',
      title: 'Health Care For All',
      description: 'Providing accessible, affordable medical care to communities who have been left behind by the system.',
      percentage: 78,
      raised: 22100,
      goal: 28400,
      gradientClass: 'g2'
    },
    {
      id: 3,
      tag: 'Nutrition',
      title: 'Ensure Healthy Food For All',
      description: 'Combating hunger and malnutrition through sustainable food programs and community kitchens.',
      percentage: 85,
      raised: 17850,
      goal: 21000,
      gradientClass: 'g3'
    }
  ];

  const list = causes || defaultCauses;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getVisual = (cause) => {
    if (cause.image) {
      const imgUrl = cause.image.startsWith('http') || cause.image.startsWith('/') ? cause.image : `${API_URL}${cause.image}`;
      return <img src={imgUrl} alt={cause.title} className="cause-ph-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
    }

    if (cause.id === 1 || cause.tag?.toLowerCase() === 'education') {
      return (
        <svg viewBox="0 0 64 64">
          <path d="M32 8L8 22v32h48V22z" fill="#fff" />
          <rect x="26" y="32" width="12" height="20" fill="rgba(255,255,255,.4)" />
        </svg>
      );
    }
    if (cause.id === 2 || cause.tag?.toLowerCase() === 'healthcare') {
      return (
        <svg viewBox="0 0 64 64">
          <path d="M32 8 L44 20 L44 36 L32 48 L20 36 L20 20 Z" fill="#fff" />
          <rect x="28" y="24" width="8" height="12" fill="rgba(255,255,255,.4)" />
          <rect x="24" y="28" width="16" height="4" fill="rgba(255,255,255,.4)" />
        </svg>
      );
    }
    if (cause.id === 3 || cause.tag?.toLowerCase() === 'nutrition') {
      return (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="28" r="16" fill="#fff" />
          <path d="M22 44 Q32 38 42 44" stroke="#fff" strokeWidth="3" fill="none" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" fill="#fff" style={{ width: '40px', height: '40px' }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  };

  return (
    <section id="causes" className="causes-section">
      <div className="section-inner">
        <div className="text-center">
          <div className="section-label">Recent Causes</div>
          <h2 className="section-title">
            Our <em>Causes</em> To Help Others,
            <br />
            Please <em>Join</em> With Us
          </h2>
        </div>

        <div className="causes-grid">
          {list.map(cause => (
            <div className="cause-card" key={cause.id}>
              {/* Visual Placeholder */}
              <div className={`cause-ph ${cause.gradientClass}`}>
                {getVisual(cause)}
              </div>

              {/* Card Body */}
              <div className="cause-body">
                <div className="cause-tag">{cause.tag}</div>
                <h3>{cause.title}</h3>
                <p>{cause.description}</p>
                <div className="cause-progress">
                  <label>
                    <span>Donation</span>
                    <span>{cause.percentage}%</span>
                  </label>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cause.percentage}%` }}></div>
                  </div>
                </div>
                <div className="cause-meta">
                  <span>Raised: ${cause.raised.toLocaleString()}</span>
                  <span>Goal: ${cause.goal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn-primary" onClick={onDonateClick}>
            Support A Cause
          </button>
        </div>
      </div>
    </section>
  );
}
