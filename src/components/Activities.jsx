import './Activities.css';

export default function Activities({ activities }) {
  const defaultActivities = [
    {
      title: 'Child Education',
      description: 'Building schools, sponsoring students, and training teachers to create lasting educational ecosystems.'
    },
    {
      title: 'Medical Help',
      description: 'Organising free health camps, medicine drives, and connecting communities with essential care.'
    },
    {
      title: 'Nutritious Food',
      description: 'Running food distribution programs to ensure no child or family goes to bed hungry.'
    },
    {
      title: 'Clean Water',
      description: 'Installing water pumps and purification systems in villages without access to safe drinking water.'
    }
  ];

  const list = activities || defaultActivities;

  const getIconForIndex = (index) => {
    const icons = [
      <svg viewBox="0 0 24 24" key="a1">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>,
      <svg viewBox="0 0 24 24" key="a2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>,
      <svg viewBox="0 0 24 24" key="a3">
        <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
      </svg>,
      <svg viewBox="0 0 24 24" key="a4">
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 6.6A10.97 10.97 0 0014 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 01-11.91 4.97" />
      </svg>
    ];
    return icons[index % icons.length];
  };

  return (
    <section id="causes-section" className="activities-section">
      <div className="section-inner">
        <div className="text-center">
          <div className="section-label">Our Concern</div>
          <h2 className="section-title">
            Explore Our <em>Impactful</em> Activities
          </h2>
          <p className="section-sub">
            From classrooms to clinics, from fields to wells — SRAA3 Foundation is present where it matters most.
          </p>
        </div>
        <div className="activities-grid">
          {list.map((act, idx) => (
            <div className="activity-card" key={idx}>
              <div className="activity-icon">{getIconForIndex(idx)}</div>
              <h3>{act.title}</h3>
              <p>{act.description}</p>
              <a href="#" className="btn-ghost">
                View Details{' '}
                <svg viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
