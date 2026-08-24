import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './phish.css';

const Phish = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [particles, setParticles] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [shieldPulse, setShieldPulse] = useState(false);
  const [hoveredMeta, setHoveredMeta] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [matrixChars, setMatrixChars] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  const headline = "Phishing Link Detector";
  const description = "An intelligent security tool that analyzes URLs in real-time, detecting malicious phishing attempts before they compromise your data. Powered by pattern recognition, domain analysis, and threat intelligence feeds.";

  const demoUrls = [
    { url: 'https://secure-banking.com/login', safe: true, label: 'Legitimate Bank' },
    { url: 'http://g00gle-verify.tk/account-suspended', safe: false, label: 'Phishing Attempt' },
    { url: 'https://github.com/repository', safe: true, label: 'Trusted Platform' },
    { url: 'http://paypa1-secure.xyz/confirm-identity', safe: false, label: 'Credential Harvest' },
    { url: 'https://docs.google.com/document', safe: true, label: 'Google Docs' },
    { url: 'http://amaz0n-refund.ru/claim-now', safe: false, label: 'Scam Link' },
  ];

  const threatIndicators = [
    'Suspicious TLD detected',
    'Homoglyph characters found',
    'URL shortener redirect',
    'Missing SSL certificate',
    'Domain age < 30 days',
    'Known phishing pattern',
    'Misleading subdomain',
    'Encoded characters in path',
  ];

  // Typing animation for headline
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= headline.length) {
        setTypedText(headline.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコ<>/{}[]|\\';
    const columns = 30;
    const newMatrixChars = Array.from({ length: columns }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      x: (i / columns) * 100,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setMatrixChars(newMatrixChars);

    const interval = setInterval(() => {
      setMatrixChars(prev =>
        prev.map(c => ({
          ...c,
          char: chars[Math.floor(Math.random() * chars.length)],
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Canvas network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Create nodes
    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Shield pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShieldPulse(true);
      setTimeout(() => setShieldPulse(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runScan = useCallback((url, isSafe) => {
    setCurrentUrl(url);
    setScanProgress(0);
    setScanComplete(false);
    setScanResult(null);
    setActiveDemo(url);

    const duration = 2000;
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        setScanComplete(true);
        setScanResult(isSafe ? 'safe' : 'danger');
        setScanHistory(prev => [
          { url, safe: isSafe, time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4),
        ]);
      }
    };

    requestAnimationFrame(animateProgress);
  }, []);

  const getRandomIndicators = () => {
    const shuffled = [...threatIndicators].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const metaItems = [
    {
      key: 'year',
      label: 'Year',
      value: '2025',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="15" r="1.5" />
        </svg>
      ),
    },
    {
      key: 'credits',
      label: 'Credits',
      value: 'Security Awareness Training',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      key: 'role',
      label: 'Role / Service',
      value: 'Secure from Phishing Links',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
  ];

  return (
    <section className="phish" ref={containerRef}>
      {/* Background Effects */}
      <div className="phish__bg">
        <canvas ref={canvasRef} className="phish__canvas" />
        <div className="phish__grid" />
        <div className="phish__gradient-orb phish__gradient-orb--1" />
        <div className="phish__gradient-orb phish__gradient-orb--2" />
        <div className="phish__gradient-orb phish__gradient-orb--3" />

        {/* Matrix rain */}
        {matrixChars.map(char => (
          <span
            key={char.id}
            className="phish__matrix-char"
            style={{
              left: `${char.x}%`,
              animationDuration: `${char.duration}s`,
              animationDelay: `${char.delay}s`,
              opacity: char.opacity,
            }}
          >
            {char.char}
          </span>
        ))}

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="phish__particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <div className="phish__container">
        {/* Header Section */}
        <header className={`phish__header ${isVisible ? 'phish__header--visible' : ''}`}>
          <div className="phish__badge">
            <span className="phish__badge-dot" />
            <span>SECURITY PROJECT</span>
          </div>

          <h1 className="phish__headline">
            <span className="phish__headline-text">
              {typedText}
              <span className="phish__cursor">|</span>
            </span>
          </h1>

          <p className="phish__description">{description}</p>
        </header>

        {/* Meta Section */}
        <div className={`phish__meta ${isVisible ? 'phish__meta--visible' : ''}`}>
          {metaItems.map((item, index) => (
            <div
              key={item.key}
              className={`phish__meta-card ${hoveredMeta === item.key ? 'phish__meta-card--hovered' : ''}`}
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
              onMouseEnter={() => setHoveredMeta(item.key)}
              onMouseLeave={() => setHoveredMeta(null)}
            >
              <div className="phish__meta-icon">{item.icon}</div>
              <div className="phish__meta-content">
                <span className="phish__meta-label">{item.label}</span>
                <span className="phish__meta-value">{item.value}</span>
              </div>
              <div className="phish__meta-glow" />
            </div>
          ))}
        </div>

        {/* Interactive Demo */}
        <div className={`phish__demo ${isVisible ? 'phish__demo--visible' : ''}`}>
          <div className="phish__demo-header">
            <div className="phish__demo-title-row">
              <div className={`phish__shield ${shieldPulse ? 'phish__shield--pulse' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <h3 className="phish__demo-title">Live URL Scanner</h3>
                <p className="phish__demo-subtitle">Click any URL below to analyze</p>
              </div>
            </div>
            <div className="phish__demo-status">
              <span className="phish__status-dot" />
              <span>Engine Active</span>
            </div>
          </div>

          {/* URL List */}
          <div className="phish__url-grid">
            {demoUrls.map((item, index) => (
              <button
                key={index}
                className={`phish__url-item ${activeDemo === item.url ? 'phish__url-item--active' : ''} ${
                  scanComplete && activeDemo === item.url
                    ? item.safe
                      ? 'phish__url-item--safe'
                      : 'phish__url-item--danger'
                    : ''
                }`}
                onClick={() => runScan(item.url, item.safe)}
              >
                <div className="phish__url-icon">
                  {scanComplete && activeDemo === item.url ? (
                    item.safe ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                </div>
                <div className="phish__url-content">
                  <span className="phish__url-label">{item.label}</span>
                  <span className="phish__url-text">{item.url}</span>
                </div>
                <div className="phish__url-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Scan Terminal */}
          {activeDemo && (
            <div className="phish__terminal">
              <div className="phish__terminal-bar">
                <div className="phish__terminal-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="phish__terminal-title">scan-engine v2.1.0</span>
                <div className="phish__terminal-actions">
                  <span className="phish__terminal-minimize">─</span>
                </div>
              </div>

              <div className="phish__terminal-body">
                <div className="phish__scan-line">
                  <span className="phish__prompt">$</span>
                  <span className="phish__command">phish-detect --analyze "{currentUrl}"</span>
                </div>

                <div className="phish__scan-progress-row">
                  <div className="phish__scan-bar">
                    <div
                      className={`phish__scan-fill ${
                        scanComplete ? (scanResult === 'safe' ? 'phish__scan-fill--safe' : 'phish__scan-fill--danger') : ''
                      }`}
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="phish__scan-percent">{Math.round(scanProgress)}%</span>
                </div>

                {scanProgress > 15 && (
                  <div className="phish__scan-step phish__scan-step--1">
                    <span className="phish__check">✓</span> DNS resolution check
                  </div>
                )}
                {scanProgress > 35 && (
                  <div className="phish__scan-step phish__scan-step--2">
                    <span className="phish__check">✓</span> SSL certificate validation
                  </div>
                )}
                {scanProgress > 55 && (
                  <div className="phish__scan-step phish__scan-step--3">
                    <span className="phish__check">✓</span> Domain reputation lookup
                  </div>
                )}
                {scanProgress > 75 && (
                  <div className="phish__scan-step phish__scan-step--4">
                    <span className="phish__check">✓</span> Pattern analysis complete
                  </div>
                )}
                {scanProgress > 90 && (
                  <div className="phish__scan-step phish__scan-step--5">
                    <span className="phish__check">✓</span> Threat intelligence cross-reference
                  </div>
                )}

                {scanComplete && (
                  <div className={`phish__result ${scanResult === 'safe' ? 'phish__result--safe' : 'phish__result--danger'}`}>
                    <div className="phish__result-header">
                      <div className="phish__result-icon">
                        {scanResult === 'safe' ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 12 11 14 15 10" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="phish__result-title">
                          {scanResult === 'safe' ? 'URL IS SAFE' : 'PHISHING DETECTED'}
                        </h4>
                        <p className="phish__result-desc">
                          {scanResult === 'safe'
                            ? 'No threats detected. This URL appears to be legitimate.'
                            : 'WARNING: This URL exhibits characteristics of a phishing attempt.'}
                        </p>
                      </div>
                    </div>

                    {scanResult === 'danger' && (
                      <div className="phish__threat-list">
                        <span className="phish__threat-label">Threat Indicators:</span>
                        {getRandomIndicators().map((indicator, i) => (
                          <div key={i} className="phish__threat-item">
                            <span className="phish__threat-dot" />
                            {indicator}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="phish__result-stats">
                      <div className="phish__stat">
                        <span className="phish__stat-label">Confidence</span>
                        <span className="phish__stat-value">{scanResult === 'safe' ? '98.7%' : '94.2%'}</span>
                      </div>
                      <div className="phish__stat">
                        <span className="phish__stat-label">Scan Time</span>
                        <span className="phish__stat-value">2.1s</span>
                      </div>
                      <div className="phish__stat">
                        <span className="phish__stat-label">Checks Run</span>
                        <span className="phish__stat-value">47</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="phish__history">
              <h4 className="phish__history-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Recent Scans
              </h4>
              <div className="phish__history-list">
                {scanHistory.map((item, i) => (
                  <div key={i} className="phish__history-item">
                    <span className={`phish__history-dot ${item.safe ? 'phish__history-dot--safe' : 'phish__history-dot--danger'}`} />
                    <span className="phish__history-url">{item.url}</span>
                    <span className="phish__history-time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Project Navigation */}
        <div className={`phish__next ${isVisible ? 'phish__next--visible' : ''}`}>
          <span className="phish__next-label">
            <span className="phish__next-line" />
            NEXT PROJECT
          </span>

          <Link to="/airguard" className="phish__next-link">
            <span className="phish__next-meta">
              <span className="phish__next-year">2025</span>
              <span className="phish__next-slash">/</span>
            </span>
            <span className="phish__next-name">AIRGUARD</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Phish;
