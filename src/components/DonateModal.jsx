import { useState, useEffect } from 'react';
import './DonateModal.css';

export default function DonateModal({ isOpen, onClose, causes, onDonationSuccess }) {
  const [amount, setAmount] = useState('50');
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [causeId, setCauseId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (causes && causes.length > 0 && !causeId) {
      setCauseId(causes[0].id.toString());
    }
  }, [causes, causeId]);

  if (!isOpen) return null;

  const presets = ['10', '25', '50', '100'];

  const handlePresetSelect = (preset) => {
    setAmount(preset);
    setIsCustom(false);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomAmount(val);
      setAmount(val);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          causeId: parseInt(causeId) || 1,
          donorName: formData.name,
          email: formData.email,
          amount: parseFloat(amount),
          paymentMethod: 'Card'
        })
      });
      if (res.ok) {
        setIsCompleted(true);
        if (onDonationSuccess) {
          onDonationSuccess();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Donation submission failed');
      }
    } catch (err) {
      console.error('Error submitting donation:', err);
      alert('Connection error. Please check if server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsCompleted(false);
    setAmount('50');
    setIsCustom(false);
    setCustomAmount('');
    setFormData({ name: '', email: '', cardNumber: '', expiry: '', cvv: '' });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        {isCompleted ? (
          <div className="modal-success">
            <div className="success-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Thank You For Your Support!</h2>
            <p>Your contribution of <strong>${amount}</strong> will make a direct difference in our community programs.</p>
            <button onClick={handleCloseSuccess} className="btn-primary" style={{ marginTop: '24px' }}>
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <h3>Support SRAA3 Foundation</h3>
            <p className="modal-sub">Your donation helps finance school builds, clinic runs, and meals distribution.</p>

            {/* Cause Selection */}
            {causes && causes.length > 0 && (
              <div className="amount-group">
                <label className="group-title">Select A Cause</label>
                <select
                  value={causeId}
                  onChange={(e) => setCauseId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '15px',
                    background: '#f7fafc',
                    color: 'var(--text)',
                    fontFamily: 'Montserrat, sans-serif',
                    outline: 'none',
                    fontWeight: '600'
                  }}
                  required
                >
                  {causes.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount Select Grid */}
            <div className="amount-group">
              <label className="group-title">Select Donation Amount</label>
              <div className="preset-grid">
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`preset-btn ${!isCustom && amount === p ? 'active' : ''}`}
                    onClick={() => handlePresetSelect(p)}
                  >
                    ${p}
                  </button>
                ))}
                <button
                  type="button"
                  className={`preset-btn ${isCustom ? 'active' : ''}`}
                  onClick={() => setIsCustom(true)}
                >
                  Custom
                </button>
              </div>

              {isCustom && (
                <div className="custom-input-wrap">
                  <span className="currency">$</span>
                  <input
                    type="text"
                    required
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Enter amount"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Billing Fields */}
            <div className="billing-group">
              <label className="group-title">Donor Information</label>
              <div className="form-row">
                <div className="form-field">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                </div>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="payment-group">
              <label className="group-title">Payment Information</label>
              <div className="form-field">
                <input
                  type="text"
                  name="cardNumber"
                  required
                  maxLength="19"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Card Number (0000 0000 0000 0000)"
                />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <input
                    type="text"
                    name="expiry"
                    required
                    maxLength="5"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-field">
                  <input
                    type="password"
                    name="cvv"
                    required
                    maxLength="3"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="CVV"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !amount} className="btn-primary modal-submit-btn">
              {isSubmitting ? 'Processing Payment...' : `Donate $${amount} Now`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
