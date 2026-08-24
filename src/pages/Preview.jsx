// Preview.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Preview.css';
import m1 from '../images/m1.png';

const Preview = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [floatingShapes, setFloatingShapes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState([]);

  const rafRef = useRef(null);
  const currentRotation = useRef({ x: 0, y: 0 });

  // Generate particles and floating shapes
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.7 + 0.3,
      type: Math.random() > 0.5 ? 'circle' : 'diamond',
    }));

    setParticles(newParticles);

    const shapes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      type: ['cube', 'ring', 'pyramid', 'sphere', 'octahedron'][
        Math.floor(Math.random() * 5)
      ],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      rotateSpeed: Math.random() * 20 + 10,
    }));

    setFloatingShapes(shapes);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Smooth mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMousePos({ x, y });
  }, []);

  // Smooth card animation
  useEffect(() => {
    const animate = () => {
      const targetX = isHovered ? mousePos.y * -20 : 0;
      const targetY = isHovered ? mousePos.x * 20 : 0;

      currentRotation.current.x +=
        (targetX - currentRotation.current.x) * 0.08;

      currentRotation.current.y +=
        (targetY - currentRotation.current.y) * 0.08;

      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1200px)
          rotateX(${currentRotation.current.x}deg)
          rotateY(${currentRotation.current.y}deg)
          translateZ(${isHovered ? 50 : 0}px)
          scale(${isHovered ? 1.02 : 1})
        `;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mousePos, isHovered]);

  // Click ripple
  const handleClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) =>
        prev.filter((r) => r.id !== newRipple.id)
      );
    }, 1500);
  };

  // Render 3D floating shapes
  const renderShape = (shape) => {
    switch (shape.type) {
      case 'cube':
        return (
          <div
            className="prv-shape-3d prv-cube"
            style={{
              '--rotate-speed': `${shape.rotateSpeed}s`,
            }}
          >
            <div className="prv-cube-face prv-cube-front"></div>
            <div className="prv-cube-face prv-cube-back"></div>
            <div className="prv-cube-face prv-cube-left"></div>
            <div className="prv-cube-face prv-cube-right"></div>
            <div className="prv-cube-face prv-cube-top"></div>
            <div className="prv-cube-face prv-cube-bottom"></div>
          </div>
        );

      case 'ring':
        return (
          <div
            className="prv-shape-3d prv-ring"
            style={{
              '--rotate-speed': `${shape.rotateSpeed}s`,
            }}
          >
            <div className="prv-ring-inner"></div>
          </div>
        );

      case 'pyramid':
        return (
          <div
            className="prv-shape-3d prv-pyramid"
            style={{
              '--rotate-speed': `${shape.rotateSpeed}s`,
            }}
          >
            <div className="prv-pyramid-face prv-pf-1"></div>
            <div className="prv-pyramid-face prv-pf-2"></div>
            <div className="prv-pyramid-face prv-pf-3"></div>
            <div className="prv-pyramid-face prv-pf-4"></div>
          </div>
        );

      case 'octahedron':
        return (
          <div
            className="prv-shape-3d prv-octahedron"
            style={{
              '--rotate-speed': `${shape.rotateSpeed}s`,
            }}
          >
            <div className="prv-octa-face prv-of-1"></div>
            <div className="prv-octa-face prv-of-2"></div>
            <div className="prv-octa-face prv-of-3"></div>
            <div className="prv-octa-face prv-of-4"></div>
          </div>
        );

      default:
        return (
          <div
            className="prv-shape-3d prv-sphere"
            style={{
              '--rotate-speed': `${shape.rotateSpeed}s`,
            }}
          ></div>
        );
    }
  };

  return (
    <section
      className={`prv-section ${
        isVisible ? 'prv-visible' : ''
      }`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Animated gradient background */}
      <div className="prv-bg-gradient"></div>
      <div className="prv-bg-mesh"></div>

      {/* Grid floor */}
      <div className="prv-grid-floor">
        <div className="prv-grid-lines"></div>
      </div>

      {/* Aurora effect */}
      <div className="prv-aurora">
        <div className="prv-aurora-band prv-ab-1"></div>
        <div className="prv-aurora-band prv-ab-2"></div>
        <div className="prv-aurora-band prv-ab-3"></div>
      </div>

      {/* Floating 3D shapes */}
      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          className="prv-floating-shape"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
          }}
        >
          {renderShape(shape)}
        </div>
      ))}

      {/* Particles */}
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
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Click ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="prv-ripple"
          style={{
            left: r.x,
            top: r.y,
          }}
        ></div>
      ))}

      {/* Scan lines */}
      <div className="prv-scanlines"></div>

      {/* Main content */}
      <div className="prv-content">

        {/* Glitch title */}
        <div className="prv-title-wrapper">
          <h1
            className="prv-title"
            data-text="PREVIEW"
          >
            <span className="prv-title-line prv-tl-1">
              PREV
            </span>

            <span className="prv-title-line prv-tl-2">
              IEW
            </span>
          </h1>
        </div>

        {/* 3D Holographic Card */}
        <div
          className={`prv-card-container ${
            isHovered ? 'prv-card-hovered' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hologram beam */}
          <div className="prv-holo-beam"></div>

          {/* Orbiting rings */}
          <div className="prv-orbit prv-orbit-1">
            <div className="prv-orbit-dot"></div>
          </div>

          <div className="prv-orbit prv-orbit-2">
            <div className="prv-orbit-dot"></div>
          </div>

          <div className="prv-orbit prv-orbit-3">
            <div className="prv-orbit-dot"></div>
          </div>

          <div
            className="prv-card"
            ref={cardRef}
          >
            {/* Card layers */}
            <div className="prv-card-layer prv-card-layer-1"></div>
            <div className="prv-card-layer prv-card-layer-2"></div>
            <div className="prv-card-layer prv-card-layer-3"></div>

            {/* Holographic shimmer */}
            <div
              className="prv-holo-shimmer"
              style={{
                '--mx': `${mousePos.x * 50 + 50}%`,
                '--my': `${mousePos.y * 50 + 50}%`,
              }}
            ></div>

            {/* Image container */}
            <div className="prv-image-wrapper">
              <div className="prv-image-glitch">
                <img
                  src={m1}
                  alt="Preview"
                  className="prv-image prv-img-r"
                />

                <img
                  src={m1}
                  alt=""
                  className="prv-image prv-img-g"
                  aria-hidden="true"
                />

                <img
                  src={m1}
                  alt=""
                  className="prv-image prv-img-b"
                  aria-hidden="true"
                />
              </div>

              {/* Scan effect */}
              <div className="prv-scan-line"></div>

              {/* Corner decorations */}
              <div className="prv-corner prv-corner-tl"></div>
              <div className="prv-corner prv-corner-tr"></div>
              <div className="prv-corner prv-corner-bl"></div>
              <div className="prv-corner prv-corner-br"></div>

              {/* HUD overlay */}
              <div className="prv-hud">
                <div className="prv-hud-line prv-hud-top">
                  <span className="prv-hud-text">
                    SYS.ONLINE
                  </span>

                  <span className="prv-hud-dot"></span>
                </div>

                <div className="prv-hud-line prv-hud-bottom">
                  <span className="prv-hud-text">
                    RES: 4K
                  </span>

                  <div className="prv-hud-bar">
                    <div className="prv-hud-bar-fill"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reflection */}
            <div className="prv-reflection">
              <img
                src={m1}
                alt=""
                className="prv-reflection-img"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Shadow */}
          <div
            className="prv-card-shadow"
            style={{
              transform: `
                translateX(${mousePos.x * 20}px)
                translateY(${mousePos.y * 10 + 40}px)
              `,
            }}
          ></div>
        </div>

        {/* Stats / Info cards */}
        <div className="prv-info-grid">
          {[
            {
              icon: '◆',
              label: 'RESOLUTION',
              value: '4096×4096',
              color: '#00f0ff',
            },
            {
              icon: '▲',
              label: 'ENGINE',
              value: 'QUANTUM V3',
              color: '#ff00aa',
            },
            {
              icon: '●',
              label: 'RENDER',
              value: 'REAL-TIME',
              color: '#7b2fff',
            },
            {
              icon: '■',
              label: 'STATUS',
              value: 'ACTIVE',
              color: '#00ff88',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="prv-info-card"
              style={{
                '--accent': item.color,
                '--delay': `${i * 0.15}s`,
              }}
            >
              <div className="prv-info-icon">
                {item.icon}
              </div>

              <div className="prv-info-content">
                <span className="prv-info-label">
                  {item.label}
                </span>

                <span className="prv-info-value">
                  {item.value}
                </span>
              </div>

              <div className="prv-info-glow"></div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="prv-cta-wrapper">
          <Link
            to="/projects"
            className="prv-cta-btn"
            aria-label="Go to Projects"
          >
            <span className="prv-cta-text">
              GO TO PROJECT
            </span>

            <div className="prv-cta-particles">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className="prv-cta-particle"
                  style={{
                    '--i': i,
                  }}
                ></span>
              ))}
            </div>

            <div className="prv-cta-glow"></div>

            <svg
              className="prv-cta-border"
              viewBox="0 0 280 60"
              preserveAspectRatio="none"
            >
              <rect
                x="1"
                y="1"
                width="278"
                height="58"
                rx="30"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Floating data streams */}
      <div className="prv-data-streams">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="prv-data-stream"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Array.from({ length: 15 }, (_, j) => (
              <span
                key={j}
                className="prv-data-char"
              >
                {String.fromCharCode(
                  0x30a0 + Math.random() * 96
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Preview;