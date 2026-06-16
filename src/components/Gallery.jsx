import './Gallery.css';

export default function Gallery({ gallery }) {
  const defaultGallery = [
    { id: 1, classSuffix: 'g1' },
    { id: 2, classSuffix: 'g2' },
    { id: 3, classSuffix: 'g3' },
    { id: 4, classSuffix: 'g4' },
    { id: 5, classSuffix: 'g5' },
    { id: 6, classSuffix: 'g6' }
  ];

  const list = gallery || defaultGallery;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getPhoto = (item, idx) => {
    if (item.image) {
      const imgUrl = item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `${API_URL}${item.image}`;
      return <img src={imgUrl} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
    }

    const svgs = [
      <svg viewBox="0 0 64 64" key="1"><circle cx="32" cy="26" r="12" fill="#fff" /><path d="M14 52 Q32 40 50 52" stroke="#fff" strokeWidth="4" fill="none" /></svg>,
      <svg viewBox="0 0 64 64" key="2"><rect x="10" y="18" width="44" height="28" rx="4" fill="#fff" /><circle cx="32" cy="32" r="8" fill="rgba(255,255,255,.4)" /></svg>,
      <svg viewBox="0 0 64 64" key="3"><path d="M32 8 L8 50 L56 50 Z" fill="#fff" /></svg>,
      <svg viewBox="0 0 64 64" key="4"><circle cx="20" cy="32" r="10" fill="#fff" /><circle cx="44" cy="32" r="10" fill="rgba(255,255,255,.5)" /></svg>,
      <svg viewBox="0 0 64 64" key="5"><rect x="8" y="8" width="20" height="48" rx="2" fill="#fff" /><rect x="36" y="20" width="20" height="36" rx="2" fill="rgba(255,255,255,.6)" /></svg>,
      <svg viewBox="0 0 64 64" key="6"><path d="M32 6 L36 20 L50 20 L40 28 L44 42 L32 34 L20 42 L24 28 L14 20 L28 20 Z" fill="#fff" /></svg>
    ];
    return svgs[idx % svgs.length];
  };

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-inner">
        <div className="text-center">
          <div className="section-label">Our Gallery</div>
          <h2 className="section-title">
            Moments of <em>Impact</em>
          </h2>
          <p className="section-sub">
            A glimpse into the lives we've touched and the work we've done.
          </p>
        </div>

        <div className="gallery-grid">
          {list.map((item, idx) => (
            <div className="gallery-item" key={item.id || idx}>
              <div className={`gallery-ph ${item.classSuffix}`}>{getPhoto(item, idx)}</div>
              <div className="gallery-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
