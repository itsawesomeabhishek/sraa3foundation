import './Volunteer.css';

export default function Volunteer({ onDonateClick }) {
  return (
    <section className="volunteer-section">
      <div className="volunteer-overlay"></div>
      <div className="section-inner volunteer-inner">
        <div className="volunteer-content">
          <span className="volunteer-label">Join Our Mission</span>
          <h2>We Need Your Help To Empower Communities</h2>
          <p>
            Become a volunteer or support our causes financially. Your time, skills, and contributions can bring light and hope to those who need it most.
          </p>
          <div className="volunteer-btns">
            <a href="#contact" className="btn-primary-alt">Become A Volunteer</a>
            <button className="btn-outline-alt" onClick={onDonateClick}>Donate Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
