import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';
import './Header.css';

export default function Header() {
  const { phase, navigateWithTransition } = useTransition();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = phase !== 'idle';

  const go = (path) => (e) => {
    e.preventDefault();
    if (location.pathname === path) return;
    navigateWithTransition(path);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="/" onClick={go('/')} className="logo-link" aria-label="Home">
        <motion.div
          layout
          transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
          className={`site-logo ${active ? 'is-active' : ''}`}
        >
          <span className="hide-overflow"><span>MOHIT</span></span>
          <span className="hide-overflow"><span>GROVER</span></span>
          <span className="hide-overflow"><span>CO.</span></span>
        </motion.div>
      </a>

      {location.pathname !== '/' && (
        <a href="/" onClick={go('/')} className="back-arrow" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>
      )}
    </header>
  );
}