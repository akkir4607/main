import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Lenis from 'lenis';

import { TransitionProvider } from './context/TransitionContext';
import Header from './components/Header';
import TransitionPanel from './components/TransitionPanel';
import Preloader from './components/Preloader';

import Port from './pages/Port';
import About from './pages/About';
import Preview from './pages/Preview';
import Work from './pages/Work2';
import Sara from './pages/Sara';
import Phish from './pages/phish';
import Airguard from './pages/Airguard';
import MGShare from './pages/mgshare';
import Contact from './pages/Contact';
import Z from './pages/z';

// Background Music
import m10 from './images/m10.mp3';

// ============================================================
// SMOOTH SCROLL & ROUTE RESTORATION CONTROLLER
// ============================================================
function SmoothScrollManager() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease-out expo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6, // fluid acceleration on mobile touch
      infinite: false,
    });

    window.lenis = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Instantly scroll to top when changing routes
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

// ============================================================
// ANIMATED ROUTES
// ============================================================
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Port />} />
      <Route path="/about" element={<About />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/Work2" element={<Work />} />
      <Route path="/sara" element={<Sara />} />
      <Route path="/phish" element={<Phish />} />
      <Route path="/airguard" element={<Airguard />} />
      <Route path="/mgshare" element={<MGShare />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/z" element={<Z />} />
    </Routes>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const [loading, setLoading] = useState(true);

  const audioRef = useRef(null);
  const musicStarted = useRef(false);

  // ============================================================
  // BACKGROUND MUSIC
  // ============================================================
  const startMusic = async () => {
    if (!audioRef.current || musicStarted.current) {
      return;
    }

    try {
      audioRef.current.volume = 0.5;
      await audioRef.current.play();
      musicStarted.current = true;
      console.log('🎵 Music started');
    } catch (error) {
      console.log('🎵 Autoplay blocked:', error);
    }
  };

  useEffect(() => {
    startMusic();

    const handleInteraction = () => {
      startMusic();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // ============================================================
  // FINISH PRELOADER
  // ============================================================
  const finishLoading = () => {
    setLoading(false);
    setTimeout(() => {
      startMusic();
    }, 100);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Global CSS optimizations for smooth scrolling and mobile responsiveness */}
      <style>{`
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-scrolling iframe {
          pointer-events: none;
        }
        html, body {
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-tap-highlight-color: transparent;
        }
        .main-content {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>

      <audio
        ref={audioRef}
        src={m10}
        loop
        preload="auto"
      />

      {loading ? (
        <Preloader onFinish={finishLoading} />
      ) : (
        <Router>
          <SmoothScrollManager />
          <TransitionProvider>
            <Header />
            <TransitionPanel />
            <main className="main-content">
              <AnimatedRoutes />
            </main>
          </TransitionProvider>
        </Router>
      )}
    </>
  );
}