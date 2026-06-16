import './Team.css';

export default function Team({ team }) {
  const defaultTeam = [
    {
      id: 1,
      name: 'Ahmed Raza',
      role: 'Founder & President',
      description: 'Visionary leader with 15+ years in community development and social impact.',
      classSuffix: ''
    },
    {
      id: 2,
      name: 'Sara Ali',
      role: 'Head of Operations',
      description: 'Oversees all field programs and ensures resources reach those who need them most.',
      classSuffix: 'c2'
    },
    {
      id: 3,
      name: 'Dr. Asim Khan',
      role: 'Medical Director',
      description: 'Leads all healthcare initiatives and medical camp programmes across regions.',
      classSuffix: 'c3'
    },
    {
      id: 4,
      name: 'Nadia Hussain',
      role: 'Education Coordinator',
      description: 'Builds school partnerships and manages our scholarship and tutoring programs.',
      classSuffix: 'c4'
    }
  ];

  const list = team || defaultTeam;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getAvatar = (member) => {
    if (member.image) {
      const imgUrl = member.image.startsWith('http') || member.image.startsWith('/') ? member.image : `${API_URL}${member.image}`;
      return <img src={imgUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50%' }} />;
    }
    return (
      <div className="team-avatar">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
    );
  };

  return (
    <section id="team" className="team-section">
      <div className="section-inner">
        <div className="text-center">
          <div className="section-label">Our Team</div>
          <h2 className="section-title">
            Meet The <em>Dedicated</em> People
            <br />
            Behind SRAA3
          </h2>
          <p className="section-sub">
            Passionate individuals committed to driving meaningful change in communities.
          </p>
        </div>

        <div className="team-grid">
          {list.map(member => (
            <div className="team-card" key={member.id}>
              <div className={`team-ph ${member.classSuffix}`}>
                {getAvatar(member)}
              </div>
              <div className="team-info">
                <h4>{member.name}</h4>
                <div className="role">{member.role}</div>
                <p>{member.description}</p>
                <div className="team-social">
                  <a href="#" aria-label="Facebook">f</a>
                  <a href="#" aria-label="LinkedIn">in</a>
                  <a href="#" aria-label="Twitter">𝕏</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
