import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './z.css';

const Z = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [linkSent, setLinkSent] = useState(false);
  const [linkReceived, setLinkReceived] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const sectionRef = useRef(null);

  const messages = [
    { id: 1, text: "Hey! Got your link 🔗", sender: 'right', delay: 0 },
    { id: 2, text: "Yeah! Let's chat here 🚀", sender: 'left', delay: 800 },
    { id: 3, text: "This app is amazing!", sender: 'right', delay: 1600 },
    { id: 4, text: "Built with Python 🐍", sender: 'left', delay: 2400 },
    { id: 5, text: "So fast & secure! 🔒", sender: 'right', delay: 3200 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const t1 = setTimeout(() => setCurrentStep(1), 500);
    const t2 = setTimeout(() => setLinkSent(true), 1500);
    const t3 = setTimeout(() => setLinkReceived(true), 2500);
    const t4 = setTimeout(() => setChatStarted(true), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isVisible]);

  useEffect(() => {
    if (!chatStarted) return;
    const timers = messages.map((msg) =>
      setTimeout(() => setChatMessages((prev) => [...prev, msg]), msg.delay + 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [chatStarted]);

  const replay = () => {
    setCurrentStep(0);
    setLinkSent(false);
    setLinkReceived(false);
    setChatStarted(false);
    setChatMessages([]);
    setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => setLinkSent(true), 1000);
      setTimeout(() => setLinkReceived(true), 2000);
      setTimeout(() => setChatStarted(true), 3000);
    }, 300);
  };

  const techTags = ['Python', 'Socket.IO', 'Flask', 'SQLite', 'REST API'];

  return (
    <section className="z-section" ref={sectionRef}>
      <div className="z-bg-grid"></div>
      <div className="z-bg-glow z-glow1"></div>
      <div className="z-bg-glow z-glow2"></div>
      <div className="z-bg-glow z-glow3"></div>

      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="z-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}

      <div className="z-container">
        {/* HEADER */}
        <div className={`z-header ${isVisible ? 'z-in' : ''}`}>
          <div className="z-logo-wrap">
            <div className="z-logo-icon">
              <svg viewBox="0 0 60 60" className="z-logo-svg">
                <defs>
                  <linearGradient id="zLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5d4" />
                    <stop offset="50%" stopColor="#7b61ff" />
                    <stop offset="100%" stopColor="#ff6b6b" />
                  </linearGradient>
                </defs>
                <path d="M20 35 L20 25 Q20 15 30 15 Q40 15 40 25 L40 28" stroke="url(#zLinkGrad)" strokeWidth="4" fill="none" strokeLinecap="round" className="z-path1" />
                <path d="M40 25 L40 35 Q40 45 30 45 Q20 45 20 35 L20 32" stroke="url(#zLinkGrad)" strokeWidth="4" fill="none" strokeLinecap="round" className="z-path2" />
              </svg>
            </div>
            <h1 className="z-title">
              <span className="z-title-link">Link</span>
              <span className="z-title-bit">Bit</span>
            </h1>
          </div>
          <div className="z-underline"></div>
        </div>

        {/* INFO CARDS */}
        <div className={`z-info-grid ${isVisible ? 'z-in' : ''}`}>
          {[
            { cls: 'z-card-year', icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, label: 'Year', value: '2025', delay: '0.2s' },
            { cls: 'z-card-type', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, label: 'Type', value: 'Networking & Chatting', delay: '0.4s' },
            { cls: 'z-card-lang', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></>, label: 'Language', value: 'Python', delay: '0.6s' },
          ].map((card) => (
            <div key={card.cls} className={`z-info-card ${card.cls}`} style={{ animationDelay: card.delay }}>
              <div className="z-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{card.icon}</svg>
              </div>
              <span className="z-card-label">{card.label}</span>
              <span className="z-card-value">{card.value}</span>
              <div className="z-card-shine"></div>
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className={`z-description ${isVisible ? 'z-in' : ''}`}>
          <p className="z-desc-text">
            <span className="z-hl">LinkBit</span> is a real-time networking and chatting application
            that lets users share unique links via SMS. Recipients simply click the link to instantly
            connect and start chatting — no downloads, no sign-ups, just seamless communication.
            Built with <span className="z-hl">Python</span> for lightning-fast performance
            and end-to-end security.
          </p>
          <div className="z-tech-tags">
            {techTags.map((tag, i) => (
              <span key={tag} className="z-tag" style={{ animationDelay: `${1 + i * 0.15}s` }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* ANIMATION AREA */}
        <div className={`z-anim-area ${isVisible ? 'z-in' : ''}`}>
          <h3 className="z-anim-title">
            <span className="z-anim-icon">⚡</span>
            How It Works
            <span className="z-anim-icon">⚡</span>
          </h3>

          {/* STEPS */}
          <div className="z-steps">
            <div className={`z-step ${currentStep >= 1 ? 'z-step-on' : ''}`}>
              <div className="z-step-dot">1</div>
              <span>Share Link</span>
            </div>
            <div className={`z-step-line ${linkSent ? 'z-line-on' : ''}`}></div>
            <div className={`z-step ${linkReceived ? 'z-step-on' : ''}`}>
              <div className="z-step-dot">2</div>
              <span>Click Link</span>
            </div>
            <div className={`z-step-line ${chatStarted ? 'z-line-on' : ''}`}></div>
            <div className={`z-step ${chatStarted ? 'z-step-on' : ''}`}>
              <div className="z-step-dot">3</div>
              <span>Start Chat</span>
            </div>
          </div>

          {/* PHONES */}
          <div className="z-phones">
            <svg className="z-conn-svg" viewBox="0 0 600 100">
              <defs>
                <linearGradient id="zLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7b61ff" />
                  <stop offset="50%" stopColor="#00f5d4" />
                  <stop offset="100%" stopColor="#7b61ff" />
                </linearGradient>
              </defs>
              {chatStarted && (
                <>
                  <path d="M 100 50 Q 300 -20 500 50" stroke="url(#zLineGrad)" strokeWidth="2" fill="none" className="z-conn-line" strokeDasharray="5,5" />
                  <circle r="4" fill="#00f5d4"><animateMotion dur="2s" repeatCount="indefinite" path="M 100 50 Q 300 -20 500 50" /></circle>
                  <circle r="4" fill="#7b61ff"><animateMotion dur="2s" repeatCount="indefinite" path="M 500 50 Q 300 -20 100 50" /></circle>
                </>
              )}
            </svg>

            {/* LEFT PHONE */}
            <div className={`z-phone z-phone-l ${isVisible ? 'z-phone-vis' : ''}`}>
              <div className="z-phone-frame">
                <div className="z-notch">
                  <div className="z-cam"></div>
                  <div className="z-speaker"></div>
                  <div className="z-cam"></div>
                </div>
                <div className="z-screen">
                  <div className="z-statusbar">
                    <span>9:41</span>
                    <div className="z-status-icons">
                      <div className="z-signal"><div></div><div></div><div></div><div></div></div>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="1" y="6" width="22" height="12" rx="2" /><rect x="3" y="8" width="14" height="8" rx="1" fill="#00f5d4" /></svg>
                    </div>
                  </div>

                  {!chatStarted ? (
                    <div className="z-sms">
                      <div className="z-sms-head">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        <div className="z-sms-contact">
                          <div className="z-avatar"><span>J</span></div>
                          <div><span className="z-name">John</span><span className="z-status">Online</span></div>
                        </div>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                      </div>
                      <div className="z-sms-body">
                        <div className="z-bubble z-sent z-pop"><span>Hey! Try this app</span><span className="z-time">9:40 AM</span></div>
                        {linkSent && (
                          <div className="z-bubble z-sent z-link-bubble z-pop">
                            <div className="z-link-preview">
                              <div className="z-lp-icon">🔗</div>
                              <div className="z-lp-info">
                                <span className="z-lp-title">LinkBit Chat</span>
                                <span className="z-lp-url">linkbit.app/chat/x7k9m</span>
                              </div>
                            </div>
                            <span className="z-time">9:41 AM</span>
                            <div className="z-link-pulse"></div>
                          </div>
                        )}
                      </div>
                      <div className="z-input-bar">
                        <div className="z-input"><span>Type a message...</span></div>
                        <button className="z-send-btn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></button>
                      </div>
                    </div>
                  ) : (
                    <div className="z-chat">
                      <div className="z-chat-head">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        <div className="z-chat-contact">
                          <div className="z-avatar z-avatar-on"><span>J</span><div className="z-online"></div></div>
                          <div><span className="z-name">John</span><span className="z-status z-typing">Connected via LinkBit</span></div>
                        </div>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M23 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72" /></svg>
                      </div>
                      <div className="z-chat-body">
                        <div className="z-chat-date"><span>Today</span></div>
                        {chatMessages.filter(m => m.sender === 'left').map(msg => (
                          <div key={msg.id} className="z-msg z-msg-sent z-msg-anim"><span>{msg.text}</span><span className="z-msg-time">9:42</span></div>
                        ))}
                        {chatMessages.filter(m => m.sender === 'right').map(msg => (
                          <div key={msg.id} className="z-msg z-msg-recv z-msg-anim"><span>{msg.text}</span><span className="z-msg-time">9:42</span></div>
                        ))}
                      </div>
                      <div className="z-input-bar">
                        <button className="z-attach"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg></button>
                        <div className="z-input z-input-on"><span className="z-typing-dots"><i></i><i></i><i></i></span></div>
                        <button className="z-send-btn z-send-on"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="z-home-bar"></div>
              </div>
              <div className="z-phone-shadow"></div>
              <div className="z-phone-label">Sender</div>
            </div>

            {/* CENTER */}
            <div className="z-center">
              {linkSent && !chatStarted && (
                <div className="z-flying-link">
                  <div className="z-fl-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00f5d4" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <div className="z-fl-trail"></div>
                </div>
              )}
              {chatStarted && (
                <div className="z-connected">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00f5d4" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>Connected!</span>
                </div>
              )}
            </div>

            {/* RIGHT PHONE */}
            <div className={`z-phone z-phone-r ${isVisible ? 'z-phone-vis' : ''}`}>
              <div className="z-phone-frame">
                <div className="z-notch">
                  <div className="z-cam"></div>
                  <div className="z-speaker"></div>
                  <div className="z-cam"></div>
                </div>
                <div className="z-screen">
                  <div className="z-statusbar">
                    <span>9:41</span>
                    <div className="z-status-icons">
                      <div className="z-signal"><div></div><div></div><div></div><div></div></div>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="1" y="6" width="22" height="12" rx="2" /><rect x="3" y="8" width="14" height="8" rx="1" fill="#7b61ff" /></svg>
                    </div>
                  </div>

                  {!linkReceived ? (
                    <div className="z-lock">
                      <div className="z-lock-time">9:41</div>
                      <div className="z-lock-date">Monday, January 15</div>
                      {linkSent && (
                        <div className="z-notif z-notif-anim">
                          <div className="z-notif-icon"><span>💬</span></div>
                          <div className="z-notif-content">
                            <span className="z-notif-app">Messages</span>
                            <span className="z-notif-title">Alex sent a link</span>
                            <span className="z-notif-body">linkbit.app/chat/x7k9m</span>
                          </div>
                          <span className="z-notif-time">now</span>
                        </div>
                      )}
                    </div>
                  ) : !chatStarted ? (
                    <div className="z-browser">
                      <div className="z-browser-bar">
                        <div className="z-browser-url">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#00f5d4" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                          <span>linkbit.app/chat/x7k9m</span>
                        </div>
                      </div>
                      <div className="z-browser-body">
                        <div className="z-join-card">
                          <div className="z-join-logo">
                            <svg viewBox="0 0 40 40">
                              <path d="M13 23 L13 17 Q13 10 20 10 Q27 10 27 17 L27 19" stroke="#7b61ff" strokeWidth="3" fill="none" strokeLinecap="round" />
                              <path d="M27 17 L27 23 Q27 30 20 30 Q13 30 13 23 L13 21" stroke="#00f5d4" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                          </div>
                          <h4>LinkBit Chat</h4>
                          <p>Alex invited you to chat</p>
                          <button className="z-join-btn"><span>Join Chat</span><div className="z-btn-shimmer"></div></button>
                          <div className="z-join-loading"><div className="z-loader"></div><span>Connecting...</span></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="z-chat">
                      <div className="z-chat-head">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                        <div className="z-chat-contact">
                          <div className="z-avatar z-avatar-on z-avatar-alt"><span>A</span><div className="z-online"></div></div>
                          <div><span className="z-name">Alex</span><span className="z-status z-typing">Connected via LinkBit</span></div>
                        </div>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M23 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72" /></svg>
                      </div>
                      <div className="z-chat-body">
                        <div className="z-chat-date"><span>Today</span></div>
                        {chatMessages.filter(m => m.sender === 'left').map(msg => (
                          <div key={msg.id} className="z-msg z-msg-recv z-msg-anim"><span>{msg.text}</span><span className="z-msg-time">9:42</span></div>
                        ))}
                        {chatMessages.filter(m => m.sender === 'right').map(msg => (
                          <div key={msg.id} className="z-msg z-msg-sent z-msg-anim"><span>{msg.text}</span><span className="z-msg-time">9:42</span></div>
                        ))}
                      </div>
                      <div className="z-input-bar">
                        <button className="z-attach"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg></button>
                        <div className="z-input z-input-on"><span className="z-typing-dots"><i></i><i></i><i></i></span></div>
                        <button className="z-send-btn z-send-on"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg></button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="z-home-bar"></div>
              </div>
              <div className="z-phone-shadow"></div>
              <div className="z-phone-label">Receiver</div>
            </div>
          </div>

          <button className="z-replay" onClick={replay}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
            <span>Replay Animation</span>
          </button>
        </div>

        {/* NEXT SECTION - ABOUT */}
        <div className={`z-next ${isVisible ? 'z-in' : ''}`}>
          <span className="z-next-label">
            <span className="z-next-line" />
            NEXT UP
          </span>

          <Link to="/about" className="z-next-link">
            <span className="z-next-meta">
              <span className="z-next-year">.</span>
              <span className="z-next-slash">/</span>
            </span>
            <span className="z-next-name">ABOUT</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Z;