import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Work2.css';

const projects = [
  {
    id: '01',
    title: 'SARA',
    category: 'SPEECH RECOGNITION AND RESPONSE SYSTEM',
    route: '/sara',
    tags: ['AI', 'NLP', 'Python'],
  },
  {
    id: '02',
    title: 'Phishing Link Detector',
    category: 'DESIGN & DEVELOPMENT',
    route: '/phish',
    tags: ['Security', 'ML', 'Web'],
  },
  {
    id: '03',
    title: 'AirGuard',
    category: 'IOT & EMBEDDED SYSTEMS',
    route: '/airguard',
    tags: ['IoT', 'C++', 'Sensors'],
  },
  {
    id: '04',
    title: 'MGShare',
    category: 'NETWORKING & FILE SHARING',
    route: '/mgshare',
    tags: ['Network', 'P2P', 'Java'],
  },
  {
    id: '05',
    title: 'LinkBit',
    category: 'NETWORKING & REAL-TIME CHATTING PLATFORM',
    route: '/z',
    tags: ['Chat', 'Networking', 'React'],
  },
  
];

const Work2 = () => {
  const navigate = useNavigate();
  const projectRefs = useRef([]);
  const cursorRef = useRef(null);
  const progressRef = useRef(null);
  const sectionLabelRef = useRef(null);
  const aboutEyebrowRef = useRef(null);
  const aboutBtnRef = useRef(null);
  const aboutBottomTextRef = useRef(null);
  const aboutCircle1Ref = useRef(null);
  const aboutCircle2Ref = useRef(null);
  const aboutCircle3Ref = useRef(null);

  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    const allRefs = [
      ...projectRefs.current,
      sectionLabelRef.current,
      aboutEyebrowRef.current,
      aboutBtnRef.current,
      aboutBottomTextRef.current,
      aboutCircle1Ref.current,
      aboutCircle2Ref.current,
      aboutCircle3Ref.current,
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    allRefs.forEach((ref) => observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  // Cursor follower
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    let raf;

    const move = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.07;
      cursorY += (mouseY - cursorY) * 0.07;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return;
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (scrolled / total) * 100;
      progressRef.current.style.height = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="work2-container">
      {/* Floating Particles */}
      <div className="work2-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="work2-particle" />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="work2-progress" ref={progressRef} />

      {/* Side Text */}
      <div className="work2-side-text">Portfolio — 2024</div>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`work2-cursor ${cursorActive ? 'active' : ''}`}
      >
        <span className="work2-cursor-text">View</span>
      </div>

      {/* ===== HEADER ===== */}
      <header className="work2-header">
        <div className="work2-header-bg-text">W</div>

        <div className="work2-header-top">
          <p className="work2-header-label">Selected Projects</p>
          <div className="work2-header-meta">
            <div className="work2-header-meta-line">Available for work</div>
            <div className="work2-header-meta-line">Based worldwide</div>
          </div>
        </div>

        <div className="work2-title-wrapper">
          <h1 className="work2-title">
            <span className="work2-title-line">
              <span>Work</span>
            </span>
          </h1>
        </div>

        <div className="work2-header-bottom">
          <p className="work2-subtitle">
            A curated collection of projects spanning AI, security, IoT, and
            networking — each built with intention, precision, and a relentless
            pursuit of craft.
          </p>
          <div className="work2-scroll-indicator">
            <span>Scroll</span>
            <div className="work2-scroll-line" />
          </div>
        </div>
      </header>

      {/* ===== SECTION LABEL ===== */}
      <div className="work2-section-label" ref={sectionLabelRef}>
        <div className="work2-section-label-dot" />
        <span className="work2-section-label-text">Featured Work</span>
        <div className="work2-section-label-line" />
      </div>

      {/* ===== PROJECTS ===== */}
      <section className="work2-projects">
        {projects.map((project, index) => (
          <article
            key={project.id}
            ref={(el) => (projectRefs.current[index] = el)}
            className="work2-project"
            onClick={() => navigate(project.route)}
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            <div className="work2-project-inner">
              <span className="work2-project-number">{project.id}</span>
              <div className="work2-project-info">
                <h2 className="work2-project-title">
                  <span className="work2-project-title-text">
                    {project.title}
                  </span>
                </h2>
                <span className="work2-project-category">
                  {project.category}
                </span>
              </div>
              <div className="work2-project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="work2-project-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="work2-project-arrow">
                <svg viewBox="0 0 24 24">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ===== ABOUT CTA - MASSIVE BUTTON ===== */}
      <section className="work2-about-section">
        <div className="work2-about-bg-circle" ref={aboutCircle1Ref} />
        <div className="work2-about-bg-circle-2" ref={aboutCircle2Ref} />
        <div className="work2-about-bg-circle-3" ref={aboutCircle3Ref} />

        <div className="work2-about-content">
          <p className="work2-about-eyebrow" ref={aboutEyebrowRef}>
            Curious?
          </p>

          <button
            className="work2-about-btn"
            ref={aboutBtnRef}
            onClick={() => navigate('/about')}
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            <span className="work2-about-btn-corner tl" />
            <span className="work2-about-btn-corner tr" />
            <span className="work2-about-btn-corner bl" />
            <span className="work2-about-btn-corner br" />
            <span className="work2-about-btn-text">About Me</span>
            <span className="work2-about-btn-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>

          <p className="work2-about-bottom-text" ref={aboutBottomTextRef}>
            Get to know the mind behind the machine
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="work2-footer">
        <span className="work2-footer-left">© 2024 — All rights reserved</span>
        <div className="work2-footer-right">
          <button
            className="work2-footer-link"
            onClick={() => navigate('/about')}
          >
            About
          </button>
          <button
            className="work2-footer-link"
            onClick={() => navigate('/contact')}
          >
            Contact
          </button>
          <button
            className="work2-footer-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Work2;