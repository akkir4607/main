import React, { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

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
import MGShare from './pages/MGShare';
import Contact from './pages/Contact';

// Background Music
import m10 from './images/m10.mp3';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Port />} />
      <Route path="/about" element={<About />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/projects" element={<Work />} />
      <Route path="/sara" element={<Sara />} />
      <Route path="/phish" element={<Phish />} />
      <Route path="/airguard" element={<Airguard />} />
      <Route path="/mgshare" element={<MGShare />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

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

  // ============================================================
  // START MUSIC
  // ============================================================

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