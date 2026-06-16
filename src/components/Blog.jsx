import './Blog.css';

export default function Blog({ blog }) {
  const defaultBlog = [
    {
      id: 1,
      category: 'Education',
      date: 'June 2, 2025',
      title: 'How We Helped 200 Children Get Back to School This Year',
      description: 'Through targeted scholarships and infrastructure support, SRAA3 made a real difference in the 2024–25 school year.',
      classSuffix: 'b1'
    },
    {
      id: 2,
      category: 'Healthcare',
      date: 'May 14, 2025',
      title: 'Free Medical Camp Reaches 500 Families in Rural Areas',
      description: 'Our volunteer doctors spent three days providing free checkups, medicines, and follow-up care to underserved families.',
      classSuffix: 'b2'
    },
    {
      id: 3,
      category: 'Clean Water',
      date: 'April 5, 2025',
      title: 'Clean Water Arrives in Three Villages After 6-Month Project',
      description: 'Over 1,200 residents now have access to safe drinking water, dramatically reducing waterborne illness in the region.',
      classSuffix: 'b3'
    }
  ];

  const list = blog || defaultBlog;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getBlogVisual = (post, idx) => {
    if (post.image) {
      const imgUrl = post.image.startsWith('http') || post.image.startsWith('/') ? post.image : `${API_URL}${post.image}`;
      return <img src={imgUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
    }

    const svgs = [
      <svg viewBox="0 0 64 64" key="1"><path d="M12 48 L12 20 L32 8 L52 20 L52 48Z" fill="#fff" /></svg>,
      <svg viewBox="0 0 64 64" key="2"><circle cx="32" cy="28" r="16" fill="#fff" /><path d="M22 44 Q32 36 42 44" stroke="#fff" strokeWidth="3" fill="none" /></svg>,
      <svg viewBox="0 0 64 64" key="3"><path d="M32 8 L44 32 L20 32 Z" fill="#fff" /><rect x="24" y="32" width="16" height="18" fill="rgba(255,255,255,.5)" /></svg>
    ];
    return svgs[idx % svgs.length];
  };

  return (
    <section id="blog" className="blog-section">
      <div className="section-inner">
        <div className="text-center">
          <div className="section-label">Latest Blog</div>
          <h2 className="section-title">
            Stories of <em>Change</em>
            <br />
            & Inspiration
          </h2>
          <p className="section-sub">
            Updates from the field, personal stories, and insights from our team.
          </p>
        </div>

        <div className="blog-grid">
          {list.map((post, idx) => (
            <div className="blog-card" key={post.id || idx}>
              <div className={`blog-ph ${post.classSuffix}`}>{getBlogVisual(post, idx)}</div>
              <div className="blog-meta">
                <span className="blog-cat">{post.category}</span>
                <span className="blog-date">{post.date}</span>
              </div>
              <div className="blog-body">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <a href="#" className="read-more">
                  Read More{' '}
                  <svg viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="#" className="btn-primary">
            View All Posts
          </a>
        </div>
      </div>
    </section>
  );
}
