import './Stats.css';

export default function Stats({ stats }) {
  const defaultStats = [
    { number: '8,500+', label: 'Lives Impacted' },
    { number: '120+', label: 'Active Volunteers' },
    { number: '15+', label: 'Running Causes' },
    { number: '$400K+', label: 'Funds Raised' }
  ];

  const list = stats || defaultStats;

  return (
    <section id="stats" className="stats-section">
      <div className="section-inner">
        <div className="stats-grid">
          {list.map((stat, idx) => (
            <div className="stat-box" key={idx}>
              <div className="num">{stat.number}</div>
              <div className="stat-divider"></div>
              <div className="lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
