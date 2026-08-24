// Preview.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Preview.css';
import m1 from '../images/m1.png';

const Preview = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const shimmerRef = useRef(null);
  const shadowRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState([]);
  const rafRef = useRef(null);
  const mouseRafRef = useRef(null);
  const navigate = useNavigate();

  // Memoized particles (created ONCE)
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.7 + 0.3,
        type: Math.random() > 0.5 ? 'circle' : 'diamond',
      })),
    []
  );

  // Memoized floating shapes (created ONCE)
  const floatingShapes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        type: ['cube', 'ring', 'pyramid', 'sphere', 'octahedron'][Math.floor(Math.random() * 5)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 8,
        rotateSpeed: Math.random() * 20 + 10,
      })),
    []
  );

  // Memoized data streams (created ONCE)
  const dataStreams = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 10 + i * 15,
        delay: i * 0.8,
        duration: 3 + Math.random() * 4,
        chars: Array.from({ length: 15 }, () =>
          String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
        ),
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    };
  }, []);

  // THROTTLED mouse tracking with RAF (No continuous re-renders!)
  const handleMouseMove = useCallback((e) => {
    if (mouseRafRef.current) return; 
    
    mouseRafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) {
        mouseRafRef.current = null;
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePos.current = { x, y };

      // Direct DOM updates
      if (shimmerRef.current && isHovered) {
        shimmerRef.current.style.setProperty('--mx', `${x * 50 + 50}%`);
        shimmerRef.current.style.setProperty('--my', `${y * 50 + 50}%`);
      }

      if (shadowRef.current && isHovered) {
        shadowRef.current.style.transform = `translate3d(${x * 20}px, ${y * 10 + 40}px, 0)`;
      }

      mouseRafRef.current = null;
    });
  }, [isHovered]);

  // Smooth rotational loop
  useEffect(() => {
    const animate = () => {
      targetRotation.current.x = isHovered ? mousePos.current.y * -15 : 0;
      targetRotation.current.y = isHovered ? mousePos.current.x * 15 : 0;

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

      if (cardRef.current) {
        const tz = isHovered ? 40 : 0;
        const scale = isHovered ? 1.02 : 1;
        cardRef.current.style.transform = `perspective(1200px) rotateX(${currentRotation.current.x.toFixed(2)}deg) rotateY(${currentRotation.current.y.toFixed(2)}deg) translate3d(0, 0, ${tz}px) scale3d(${scale}, ${scale}, 1)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered]);

  const handleClick = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  }, []);

  const handleProjectsClick = useCallback((e) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      navigate('/projects');
    }, 400);
  }, [navigate]);

  const renderShape = useCallback((shape) => {
    const style = { '--rotate-speed': `${shape.rotateSpeed}s`, '--size': `${shape.size}px` };
    switch (shape.type) {
      case 'cube':
        return (
          <div className="prv-shape-3d prv-cube" style={style}>
            <div className="prv-cube-face prv-cube-front" style={style}></div>
            <div className="prv-cube-face prv-cube-back" style={style}></div>
            <div className="prv-cube-face prv-cube-left" style={style}></div>
            <div className="prv-cube-face prv-cube-right" style={style}></div>
            <div className="prv-cube-face prv-cube-top" style={style}></div>
            <div className="prv-cube-face prv-cube-bottom" style={style}></div>
          </div>
        );
      case 'ring':
        return (
          <div className="prv-shape-3d prv-ring" style={style}>
            <div className="prv-ring-inner"></div>
          </div>
        );
      case 'pyramid':
        return (
          <div className="prv-shape-3d prv-pyramid" style={style}>
            <div className="prv-pyramid-face prv-pf-1"></div>
            <div className="prv-pyramid-face prv-pf-2"></div>
            <div className="prv-pyramid-face prv-pf-3"></div>
            <div className="prv-pyramid-face prv-pf-4"></div>
          </div>
        );
      case 'octahedron':
        return (
          <div className="prv-shape-3d prv-octahedron" style={style}>
            <div className="prv-octa-face prv-of-1"></div>
            <div className="prv-octa-face prv-of-2"></div>
            <div className="prv-octa-face prv-of-3"></div>
            <div className="prv-octa-face prv-of-4"></div>
          </div>
        );
      default:
        return <div className="prv-shape-3d prv-sphere" style={style}></div>;
    }
  }, []);

  return (
    <section
      className={`prv-section ${isVisible ? 'prv-visible' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="prv-bg-gradient"></div>
      <div className="prv-bg-mesh"></div>

      <div className="prv-grid-floor">
        <div className="prv-grid-lines"></div>
      </div>

      <div className="prv-aurora">
        <div className="prv-aurora-band prv-ab-1"></div>
        <div className="prv-aurora-band prv-ab-2"></div>
        <div className="prv-aurora-band prv-ab-3"></div>
      </div>

      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className="prv-floating-shape"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            '--duration': `${shape.duration}s`,
            '--delay': `${shape.delay}s`,
          }}
        >
          {renderShape(shape)}
        </div>
      ))}

      <div className="prv-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`prv-particle prv-particle-${p.type}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--opacity': p.opacity,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {ripples.map((r) => (
        <div key={r.id} className="prv-ripple" style={{ left: r.x, top: r.y }}></div>
      ))}

      <div className="prv-scanlines"></div>

      <div className="prv-content">
        <div className="prv-title-wrapper">
          <h1 className="prv-title" data-text="PREVIEW">
            <span className="prv-title-line prv-tl-1">PREV</span>
            <span className="prv-title-line prv-tl-2">IEW</span>
          </h1>
          <div className="prv-title-sub">
            {['E', 'X', 'P', 'E', 'R', 'I', 'E', 'N', 'C', 'E'].map((char, i) => (
              <span key={i} className="prv-subtitle-char" style={{ '--i': i }}>
                {char}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`prv-card-container ${isHovered ? 'prv-card-hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="prv-holo-beam"></div>

          <div className="prv-orbit prv-orbit-1">
            <div className="prv-orbit-dot"></div>
          </div>
          <div className="prv-orbit prv-orbit-2">
            <div className="prv-orbit-dot"></div>
          </div>
          <div className="prv-orbit prv-orbit-3">
            <div className="prv-orbit-dot"></div>
          </div>

          <div className="prv-card" ref={cardRef}>
            <div className="prv-card-layer prv-card-layer-1"></div>
            <div className="prv-card-layer prv-card-layer-2"></div>
            <div className="prv-card-layer prv-card-layer-3"></div>

            <div className="prv-holo-shimmer" ref={shimmerRef}></div>

            <div className="prv-image-wrapper">
              <div className="prv-image-glitch">
                <img src={m1} alt="Preview" className="prv-image prv-img-r" loading="eager" />
                <img src={m1} alt="" className="prv-image prv-img-g" aria-hidden="true" />
                <img src={m1} alt="" className="prv-image prv-img-b" aria-hidden="true" />
              </div>

              <div className="prv-scan-line"></div>

              <div className="prv-corner prv-corner-tl"></div>
              <div className="prv-corner prv-corner-tr"></div>
              <div className="prv-corner prv-corner-bl"></div>
              <div className="prv-corner prv-corner-br"></div>

              <div className="prv-hud">
                <div className="prv-hud-line prv-hud-top">
                  <span className="prv-hud-text">SYS.ONLINE</span>
                  <span className="prv-hud-dot"></span>
                </div>
                <div className="prv-hud-line prv-hud-bottom">
                  <span className="prv-hud-text">RES: 4K</span>
                  <div className="prv-hud-bar">
                    <div className="prv-hud-bar-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prv-card-shadow" ref={shadowRef}></div>
        </div>

        <div className="prv-info-grid">
          {[
            { icon: '◆', label: 'RESOLUTION', value: '4096×4096', color: '#00f0ff' },
            { icon: '▲', label: 'ENGINE', value: 'QUANTUM V3', color: '#ff00aa' },
            { icon: '●', label: 'RENDER', value: 'REAL-TIME', color: '#7b2fff' },
            { icon: '■', label: 'STATUS', value: 'ACTIVE', color: '#00ff88' },
          ].map((item, i) => (
            <div
              key={i}
              className="prv-info-card"
              style={{ '--accent': item.color, '--delay': `${i * 0.15}s` }}
            >
              <div className="prv-info-icon">{item.icon}</div>
              <div className="prv-info-content">
                <span className="prv-info-label">{item.label}</span>
                <span className="prv-info-value">{item.value}</span>
              </div>
              <div className="prv-info-glow"></div>
            </div>
          ))}
        </div>

        <div className="prv-cta-wrapper">
          <button className="prv-cta-btn" onClick={handleProjectsClick}>
            <span className="prv-cta-text">PROJECTS</span>
            <div className="prv-cta-particles">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="prv-cta-particle" style={{ '--i': i }}></span>
              ))}
            </div>
            <div className="prv-cta-glow"></div>
            <svg className="prv-cta-border" viewBox="0 0 280 60" preserveAspectRatio="none">
              <rect x="1" y="1" width="278" height="58" rx="30" />
            </svg>
          </button>
        </div>
      </div>

      <div className="prv-data-streams">
        {dataStreams.map((stream) => (
          <div
            key={stream.id}
            className="prv-data-stream"
            style={{
              left: `${stream.left}%`,
              animationDelay: `${stream.delay}s`,
              '--duration': `${stream.duration}s`,
            }}
          >
            {stream.chars.map((char, j) => (
              <span key={j} className="prv-data-char" style={{ '--i': j }}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Preview;