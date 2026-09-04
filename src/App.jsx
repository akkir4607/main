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
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: false, // Ensures native responsive scrolling on mobile touch screens
    });

    window.lenis = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Recalculate height on window resize (e.g. mobile URL bar collapsing)
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Scroll to top and refresh dimensions when navigating to a new route
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
      // Allow dynamic route components to mount before measuring page height
      setTimeout(() => {
        window.lenis?.resize();
      }, 100);
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
      window.lenis?.resize();
    }, 100);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
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