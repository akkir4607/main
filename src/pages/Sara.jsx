import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Sara.css';

const Sara = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [waveBars, setWaveBars] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [typedResponse, setTypedResponse] = useState('');
  const sectionRef = useRef(null);
  const demoTimeoutRef = useRef([]);
  const canvasRef = useRef(null);

  const commands = [
    {
      user: "Hey Sara, what's the weather today?",
      response: "It's currently 24°C and sunny in your location. Perfect day for outdoor activities!",
      icon: '🌤️'
    },
    {
      user: "Play some relaxing music",
      response: "Playing your relaxing playlist on Spotify. Enjoy!",
      icon: '🎵'
    },
    {
      user: "Set a reminder for 3 PM",
      response: "Reminder set for 3:00 PM today. I'll notify you.",
      icon: '⏰'
    },
    {
      user: "Send an email to John",
      response: "Opening email composer for John. What would you like to say?",
      icon: '📧'
    }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Init particles
  useEffect(() => {
    const initial = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(initial);
  }, []);

  // Init wave bars
  useEffect(() => {
    setWaveBars(Array.from({ length: 40 }, () => Math.random() * 30 + 10));
  }, []);

  // Animate wave bars when listening/speaking
  useEffect(() => {
    if (!isListening && !isSpeaking) {
      const interval = setInterval(() => {
        setWaveBars(prev => prev.map(() => Math.random() * 8 + 4));
      }, 200);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      setWaveBars(prev => prev.map(() => {
        if (isListening) return Math.random() * 60 + 20;
        if (isSpeaking) return Math.random() * 45 + 15;
        return Math.random() * 8 + 4;
      }));
    }, 80);
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  // Particle motion
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y - p.speed + 100) % 100,
        x: p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.1
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Canvas voice orb visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.25;

      const intensity = isListening ? 1.2 : isSpeaking ? 0.9 : isProcessing ? 0.6 : 0.35;

      // Multiple wave rings
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        const points = 80;
        const ringOffset = ring * 0.5;

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const wave1 = Math.sin(angle * 3 + time * 2 + ringOffset) * 8 * intensity;
          const wave2 = Math.sin(angle * 5 + time * 3 + ringOffset) * 5 * intensity;
          const wave3 = Math.cos(angle * 7 + time * 1.5 + ringOffset) * 4 * intensity;
          const r = baseRadius + wave1 + wave2 + wave3 + ring * 15;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius * 2);
        const color1 = isListening ? '148, 63, 255' : isSpeaking ? '236, 72, 153' : '99, 102, 241';
        gradient.addColorStop(0, `rgba(${color1}, ${0.15 - ring * 0.03})`);
        gradient.addColorStop(1, `rgba(${color1}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = `rgba(${color1}, ${0.3 - ring * 0.06})`;
        ctx.lineWidth = 1.5 - ring * 0.3;
        ctx.stroke();
      }

      time += 0.02;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [isListening, isSpeaking, isProcessing]);

  // Typewriter effect
  const typeResponse = useCallback((text, callback) => {
    setTypedResponse('');
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setTypedResponse(text.substring(0, i + 1));
        i++;
        const timeout = setTimeout(type, 25);
        demoTimeoutRef.current.push(timeout);
      } else {
        if (callback) callback();
      }
    };
    type();
  }, []);

  const clearTimeouts = () => {
    demoTimeoutRef.current.forEach(t => clearTimeout(t));
    demoTimeoutRef.current = [];
  };

  // Voice interaction demo
  const startVoiceDemo = useCallback(() => {
    if (isListening || isProcessing || isSpeaking) return;

    clearTimeouts();
    const command = commands[currentCommandIndex];

    // Reset
    setTranscript('');
    setResponse('');
    setTypedResponse('');
    setIsListening(true);

    // Simulate typing user command
    let idx = 0;
    const typeUser = () => {
      if (idx < command.user.length) {
        setTranscript(command.user.substring(0, idx + 1));
        idx++;
        const t = setTimeout(typeUser, 40);
        demoTimeoutRef.current.push(t);
      } else {
        // Stop listening, start processing
        const t1 = setTimeout(() => {
          setIsListening(false);
          setIsProcessing(true);

          const t2 = setTimeout(() => {
            setIsProcessing(false);
            setIsSpeaking(true);
            setResponse(command.response);

            typeResponse(command.response, () => {
              const t3 = setTimeout(() => {
                setIsSpeaking(false);
                setConversation(prev => [...prev, command]);
                setCurrentCommandIndex(prev => (prev + 1) % commands.length);
              }, 1500);
              demoTimeoutRef.current.push(t3);
            });
          }, 1200);
          demoTimeoutRef.current.push(t2);
        }, 600);
        demoTimeoutRef.current.push(t1);
      }
    };
    typeUser();
  }, [isListening, isProcessing, isSpeaking, currentCommandIndex, typeResponse]);

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    return 'Tap to speak';
  };

  const getStatusColor = () => {
    if (isListening) return '#943fff';
    if (isProcessing) return '#f59e0b';
    if (isSpeaking) return '#ec4899';
    return '#6366f1';
  };

  return (
    <div className="sara" ref={sectionRef}>
      {/* Background */}
      <div className="sara__particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="sara__particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      <div className="sara__grid" />
      <div className="sara__orb sara__orb--1" />
      <div className="sara__orb sara__orb--2" />
      <div className="sara__orb sara__orb--3" />

      <div className="sara__container">
        {/* Header */}
        <header className={`sara__header ${isVisible ? 'is-visible' : ''}`}>
          <div className="sara__badge">
            <span className="sara__badge-dot" />
            <span>AI Voice Assistant & Speech Recognition</span>
          </div>

          <h1 className="sara__title">
            <span className="title__sara">SARA</span>
            <span className="title__cursor">|</span>
          </h1>

          <p className="sara__description">
            An advanced AI-powered personal voice assistant that intelligently understands and processes
            natural language commands. Powered by <span className="highlight">speech recognition, NLP, and machine learning</span> —
            Sara delivers context-aware communication and smart task execution.
          </p>
        </header>

        {/* Credits */}
        <div className={`sara__credits ${isVisible ? 'is-visible' : ''}`}>
          <div className="credit-card">
            <span className="credit-card__label">ROLE / SERVICES</span>
            <span className="credit-card__value">AI Voice Assistant & Speech Recognition</span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">TECHNOLOGIES</span>
            <span className="credit-card__value">
              <span className="tech-chip">Python</span>
              <span className="tech-chip">Flask</span>
              <span className="tech-chip">Speech Recognition</span>
              <span className="tech-chip">NLP</span>
              <span className="tech-chip">Text-to-Speech</span>
              <span className="tech-chip">Git</span>
            </span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">YEAR</span>
            <span className="credit-card__value">2023</span>
          </div>
        </div>

        {/* Main Demo */}
        <div className={`sara__demo ${isVisible ? 'is-visible' : ''}`}>
          {/* Left: Voice Interface */}
          <div className="voice-interface">
            <div className="voice-interface__header">
              <div className="voice-interface__title">
                <div className="voice-status">
                  <span className="voice-status__dot" style={{ background: getStatusColor() }} />
                  <span className="voice-status__text" style={{ color: getStatusColor() }}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Orb */}
            <div className="voice-orb-wrapper">
              <canvas ref={canvasRef} className="voice-orb__canvas" />

              <button
                className={`voice-orb ${isListening ? 'is-listening' : ''} ${isProcessing ? 'is-processing' : ''} ${isSpeaking ? 'is-speaking' : ''}`}
                onClick={startVoiceDemo}
                disabled={isListening || isProcessing || isSpeaking}
              >
                <div className="voice-orb__glow" />
                <div className="voice-orb__ring voice-orb__ring--1" />
                <div className="voice-orb__ring voice-orb__ring--2" />
                <div className="voice-orb__ring voice-orb__ring--3" />

                <div className="voice-orb__core">
                  {isProcessing ? (
                    <div className="voice-orb__loading">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Wave Visualization */}
            <div className={`wave-viz ${isListening || isSpeaking ? 'is-active' : ''}`}>
              {waveBars.map((height, i) => (
                <div
                  key={i}
                  className="wave-viz__bar"
                  style={{
                    height: `${height}px`,
                    background: isListening
                      ? 'linear-gradient(180deg, #943fff, #6366f1)'
                      : isSpeaking
                      ? 'linear-gradient(180deg, #ec4899, #943fff)'
                      : 'rgba(99, 102, 241, 0.2)',
                    animationDelay: `${i * 0.02}s`
                  }}
                />
              ))}
            </div>

            {/* Instructions */}
            <p className="voice-instructions">
              {isListening || isProcessing || isSpeaking
                ? 'Please wait...'
                : 'Click the microphone to try a sample voice command'}
            </p>
          </div>

          {/* Right: Chat Interface */}
          <div className="chat-panel">
            <div className="chat-panel__header">
              <div className="chat-panel__avatar">
                <div className="chat-panel__avatar-inner">S</div>
                <span className="chat-panel__status" />
              </div>
              <div className="chat-panel__info">
                <h3>Sara AI</h3>
                <span className="chat-panel__subtitle">Voice Assistant · Online</span>
              </div>
              <div className="chat-panel__actions">
                <div className="chat-action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="chat-panel__messages">
              {conversation.length === 0 && !transcript && (
                <div className="chat-empty">
                  <div className="chat-empty__icon">✨</div>
                  <p className="chat-empty__title">Hi, I'm Sara</p>
                  <p className="chat-empty__desc">
                    Your AI voice assistant. Try a command to get started.
                  </p>
                  <div className="chat-empty__hints">
                    {['Weather', 'Music', 'Reminders', 'Email'].map((hint, i) => (
                      <span key={i} className="chat-hint">{hint}</span>
                    ))}
                  </div>
                </div>
              )}

              {conversation.map((msg, i) => (
                <React.Fragment key={i}>
                  <div className="chat-message chat-message--user">
                    <div className="chat-message__bubble">
                      <p>{msg.user}</p>
                    </div>
                  </div>
                  <div className="chat-message chat-message--sara">
                    <div className="chat-message__avatar">S</div>
                    <div className="chat-message__bubble">
                      <span className="chat-message__icon">{msg.icon}</span>
                      <p>{msg.response}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Live transcript */}
              {transcript && (
                <div className="chat-message chat-message--user is-live">
                  <div className="chat-message__bubble">
                    <p>{transcript}<span className="typing-cursor">|</span></p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="chat-message chat-message--sara">
                  <div className="chat-message__avatar">S</div>
                  <div className="chat-message__bubble chat-message__bubble--typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              {typedResponse && !isProcessing && (
                <div className="chat-message chat-message--sara is-live">
                  <div className="chat-message__avatar">S</div>
                  <div className="chat-message__bubble">
                    <span className="chat-message__icon">{commands[currentCommandIndex].icon}</span>
                    <p>{typedResponse}<span className="typing-cursor">|</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat input (visual only) */}
            <div className="chat-panel__input">
              <div className="chat-input">
                <span className="chat-input__placeholder">Ask Sara anything...</span>
                <div className="chat-input__mic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className={`sara__features ${isVisible ? 'is-visible' : ''}`}>
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              ),
              title: 'Natural Speech',
              desc: 'Advanced speech recognition converts your voice into commands with 95%+ accuracy.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.663 17h4.673M12 3v1M6.343 5.343l.707.707M2 12h1M20 12h1M18.657 6.343l-.707.707" />
                  <path d="M8 21h8M12 17v4M12 3a6 6 0 0 1 6 6c0 3-3 5-3 8H9c0-3-3-5-3-8a6 6 0 0 1 6-6z" />
                </svg>
              ),
              title: 'NLP Intelligence',
              desc: 'Context-aware natural language processing understands intent behind every request.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              ),
              title: 'Instant Actions',
              desc: 'Real-time automation executes tasks like reminders, emails, and web searches instantly.'
            }
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
              <div className="feature-card__icon">{f.icon}</div>
              <h4 className="feature-card__title">{f.title}</h4>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Next Project Navigation */}
        <div className={`sara__next ${isVisible ? 'is-visible' : ''}`}>
          <span className="sara__next-label">
            <span className="sara__next-line" />
            NEXT PROJECT
          </span>

          <Link to="/phish" className="sara__next-link">
            <span className="sara__next-meta">
              <span className="sara__next-year">2024</span>
              <span className="sara__next-slash">/</span>
            </span>
            <span className="sara__next-name">PHISH</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sara;