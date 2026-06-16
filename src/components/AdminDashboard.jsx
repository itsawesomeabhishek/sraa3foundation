import { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dynamic Content States
  const [content, setContent] = useState(null);
  const [submissions, setSubmissions] = useState({ messages: [], subscribers: [], donations: [] });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Editing Temp States
  const [heroForm, setHeroForm] = useState({ siteName: '', heroTitle: '', heroSubtitle: '', heroBadgePercent: '', heroBadgeText: '' });
  const [aboutForm, setAboutForm] = useState({ aboutLead: '', aboutDesc: '', aboutFeatures: [] });
  const [causesList, setCausesList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [statsList, setStatsList] = useState([]);
  
  // Modal Edit States
  const [editingItem, setEditingItem] = useState(null); // { type: 'cause'|'team'|'blog', data: obj, index: num }
  const [uploadLoading, setUploadLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Connection to backend failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    if (onClose) onClose();
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch public content first
      const contentRes = await fetch(`${API_URL}/api/content`);
      const contentData = await contentRes.json();
      setContent(contentData);

      // Populate forms
      setHeroForm({
        siteName: contentData.settings.siteName,
        heroTitle: contentData.settings.heroTitle,
        heroSubtitle: contentData.settings.heroSubtitle,
        heroBadgePercent: contentData.settings.heroBadgePercent,
        heroBadgeText: contentData.settings.heroBadgeText,
      });

      setAboutForm({
        aboutLead: contentData.settings.aboutLead,
        aboutDesc: contentData.settings.aboutDesc,
        aboutFeatures: contentData.settings.aboutFeatures || []
      });

      setCausesList(contentData.causes || []);
      setTeamList(contentData.team || []);
      setBlogList(contentData.blog || []);
      setStatsList(contentData.stats || []);

      // Fetch private submissions
      const submissionsRes = await fetch(`${API_URL}/api/admin/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (submissionsRes.ok) {
        const subData = await submissionsRes.json();
        setSubmissions(subData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.filePath) {
        callback(data.filePath);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploadLoading(false);
    }
  };

  // Save all contents back to DB
  const saveAllContent = async (updatedData = null) => {
    setSaveLoading(true);
    
    const payload = updatedData || {
      settings: {
        ...heroForm,
        aboutLead: aboutForm.aboutLead,
        aboutDesc: aboutForm.aboutDesc,
        aboutFeatures: aboutForm.aboutFeatures
      },
      causes: causesList,
      team: teamList,
      blog: blogList,
      stats: statsList,
      activities: content.activities,
      gallery: content.gallery
    };

    try {
      const res = await fetch(`${API_URL}/api/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('All updates saved successfully!');
        fetchAdminData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save changes');
      }
    } catch (err) {
      alert('Error connecting to save endpoint');
    } finally {
      setSaveLoading(false);
    }
  };

  // CRUD for list items
  const openEditModal = (type, item = null, index = null) => {
    let defaultForm = {};
    if (type === 'cause') {
      defaultForm = item || { tag: '', title: '', description: '', goal: 10000, raised: 0, percentage: 0, image: '', gradientClass: '' };
    } else if (type === 'team') {
      defaultForm = item || { name: '', role: '', description: '', image: '', classSuffix: '' };
    } else if (type === 'blog') {
      defaultForm = item || { category: '', date: new Date().toLocaleDateString(), title: '', description: '', image: '', classSuffix: '' };
    }
    setEditingItem({ type, data: { ...defaultForm }, index });
  };

  const saveEditedItem = () => {
    const { type, data, index } = editingItem;

    if (type === 'cause') {
      const list = [...causesList];
      data.percentage = Math.min(100, Math.round(((data.raised || 0) / (data.goal || 1)) * 100));
      if (index !== null) {
        list[index] = data;
      } else {
        data.id = Date.now();
        data.gradientClass = causesList.length % 3 === 0 ? '' : causesList.length % 3 === 1 ? 'g2' : 'g3';
        list.push(data);
      }
      setCausesList(list);
    } else if (type === 'team') {
      const list = [...teamList];
      if (index !== null) {
        list[index] = data;
      } else {
        data.id = Date.now();
        data.classSuffix = teamList.length % 4 === 0 ? '' : `c${(teamList.length % 4) + 1}`;
        list.push(data);
      }
      setTeamList(list);
    } else if (type === 'blog') {
      const list = [...blogList];
      if (index !== null) {
        list[index] = data;
      } else {
        data.id = Date.now();
        data.classSuffix = blogList.length % 3 === 0 ? 'b1' : blogList.length % 3 === 1 ? 'b2' : 'b3';
        list.push(data);
      }
      setBlogList(list);
    }

    setEditingItem(null);
  };

  const deleteItem = (type, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (type === 'cause') {
      const list = [...causesList];
      list.splice(index, 1);
      setCausesList(list);
    } else if (type === 'team') {
      const list = [...teamList];
      list.splice(index, 1);
      setTeamList(list);
    } else if (type === 'blog') {
      const list = [...blogList];
      list.splice(index, 1);
      setBlogList(list);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading SRAA3 Administration Platform...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-box">
          <div className="brand-logo">SRAA3</div>
          <h2>Admin Authentication</h2>
          <p>Please enter the security password to manage website modules.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Administrator Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <div className="login-actions">
              <button type="submit" className="btn-primary">Authenticate</button>
              <button type="button" className="btn-outline" onClick={onClose}>Back To Site</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Top Navigation */}
      <header className="admin-header">
        <div className="admin-logo">
          SRAA3 <span>Admin Core</span>
        </div>
        <div className="header-actions">
          <button className="btn-save-top" onClick={() => saveAllContent()} disabled={saveLoading}>
            {saveLoading ? 'Saving...' : 'Save All Changes'}
          </button>
          <button className="btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <ul>
            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <span>📊</span> Overview
            </li>
            <li className={activeTab === 'site-text' ? 'active' : ''} onClick={() => setActiveTab('site-text')}>
              <span>✏️</span> Site Text & About
            </li>
            <li className={activeTab === 'causes' ? 'active' : ''} onClick={() => setActiveTab('causes')}>
              <span>❤️</span> Causes
            </li>
            <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
              <span>📈</span> Stats Counters
            </li>
            <li className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>
              <span>👥</span> Core Team
            </li>
            <li className={activeTab === 'blog' ? 'active' : ''} onClick={() => setActiveTab('blog')}>
              <span>📰</span> Blog Posts
            </li>
            <li className={activeTab === 'submissions' ? 'active' : ''} onClick={() => setActiveTab('submissions')}>
              <span>📥</span> Submissions ({submissions.messages.length + submissions.donations.length + submissions.subscribers.length})
            </li>
          </ul>
          <div className="sidebar-footer">
            <button className="btn-outline-alt w-100" onClick={onClose}>Back to Website</button>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="admin-main-content">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <h2 className="tab-title">Platform Overview</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon green">💰</div>
                  <div className="metric-info">
                    <h3>Total Raised</h3>
                    <div className="metric-num">
                      ${submissions.donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </div>
                    <p>From {submissions.donations.length} total donations</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon blue">✉️</div>
                  <div className="metric-info">
                    <h3>Contact Messages</h3>
                    <div className="metric-num">{submissions.messages.length}</div>
                    <p>Inquiries submitted via form</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon purple">📧</div>
                  <div className="metric-info">
                    <h3>Subscribers</h3>
                    <div className="metric-num">{submissions.subscribers.length}</div>
                    <p>Newsletter email subscriptions</p>
                  </div>
                </div>
              </div>

              <div className="recent-submissions-box">
                <h3>Recent Donation Transactions</h3>
                {submissions.donations.length === 0 ? (
                  <p className="no-data">No donations recorded yet.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Email</th>
                        <th>Cause</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.donations.slice(0, 5).map((d) => (
                        <tr key={d.id}>
                          <td><strong>{d.donorName}</strong></td>
                          <td>{d.email}</td>
                          <td>{d.causeTitle}</td>
                          <td><span className="amount-tag">${d.amount}</span></td>
                          <td>{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* SITE TEXT & ABOUT TAB */}
          {activeTab === 'site-text' && (
            <div className="tab-pane">
              <h2 className="tab-title">Site Settings & Landing Content</h2>
              
              <div className="settings-section">
                <h3>Hero Section Configuration</h3>
                <div className="form-group-row">
                  <div className="form-group flex-1">
                    <label>Site Name</label>
                    <input
                      type="text"
                      value={heroForm.siteName}
                      onChange={(e) => setHeroForm({ ...heroForm, siteName: e.target.value })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Hero Badge Percentage</label>
                    <input
                      type="text"
                      value={heroForm.heroBadgePercent}
                      onChange={(e) => setHeroForm({ ...heroForm, heroBadgePercent: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={heroForm.heroTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Hero Description</label>
                  <textarea
                    rows="3"
                    value={heroForm.heroSubtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Hero Badge Subtext</label>
                  <input
                    type="text"
                    value={heroForm.heroBadgeText}
                    onChange={(e) => setHeroForm({ ...heroForm, heroBadgeText: e.target.value })}
                  />
                </div>
              </div>

              <div className="settings-section">
                <h3>About Section Configuration</h3>
                <div className="form-group">
                  <label>About Lead Summary Text</label>
                  <textarea
                    rows="3"
                    value={aboutForm.aboutLead}
                    onChange={(e) => setAboutForm({ ...aboutForm, aboutLead: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>About Description Paragraph</label>
                  <textarea
                    rows="4"
                    value={aboutForm.aboutDesc}
                    onChange={(e) => setAboutForm({ ...aboutForm, aboutDesc: e.target.value })}
                  ></textarea>
                </div>

                <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Core Pillars Features</h4>
                {aboutForm.aboutFeatures.map((feat, idx) => (
                  <div className="feature-edit-box" key={idx}>
                    <strong>Pillar #{idx + 1}</strong>
                    <div className="form-group-row">
                      <div className="form-group flex-1">
                        <label>Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const newFeats = [...aboutForm.aboutFeatures];
                            newFeats[idx].title = e.target.value;
                            setAboutForm({ ...aboutForm, aboutFeatures: newFeats });
                          }}
                        />
                      </div>
                      <div className="form-group flex-2">
                        <label>Description</label>
                        <input
                          type="text"
                          value={feat.description}
                          onChange={(e) => {
                            const newFeats = [...aboutForm.aboutFeatures];
                            newFeats[idx].description = e.target.value;
                            setAboutForm({ ...aboutForm, aboutFeatures: newFeats });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CAUSES TAB */}
          {activeTab === 'causes' && (
            <div className="tab-pane">
              <div className="tab-header-flex">
                <h2 className="tab-title">Manage Donation Causes</h2>
                <button className="btn-primary" onClick={() => openEditModal('cause')}>+ Add New Cause</button>
              </div>

              <div className="crud-list">
                {causesList.map((cause, idx) => (
                  <div className="crud-item-card" key={cause.id || idx}>
                    <div className="item-thumbnail">
                      {cause.image ? (
                        <img src={cause.image.startsWith('http') || cause.image.startsWith('/') ? cause.image : `${API_URL}${cause.image}`} alt={cause.title} />
                      ) : (
                        <div className={`mock-thumb ${cause.gradientClass}`}>❤️</div>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-tag">{cause.tag}</span>
                      <h4>{cause.title}</h4>
                      <p className="item-desc">{cause.description}</p>
                      <div className="progress-mini">
                        <span>Goal: ${cause.goal.toLocaleString()}</span>
                        <span>Raised: ${cause.raised.toLocaleString()} ({cause.percentage}%)</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit-small" onClick={() => openEditModal('cause', cause, idx)}>Edit</button>
                      <button className="btn-delete-small" onClick={() => deleteItem('cause', idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="tab-pane">
              <h2 className="tab-title">Impact Stats Configuration</h2>
              <p className="tab-desc">Edit the 4 main metrics shown across the homepage (Note: Donations processed will automatically update these, but you can also overwrite them manually).</p>
              
              <div className="stats-edit-grid">
                {statsList.map((stat, idx) => (
                  <div className="stat-edit-card" key={idx}>
                    <h4>Counter #{idx + 1}</h4>
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newList = [...statsList];
                          newList[idx].label = e.target.value;
                          setStatsList(newList);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Numeric Text</label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => {
                          const newList = [...statsList];
                          newList[idx].number = e.target.value;
                          setStatsList(newList);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="tab-pane">
              <div className="tab-header-flex">
                <h2 className="tab-title">Manage Foundation Team</h2>
                <button className="btn-primary" onClick={() => openEditModal('team')}>+ Add Team Member</button>
              </div>

              <div className="crud-list">
                {teamList.map((member, idx) => (
                  <div className="crud-item-card" key={member.id || idx}>
                    <div className="item-thumbnail rounded">
                      {member.image ? (
                        <img src={member.image.startsWith('http') || member.image.startsWith('/') ? member.image : `${API_URL}${member.image}`} alt={member.name} />
                      ) : (
                        <div className="mock-avatar">👤</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{member.name}</h4>
                      <span className="role-tag">{member.role}</span>
                      <p className="item-desc">{member.description}</p>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit-small" onClick={() => openEditModal('team', member, idx)}>Edit</button>
                      <button className="btn-delete-small" onClick={() => deleteItem('team', idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="tab-pane">
              <div className="tab-header-flex">
                <h2 className="tab-title">Manage Stories & Blogs</h2>
                <button className="btn-primary" onClick={() => openEditModal('blog')}>+ Add Blog Post</button>
              </div>

              <div className="crud-list">
                {blogList.map((post, idx) => (
                  <div className="crud-item-card" key={post.id || idx}>
                    <div className="item-thumbnail">
                      {post.image ? (
                        <img src={post.image.startsWith('http') || post.image.startsWith('/') ? post.image : `${API_URL}${post.image}`} alt={post.title} />
                      ) : (
                        <div className={`mock-thumb ${post.classSuffix}`}>📰</div>
                      )}
                    </div>
                    <div className="item-details">
                      <div className="meta-small">{post.category} • {post.date}</div>
                      <h4>{post.title}</h4>
                      <p className="item-desc">{post.description}</p>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit-small" onClick={() => openEditModal('blog', post, idx)}>Edit</button>
                      <button className="btn-delete-small" onClick={() => deleteItem('blog', idx)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === 'submissions' && (
            <div className="tab-pane">
              <h2 className="tab-title">Submissions logs</h2>
              
              <div className="submissions-box">
                <h4>Contact Enquiries ({submissions.messages.length})</h4>
                {submissions.messages.length === 0 ? (
                  <p className="no-data">No contact messages received.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sender</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.messages.map((m) => (
                        <tr key={m.id}>
                          <td><strong>{m.name}</strong></td>
                          <td><a href={`mailto:${m.email}`}>{m.email}</a></td>
                          <td>{m.subject}</td>
                          <td><p className="tbl-message-text">{m.message}</p></td>
                          <td>{m.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="submissions-box" style={{ marginTop: '40px' }}>
                <h4>Donations Ledger ({submissions.donations.length})</h4>
                {submissions.donations.length === 0 ? (
                  <p className="no-data">No donations received yet.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Email</th>
                        <th>Cause</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.donations.map((d) => (
                        <tr key={d.id}>
                          <td><strong>{d.donorName}</strong></td>
                          <td><a href={`mailto:${d.email}`}>{d.email}</a></td>
                          <td>{d.causeTitle}</td>
                          <td>{d.paymentMethod}</td>
                          <td><span className="amount-tag">${d.amount}</span></td>
                          <td>{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="submissions-box" style={{ marginTop: '40px' }}>
                <h4>Newsletter Subscribers ({submissions.subscribers.length})</h4>
                {submissions.subscribers.length === 0 ? (
                  <p className="no-data">No email subscriptions registered.</p>
                ) : (
                  <table className="admin-table mini">
                    <thead>
                      <tr>
                        <th>Email Address</th>
                        <th>Date Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.subscribers.map((s) => (
                        <tr key={s.id}>
                          <td><strong>{s.email}</strong></td>
                          <td>{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CRUD MODAL EDIT DIALOG */}
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editingItem.index !== null ? 'Modify' : 'Create New'} {editingItem.type.toUpperCase()}</h3>
            
            <div className="modal-form">
              {editingItem.type === 'cause' && (
                <>
                  <div className="form-group-row">
                    <div className="form-group flex-1">
                      <label>Tag / Category</label>
                      <input
                        type="text"
                        value={editingItem.data.tag}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, tag: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Target Goal ($)</label>
                      <input
                        type="number"
                        value={editingItem.data.goal}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, goal: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cause Title</label>
                    <input
                      type="text"
                      value={editingItem.data.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, title: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea
                      rows="3"
                      value={editingItem.data.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, description: e.target.value }
                      })}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Amount Already Raised ($)</label>
                    <input
                      type="number"
                      value={editingItem.data.raised}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, raised: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </>
              )}

              {editingItem.type === 'team' && (
                <>
                  <div className="form-group">
                    <label>Member Full Name</label>
                    <input
                      type="text"
                      value={editingItem.data.name}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, name: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role / Title</label>
                    <input
                      type="text"
                      value={editingItem.data.role}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, role: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Biography</label>
                    <textarea
                      rows="3"
                      value={editingItem.data.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, description: e.target.value }
                      })}
                    ></textarea>
                  </div>
                </>
              )}

              {editingItem.type === 'blog' && (
                <>
                  <div className="form-group-row">
                    <div className="form-group flex-1">
                      <label>Category</label>
                      <input
                        type="text"
                        value={editingItem.data.category}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, category: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Publish Date</label>
                      <input
                        type="text"
                        value={editingItem.data.date}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, date: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Article Title</label>
                    <input
                      type="text"
                      value={editingItem.data.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, title: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Summary Description</label>
                    <textarea
                      rows="3"
                      value={editingItem.data.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, description: e.target.value }
                      })}
                    ></textarea>
                  </div>
                </>
              )}

              {/* SHARED IMAGE FILE UPLOAD CONFIG */}
              <div className="form-group image-upload-box">
                <label>Upload Section Thumbnail/Image</label>
                <div className="upload-flex-container">
                  {editingItem.data.image && (
                    <div className="uploaded-mini-preview">
                      <img src={editingItem.data.image.startsWith('http') || editingItem.data.image.startsWith('/') ? editingItem.data.image : `${API_URL}${editingItem.data.image}`} alt="Preview" />
                    </div>
                  )}
                  <div className="upload-inputs">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (filePath) => {
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, image: filePath }
                        });
                      })}
                    />
                    {uploadLoading && <span className="upload-indicator">Uploading File...</span>}
                    <p className="upload-tip">Supports WebP, PNG, JPEG, or SVG.</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={saveEditedItem}>Apply Settings</button>
              <button className="btn-outline" onClick={() => setEditingItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
