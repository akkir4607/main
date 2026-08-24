import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Airguard.css';

const Airguard = () => {
  const [aqiValue, setAqiValue] = useState(42);
  const [isRising, setIsRising] = useState(false);
  const [showSMS, setShowSMS] = useState(false);
  const [particles, setParticles] = useState([]);
  const [sensorData, setSensorData] = useState({
    pm25: 12.3,
    pm10: 28.7,
    o3: 0.034,
    no2: 0.021,
    co: 0.8
  });
  const [alertPhase, setAlertPhase] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const getAQIColor = useCallback((aqi) => {
    if (aqi <= 50) return '#00e676';
    if (aqi <= 100) return '#ffeb3b';
    if (aqi <= 150) return '#ff9800';
    if (aqi <= 200) return '#f44336';
    if (aqi <= 300) return '#9c27b0';
    return '#7e0023';
  }, []);

  const getAQILabel = useCallback((aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sensitive)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }, []);

  const getAQIBgClass = useCallback((aqi) => {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-sensitive';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2
    }));
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    const waveAnim = () => {
      setWaveOffset(prev => prev + 0.02);
      animFrameRef.current = requestAnimationFrame(waveAnim);
    };
    animFrameRef.current = requestAnimationFrame(waveAnim);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    setParticles(prev => prev.map(p => ({
      ...p,
      speed: isRising ? Math.random() * 2 + 1 : Math.random() * 0.5 + 0.1,
      opacity: isRising ? Math.random() * 0.8 + 0.2 : Math.random() * 0.5 + 0.1
    })));
  }, [isRising]);

  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + Math.cos(p.angle) * p.speed * 0.3 + 100) % 100,
        y: (p.y + Math.sin(p.angle) * p.speed * 0.2 - p.speed * 0.1 + 100) % 100,
        angle: p.angle + (Math.random() - 0.5) * 0.1
      })));
    }, 50);
    return () => clearInterval(particleInterval);
  }, []);

  const startDemo = useCallback(() => {
    if (demoStarted) return;
    setDemoStarted(true);
    setPhoneVisible(true);

    let currentAqi = 42;
    let phase = 0;

    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);

    demoIntervalRef.current = setInterval(() => {
      if (phase === 0) {
        currentAqi += Math.random() * 8 + 2;
        setSensorData({
          pm25: 12.3 + (currentAqi - 42) * 0.8,
          pm10: 28.7 + (currentAqi - 42) * 1.2,
          o3: 0.034 + (currentAqi - 42) * 0.001,
          no2: 0.021 + (currentAqi - 42) * 0.0008,
          co: 0.8 + (currentAqi - 42) * 0.02
        });

        if (currentAqi >= 150) {
          setIsRising(true);
          setAlertPhase(1);
          phase = 1;
          setGlowIntensity(1);

          setTimeout(() => {
            setShowSMS(true);
            setAlertPhase(2);
          }, 800);
        } else if (currentAqi >= 100) {
          setGlowIntensity(0.5);
        }

        setAqiValue(Math.round(currentAqi));
      } else if (phase === 1) {
        // hold
        setTimeout(() => {
          phase = 2;
        }, 4000);
        phase = 2;
      } else if (phase === 2) {
        currentAqi -= Math.random() * 5 + 3;
        setSensorData({
          pm25: Math.max(12.3, 12.3 + (currentAqi - 42) * 0.8),
          pm10: Math.max(28.7, 28.7 + (currentAqi - 42) * 1.2),
          o3: Math.max(0.034, 0.034 + (currentAqi - 42) * 0.001),
          no2: Math.max(0.021, 0.021 + (currentAqi - 42) * 0.0008),
          co: Math.max(0.8, 0.8 + (currentAqi - 42) * 0.02)
        });

        if (currentAqi <= 100) {
          setShowSMS(false);
          setAlertPhase(0);
          setGlowIntensity(0);
          setIsRising(false);
        }

        if (currentAqi <= 42) {
          currentAqi = 42;
          phase = 0;
          setDemoStarted(false);
          setTimeout(() => setPhoneVisible(false), 1000);
          clearInterval(demoIntervalRef.current);
        }

        setAqiValue(Math.round(Math.max(42, currentAqi)));
      }
    }, 200);
  }, [demoStarted]);

  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, []);

  // Canvas wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let reqId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const color = getAQIColor(aqiValue);

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 2) {
          const y = h * 0.6 +
            Math.sin((x / w) * Math.PI * 2 + time + wave * 0.8) * (15 + wave * 5) +
            Math.sin((x / w) * Math.PI * 4 + time * 1.5 + wave) * (8 + wave * 3);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, h * 0.4, 0, h);
        gradient.addColorStop(0, `${color}${wave === 0 ? '15' : wave === 1 ? '10' : '08'}`);
        gradient.addColorStop(1, `${color}02`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      time += 0.015;
      reqId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
    };
  }, [aqiValue, getAQIColor]);

  const aqiPercentage = Math.min((aqiValue / 300) * 100, 100);
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (aqiPercentage / 100) * circumference;

  return (
    <div className={`airguard ${getAQIBgClass(aqiValue)}`} ref={sectionRef}>
      {/* Particle Background */}
      <div className="airguard__particles">
        {particles.map(p => (
          <div
            key={p.id}
            className={`airguard__particle ${isRising ? 'particle--active' : ''}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size + (isRising ? 3 : 0)}px`,
              height: `${p.size + (isRising ? 3 : 0)}px`,
              opacity: p.opacity,
              backgroundColor: getAQIColor(aqiValue),
              boxShadow: isRising ? `0 0 ${p.size * 3}px ${getAQIColor(aqiValue)}` : 'none'
            }}
          />
        ))}
      </div>

      {/* Wave Canvas */}
      <canvas ref={canvasRef} className="airguard__wave-canvas" />

      {/* Grid Overlay */}
      <div className="airguard__grid" />

      {/* Content */}
      <div className="airguard__container">
        {/* Header Section */}
        <header className={`airguard__header ${isVisible ? 'header--visible' : ''}`}>
          <div className="airguard__badge">
            <span className="airguard__badge-dot" />
            <span>IoT Air Quality Monitoring</span>
          </div>

          <h1 className="airguard__title">
            <span className="title__air">AIR</span>
            <span className="title__guard">GUARD</span>
            <sup className="title__tm">™</sup>
          </h1>

          <p className="airguard__description">
            Advanced IoT sensors continuously monitor air quality parameters,
            providing <span className="highlight">instant SMS alerts</span> when AQI rises
            to dangerous levels — protecting your health and well-being in real-time.
          </p>
        </header>

        {/* Credits Section */}
        <div className={`airguard__credits ${isVisible ? 'credits--visible' : ''}`}>
          <div className="credit-card">
            <span className="credit-card__label">YEAR</span>
            <span className="credit-card__value">2025</span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">ROLE / SERVICES</span>
            <span className="credit-card__value">IoT Air Quality Monitoring</span>
          </div>
          <div className="credit-card">
            <span className="credit-card__label">SENSOR NETWORK</span>
            <span className="credit-card__value">PM2.5 · PM10 · O₃ · NO₂ · CO</span>
          </div>
        </div>

        {/* Main Demo Area */}
        <div className={`airguard__demo ${isVisible ? 'demo--visible' : ''}`}>
          {/* Dashboard Panel */}
          <div className="airguard__dashboard">
            <div className="dashboard__header">
              <div className="dashboard__title-row">
                <div className="dashboard__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 15a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8H5a2 2 0 0 1 0-4h14" />
                  </svg>
                </div>
                <h3>Live Dashboard</h3>
                <div className={`dashboard__status ${aqiValue > 100 ? 'status--warning' : ''}`}>
                  <span className="status__dot" />
                  {aqiValue > 100 ? 'ALERT' : 'ONLINE'}
                </div>
              </div>
            </div>

            {/* AQI Gauge */}
            <div className="dashboard__gauge">
              <svg viewBox="0 0 140 140" className="gauge__svg">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={getAQIColor(aqiValue)} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={getAQIColor(aqiValue)} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  cx="70" cy="70" r="58"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                />
                <circle
                  cx="70" cy="70" r="58"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 70 70)"
                  filter="url(#glow)"
                  className="gauge__progress"
                />
              </svg>
              <div className="gauge__value">
                <span className="gauge__number" style={{ color: getAQIColor(aqiValue) }}>
                  {aqiValue}
                </span>
                <span className="gauge__unit">AQI</span>
                <span className="gauge__label" style={{ color: getAQIColor(aqiValue) }}>
                  {getAQILabel(aqiValue)}
                </span>
              </div>
            </div>

            {/* Sensor Readings */}
            <div className="dashboard__sensors">
              {[
                { name: 'PM2.5', value: sensorData.pm25.toFixed(1), unit: 'µg/m³', max: 150 },
                { name: 'PM10', value: sensorData.pm10.toFixed(1), unit: 'µg/m³', max: 250 },
                { name: 'O₃', value: sensorData.o3.toFixed(3), unit: 'ppm', max: 0.2 },
                { name: 'NO₂', value: sensorData.no2.toFixed(3), unit: 'ppm', max: 0.1 },
                { name: 'CO', value: sensorData.co.toFixed(1), unit: 'ppm', max: 10 }
              ].map((sensor, i) => (
                <div className="sensor-item" key={sensor.name}>
                  <div className="sensor-item__header">
                    <span className="sensor-item__name">{sensor.name}</span>
                    <span className="sensor-item__value">
                      {sensor.value}
                      <small>{sensor.unit}</small>
                    </span>
                  </div>
                  <div className="sensor-item__bar">
                    <div
                      className="sensor-item__fill"
                      style={{
                        width: `${Math.min((parseFloat(sensor.value) / sensor.max) * 100, 100)}%`,
                        backgroundColor: getAQIColor(aqiValue),
                        boxShadow: `0 0 10px ${getAQIColor(aqiValue)}40`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Start Demo Button */}
            <button
              className={`dashboard__demo-btn ${demoStarted ? 'btn--active' : ''}`}
              onClick={startDemo}
              disabled={demoStarted}
            >
              <span className="btn__icon">
                {demoStarted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </span>
              {demoStarted ? 'Simulation Running...' : 'Start AQI Rise Simulation'}
            </button>
          </div>

          {/* Phone Mockup */}
          <div className={`airguard__phone-container ${phoneVisible ? 'phone--visible' : ''}`}>
            <div className={`airguard__phone ${showSMS ? 'phone--alert' : ''}`}
              style={{
                '--glow-color': getAQIColor(aqiValue),
                '--glow-intensity': glowIntensity
              }}
            >
              {/* Phone Frame */}
              <div className="phone__notch" />
              <div className="phone__screen">
                {/* Status Bar */}
                <div className="phone__statusbar">
                  <span className="statusbar__time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="statusbar__icons">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                    </svg>
                  </div>
                </div>

                {/* Phone Home Content */}
                <div className={`phone__home ${showSMS ? 'home--dimmed' : ''}`}>
                  <div className="phone__date">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  <div className="phone__widget">
                    <div className="widget__aqi-mini">
                      <span className="widget__aqi-value" style={{ color: getAQIColor(aqiValue) }}>
                        {aqiValue}
                      </span>
                      <span className="widget__aqi-label">AQI</span>
                    </div>
                    <div className="widget__location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Your Location</span>
                    </div>
                  </div>

                  <div className="phone__apps">
                    {['📊', '🌤️', '❤️', '⚙️'].map((emoji, i) => (
                      <div className="phone__app-icon" key={i}>{emoji}</div>
                    ))}
                  </div>
                </div>

                {/* SMS Notification */}
                <div className={`phone__sms ${showSMS ? 'sms--visible' : ''}`}>
                  <div className="sms__container">
                    <div className="sms__header">
                      <div className="sms__app-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <div className="sms__info">
                        <span className="sms__sender">AIRGUARD ALERT</span>
                        <span className="sms__time">now</span>
                      </div>
                    </div>
                    <div className="sms__body">
                      <p className="sms__title">⚠️ High AQI Alert!</p>
                      <p className="sms__text">
                        AQI has risen to <strong style={{ color: getAQIColor(aqiValue) }}>{aqiValue}</strong> ({getAQILabel(aqiValue)}).
                        Avoid outdoor activities. Close windows and use air purifier.
                      </p>
                      <div className="sms__meta">
                        <span className="sms__tag">PM2.5: {sensorData.pm25.toFixed(1)} µg/m³</span>
                        <span className="sms__tag">PM10: {sensorData.pm10.toFixed(1)} µg/m³</span>
                      </div>
                    </div>
                    <div className="sms__actions">
                      <button className="sms__action-btn">View Details</button>
                      <button className="sms__action-btn sms__action-btn--dismiss">Dismiss</button>
                    </div>
                  </div>
                </div>

                {/* Vibration Indicator */}
                {showSMS && (
                  <div className="phone__vibration">
                    <div className="vibration__ring vibration__ring--1" />
                    <div className="vibration__ring vibration__ring--2" />
                    <div className="vibration__ring vibration__ring--3" />
                  </div>
                )}
              </div>

              {/* Home Indicator */}
              <div className="phone__home-indicator" />
            </div>

            {/* Phone Label */}
            <div className="phone__label">
              <span className="phone__label-icon">📱</span>
              <span>Instant SMS Alert When AQI Rises</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`airguard__features ${isVisible ? 'features--visible' : ''}`}>
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              ),
              title: 'Real-Time Detection',
              desc: 'Sub-second response time with continuous IoT sensor monitoring across all parameters.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              ),
              title: 'Instant SMS Alerts',
              desc: 'Automatic SMS notifications the moment AQI crosses dangerous thresholds.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              ),
              title: '5-Sensor Network',
              desc: 'PM2.5, PM10, O₃, NO₂, CO — comprehensive air quality measurement suite.'
            }
          ].map((feature, i) => (
            <div
              className="feature-card"
              key={i}
              style={{ animationDelay: `${0.8 + i * 0.15}s` }}
            >
              <div className="feature-card__icon">{feature.icon}</div>
              <h4 className="feature-card__title">{feature.title}</h4>
              <p className="feature-card__desc">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Next Project Navigation */}
        <div className={`airguard__next ${isVisible ? 'next--visible' : ''}`}>
          <span className="airguard__next-label">
            <span className="airguard__next-line" />
            NEXT PROJECT
          </span>

          <Link to="/mgshare" className="airguard__next-link">
            <span className="airguard__next-meta">
              <span className="airguard__next-year">2024</span>
              <span className="airguard__next-slash">/</span>
            </span>
            <span className="airguard__next-name">MGSHARE</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Airguard;