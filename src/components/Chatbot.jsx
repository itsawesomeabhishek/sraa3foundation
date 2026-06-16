import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

export default function Chatbot({ onDonateClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to SRAA3 Foundation. I am your digital assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: 'About SRAA3', query: 'Tell me about SRAA3' },
    { label: 'How to Donate', query: 'How can I Donate?' },
    { label: 'Active Causes', query: 'What are your active causes?' },
    { label: 'Volunteer Info', query: 'How do I volunteer?' },
    { label: 'Contact Us', query: 'Contact details' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Get response
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        action: response.action,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputText);
    }
  };

  const getBotResponse = (input) => {
    const query = input.toLowerCase();

    if (query.includes('donate') || query.includes('contribution') || query.includes('money') || query.includes('payment') || query.includes('fund')) {
      return {
        text: "Thank you for your generosity! Your contributions make a real difference in the lives of many. You can donate to Education, Healthcare, or Nutrition causes directly from our secure donation portal. Would you like to open it now?",
        action: "donate"
      };
    }
    if (query.includes('cause') || query.includes('project') || query.includes('program') || query.includes('campaign')) {
      return {
        text: "We run three main programs:\n\n📚 **Education**: Creating learning paths and classrooms for children.\n🏥 **Healthcare**: Sponsoring medical camps and blood donation drives.\n🍎 **Nutrition**: Providing nutritious meals to rural families.\n\nAll funds raised go directly to these programs."
      };
    }
    if (query.includes('volunteer') || query.includes('join') || query.includes('member') || query.includes('work')) {
      return {
        text: "We are always looking for passionate volunteers! You can fill out the contact form on our website or email us at volunteer@sraa3foundation.org. We have opportunities for teaching, field operations, and event management."
      };
    }
    if (query.includes('education') || query.includes('school') || query.includes('child') || query.includes('learn') || query.includes('study')) {
      return {
        text: "Our Education wing works to get underprivileged children back to school. We provide scholarships, school kits, and tutoring support. You can view the 'Better Education For All' card in our Causes section for more details!"
      };
    }
    if (query.includes('food') || query.includes('meal') || query.includes('nutrition') || query.includes('hungry') || query.includes('feast')) {
      return {
        text: "Our Food Feast Chariot program delivers fresh, warm meals directly to vulnerable families. We believe that proper nutrition is key to learning and development."
      };
    }
    if (query.includes('health') || query.includes('blood') || query.includes('medical') || query.includes('camp') || query.includes('doctor')) {
      return {
        text: "SRAA3 hosts blood donation camps and free community health checkups. Our medical volunteers connect remote areas to essential diagnostics and treatment."
      };
    }
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('address') || query.includes('location')) {
      return {
        text: "Here is how you can reach us:\n\n📧 info@sraa3foundation.org\n📞 +1 (555) 019-2834\n📍 123 Care Street, Hope Valley"
      };
    }
    if (query.includes('about') || query.includes('who') || query.includes('sraa3') || query.includes('foundation') || query.includes('history')) {
      return {
        text: "SRAA3 Foundation is a dedicated social-accountability NGO. We believe every human being has an innate duty to help others. Our focus is on sustainable, high-impact programs in health, learning, and nutrition."
      };
    }
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings')) {
      return {
        text: "Hello! How can I help you today? Feel free to ask about our donations, active causes, or volunteer opportunities."
      };
    }
    if (query.includes('thank') || query.includes('thanks') || query.includes('awesome') || query.includes('great')) {
      return {
        text: "You are welcome! It is our pleasure to guide you. Together, we can write a brighter future!"
      };
    }
    return {
      text: "I'm sorry, I didn't quite get that. Could you please specify if you're interested in donating, our causes, volunteering, or contact details? Or click one of the quick options below."
    };
  };

  const handleActionClick = (action) => {
    if (action === 'donate') {
      onDonateClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
      {/* Floating Toggle Button */}
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div className="chatbot-window">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-logo">
            <div className="status-dot"></div>
            <span>SRAA3 Assistant</span>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Messages Screen */}
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div className={`message-row ${msg.sender}`} key={msg.id}>
                {msg.sender === 'bot' && (
                  <div className="bot-avatar">S</div>
                )}
                <div className="message-bubble-container">
                  <div className="message-bubble">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                    {msg.action && (
                      <button 
                        className="message-action-btn"
                        onClick={() => handleActionClick(msg.action)}
                      >
                        Open Donation Form
                      </button>
                    )}
                  </div>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="bot-avatar">S</div>
                <div className="message-bubble-container">
                  <div className="message-bubble typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="chatbot-chips">
          {quickPrompts.map((chip, idx) => (
            <button 
              key={idx} 
              className="chip-btn"
              onClick={() => handleSend(chip.query)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chatbot-footer">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            className="chatbot-send-btn" 
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
