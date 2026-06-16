import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Activities from './components/Activities';
import Causes from './components/Causes';
import Stats from './components/Stats';
import Volunteer from './components/Volunteer';
import Team from './components/Team';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import DonateModal from './components/DonateModal';
import BackToTop from './components/BackToTop';
import AdminDashboard from './components/AdminDashboard';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/content`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching dynamic content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const openDonate = () => setIsDonateOpen(true);
  const closeDonate = () => setIsDonateOpen(false);

  // Callback to refresh site data when admin changes it
  const refreshSiteData = () => {
    fetchContent();
  };

  if (isAdminView) {
    return <AdminDashboard onClose={() => { window.location.hash = ''; setIsAdminView(false); refreshSiteData(); }} />;
  }

  return (
    <div className="app-container">
      {/* Navigation & Header */}
      <Header onDonateClick={openDonate} />

      {/* Main Landing Content */}
      <main>
        <Hero onDonateClick={openDonate} settings={content?.settings} stats={content?.stats} />
        <About settings={content?.settings} />
        <Activities activities={content?.activities} />
        <Causes onDonateClick={openDonate} causes={content?.causes} />
        <Stats stats={content?.stats} />
        <Volunteer onDonateClick={openDonate} />
        <Team team={content?.team} />
        <Gallery gallery={content?.gallery} />
        <Blog blog={content?.blog} />
        <Contact />
        <Newsletter />
      </main>

      {/* Footer & Global Overlays */}
      <Footer />
      <DonateModal 
        isOpen={isDonateOpen} 
        onClose={closeDonate} 
        causes={content?.causes} 
        onDonationSuccess={refreshSiteData} 
      />
      <BackToTop />
      <Chatbot onDonateClick={openDonate} />
    </div>
  );
}

export default App;
