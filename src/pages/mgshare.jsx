import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './mgshare.css';

const MGShare = () => {
  const [transferProgress, setTransferProgress] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [scanRotation, setScanRotation] = useState(0);
  const [transferSpeed, setTransferSpeed] = useState(0);
  const [transferredSize, setTransferredSize] = useState(0);
  const sectionRef = useRef(null);
  const transferIntervalRef = useRef(null);
  const canvasRef = useRef(null);

  const devices = [
    { id: 1, name: 'MacBook Pro', type: 'laptop', os: 'macOS', angle: 0, distance: 140, icon: '💻' },
    { id: 2, name: 'iPhone 15', type: 'phone', os: 'iOS', angle: 72, distance: 130, icon: '📱' },
    { id: 3, name: 'Galaxy S24', type: 'phone', os: 'Android', angle: 144, distance: 145, icon: '📱' },
    { id: 4, name: 'iPad Pro', type: 'tablet', os: 'iPadOS', angle: 216, distance: 135, icon: '📱' },
    { id: 5, name: 'Windows PC', type: 'desktop', os: 'Windows', angle: 288, distance: 150, icon: '🖥️' }
  ];

  const files = [
    { name: 'presentation.pdf', size: '12.4 MB', type: 'pdf', icon: '📄', color: '#ef4444' },
    { name: 'vacation.jpg', size: '4.2 MB', type: 'image', icon: '🖼️', color: '#8b5cf6' },
    { name: 'project.zip', size: '48.7 MB', type: 'archive', icon: '📦', color: '#f59e0b' },
    { name: 'music.mp3', size: '8.9 MB', type: 'audio', icon: '🎵', color: '#10b981' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const initialParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(initialParticles);
  }, []);

  // Scan rotation
  useEffect(() => {
    let raf;
    const animate = () => {
      setScanRotation(prev => (prev + 0.5) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Particle movement
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

  // Canvas connection lines
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

      devices.forEach((device) => {
        const rad = (device.angle - 90) * Math.PI / 180;
        const dx = cx + Math.cos(rad) * device.distance;
        const dy = cy + Math.sin(rad) * device.distance;

        const isActive = selectedDevice?.id === device.id;
        const color = isActive ? '#00d9ff' : 'rgba(255,255,255,0.08)';

        // Dashed connection line
        ctx.beginPath();
        ctx.setLineDash(isActive ? [4, 4] : [2, 6]);
        ctx.lineDashOffset = -time * (isActive ? 2 : 0.5);
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.moveTo(cx, cy);
        ctx.lineTo(dx, dy);
        ctx.stroke();

        // Data packets flowing on active line
        if (isActive && isTransferring) {
          for (let i = 0; i < 3; i++) {
            const t = ((time * 0.02 + i / 3) % 1);
            const px = cx + (dx - cx) * t;
            const py = cy + (dy - cy) * t;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00d9ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00d9ff';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      time += 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [selectedDevice, isTransferring]);

  const startTransfer = useCallback(() => {
    if (!selectedDevice || !selectedFile || isTransferring) return;
    setIsTransferring(true);
    setTransferComplete(false);
    setTransferProgress(0);
    setTransferredSize(0);

    const totalSize = parseFloat(selectedFile.size);
    let progress = 0;

    if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);

    transferIntervalRef.current = setInterval(() => {
      progress += Math.random() * 4 + 2;
      const speed = (Math.random() * 8 + 4).toFixed(1);
      setTransferSpeed(speed);
      setTransferredSize((totalSize * Math.min(progress, 100) / 100).toFixed(1));

      if (progress >= 100) {
        progress = 100;
        setTransferProgress(100);
        setIsTransferring(false);
        setTransferComplete(true);
        clearInterval(transferIntervalRef.current);

        setTimeout(() => {
          setTransferComplete(false);
          setTransferProgress(0);
          setTransferSpeed(0);
          setTransferredSize(0);
        }, 3500);
      } else {
        setTransferProgress(progress);
      }
    }, 150);
  }, [selectedDevice, selectedFile, isTransferring]);

  useEffect(() => {
    return () => {
      if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);
    };
  }, []);

  return (
    <div className="mgshare" ref={sectionRef}>
      {/* Background particles */}
      <div className="mgshare__particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="mgshare__particle"
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

      {/* Grid */}
      <div className="mgshare__grid" />

      {/* Gradient orbs */}
      <div className="mgshare__orb mgshare__orb--1" />
      <div className="mgshare__orb mgshare__orb--2" />

      <div className="mgshare__container">
        {/* Header */}
        <header className={`mgshare__header ${isVisible ? 'is-visible' : ''}`}>
          <div className="mgshare__badge">
            <span className="mgshare__badge-dot" />
            <span>Cross-Device File Sharing</span>
          </div>

          <h1 className="mgshare__title">
            <span className="title__mg">MG</span><span className="title__share">Share</span>
          </h1>

          <p className="mgshare__description">
            Seamlessly transfer files across any device on your local network — no internet, no cloud, no limits.
            <span className="highlight"> Fast, private, and secure</span> file sharing between phones, laptops, tablets, and desktops.
          </p>
        </header>

        {/* Credits */}
        <div className={`mgshare__credits ${isVisible ? 'is-visible' : ''}`}>
          <div className="credit-card">
            <span className="credit-card__label">ROLE / SERVICES</span>
            <span className="credit-card__value">Cross-Device Sharing</span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">TECH STACK</span>
            <span className="credit-card__value">
              <span className="tech-chip">Python</span>
              <span className="tech-chip">React</span>
              <span className="tech-chip">Flask</span>
              <span className="tech-chip">Werkzeug</span>
              <span className="tech-chip">Kotlin</span>
            </span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">LOCATION & YEAR</span>
            <span className="credit-card__value">2024</span>
          </div>
        </div>

        {/* Main Demo */}
        <div className={`mgshare__demo ${isVisible ? 'is-visible' : ''}`}>
          {/* Left: File Selection */}
          <div className="demo__panel demo__panel--files">
            <div className="panel__header">
              <div className="panel__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              </div>
              <h3>Select File</h3>
            </div>

            <div className="files-list">
              {files.map((file, i) => (
                <button
                  key={i}
                  className={`file-item ${selectedFile?.name === file.name ? 'is-selected' : ''}`}
                  onClick={() => setSelectedFile(file)}
                  disabled={isTransferring}
                >
                  <div className="file-item__icon" style={{ background: `${file.color}20`, color: file.color }}>
                    <span>{file.icon}</span>
                  </div>
                  <div className="file-item__info">
                    <span className="file-item__name">{file.name}</span>
                    <span className="file-item__size">{file.size}</span>
                  </div>
                  <div className="file-item__check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Radar */}
          <div className="demo__panel demo__panel--radar">
            <div className="panel__header panel__header--center">
              <div className="panel__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
              </div>
              <h3>Nearby Devices</h3>
            </div>

            <div className="radar">
              <canvas ref={canvasRef} className="radar__canvas" />

              {/* Radar circles */}
              <div className="radar__circle radar__circle--1" />
              <div className="radar__circle radar__circle--2" />
              <div className="radar__circle radar__circle--3" />

              {/* Scanning line */}
              <div className="radar__scan" style={{ transform: `rotate(${scanRotation}deg)` }} />

              {/* Center hub */}
              <div className="radar__center">
                <div className="radar__center-pulse" />
                <div className="radar__center-pulse radar__center-pulse--2" />
                <div className="radar__center-core">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="radar__center-label">YOU</span>
              </div>

              {/* Devices */}
              {devices.map(device => {
                const rad = (device.angle - 90) * Math.PI / 180;
                const x = Math.cos(rad) * device.distance;
                const y = Math.sin(rad) * device.distance;
                return (
                  <button
                    key={device.id}
                    className={`radar__device ${selectedDevice?.id === device.id ? 'is-selected' : ''}`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                    onClick={() => setSelectedDevice(device)}
                    disabled={isTransferring}
                  >
                    <div className="radar__device-icon">
                      <span>{device.icon}</span>
                      <div className="radar__device-pulse" />
                    </div>
                    <div className="radar__device-info">
                      <span className="radar__device-name">{device.name}</span>
                      <span className="radar__device-os">{device.os}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Transfer Panel */}
          <div className="demo__panel demo__panel--transfer">
            <div className="panel__header">
              <div className="panel__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <h3>Transfer</h3>
            </div>

            <div className="transfer-summary">
              <div className="transfer-summary__row">
                <span className="transfer-summary__label">FROM</span>
                <div className="transfer-summary__value">
                  <div className="transfer-summary__icon">📤</div>
                  <span>Your Device</span>
                </div>
              </div>

              <div className="transfer-summary__arrow">
                <div className={`arrow-line ${isTransferring ? 'is-active' : ''}`}>
                  <span className="arrow-dot" />
                  <span className="arrow-dot" />
                  <span className="arrow-dot" />
                </div>
              </div>

              <div className="transfer-summary__row">
                <span className="transfer-summary__label">TO</span>
                <div className="transfer-summary__value">
                  <div className="transfer-summary__icon">
                    {selectedDevice ? selectedDevice.icon : '❓'}
                  </div>
                  <span>{selectedDevice ? selectedDevice.name : 'Select device'}</span>
                </div>
              </div>

              <div className="transfer-summary__row">
                <span className="transfer-summary__label">FILE</span>
                <div className="transfer-summary__value">
                  <div className="transfer-summary__icon">
                    {selectedFile ? selectedFile.icon : '📄'}
                  </div>
                  <span>{selectedFile ? selectedFile.name : 'Select file'}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className={`transfer-progress ${isTransferring || transferComplete ? 'is-active' : ''}`}>
              <div className="transfer-progress__header">
                <span className="transfer-progress__percent">
                  {transferComplete ? '✓ Completed' : `${Math.round(transferProgress)}%`}
                </span>
                {isTransferring && (
                  <span className="transfer-progress__speed">{transferSpeed} MB/s</span>
                )}
              </div>
              <div className="transfer-progress__bar">
                <div
                  className={`transfer-progress__fill ${transferComplete ? 'is-complete' : ''}`}
                  style={{ width: `${transferProgress}%` }}
                >
                  <div className="transfer-progress__shimmer" />
                </div>
              </div>
              {isTransferring && selectedFile && (
                <div className="transfer-progress__info">
                  <span>{transferredSize} MB / {selectedFile.size}</span>
                </div>
              )}
            </div>

            <button
              className={`transfer-btn ${(!selectedDevice || !selectedFile) ? 'is-disabled' : ''} ${isTransferring ? 'is-transferring' : ''} ${transferComplete ? 'is-complete' : ''}`}
              onClick={startTransfer}
              disabled={!selectedDevice || !selectedFile || isTransferring}
            >
              <span className="transfer-btn__icon">
                {transferComplete ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isTransferring ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </span>
              <span>
                {transferComplete ? 'Transfer Complete' : isTransferring ? 'Transferring...' : 'Send File'}
              </span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className={`mgshare__features ${isVisible ? 'is-visible' : ''}`}>
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              ),
              title: 'Lightning Fast',
              desc: 'Direct peer-to-peer transfers over local network with no bandwidth limits.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              title: '100% Private',
              desc: 'End-to-end encrypted transfers. No cloud servers, no data collection.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ),
              title: 'Cross Platform',
              desc: 'Works seamlessly on Windows, macOS, Linux, Android, and iOS devices.'
            }
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
              <div className="feature-card__icon">{f.icon}</div>
              <h4 className="feature-card__title">{f.title}</h4>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Next Section - About */}
        <div className={`mgshare__next ${isVisible ? 'is-visible' : ''}`}>
          <span className="mgshare__next-label">
            <span className="mgshare__next-line" />
            NEXT UP
          </span>

          <Link to="/about" className="mgshare__next-link">
            <span className="mgshare__next-meta">
              <span className="mgshare__next-year">2023</span>
              <span className="mgshare__next-slash">/</span>
            </span>
            <span className="mgshare__next-name">ABOUT</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MGShare;