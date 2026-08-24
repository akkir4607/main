import React, { useState, useRef, useEffect } from 'react';

import m2 from '../images/m2.mp4';
import m5 from '../images/m5.mp4';

import './Preloader.css';

export default function Preloader({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  const videoRef = useRef(null);
  const finishedRef = useRef(false);
  const fallbackRef = useRef(null);

  // ============================================================
  // DETECT MOBILE
  // ============================================================

  const isMobile = window.matchMedia(
    '(max-width: 768px)'
  ).matches;

  // Desktop / PC = m2.mp4
  // Mobile = m5.mp4
  const videoSource = isMobile ? m5 : m2;

  // ============================================================
  // FINISH PRELOADER
  // ============================================================

  const handleFinish = () => {
    // Prevent multiple calls
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;

    // Clear fallback timer
    if (fallbackRef.current) {
      clearTimeout(fallbackRef.current);
    }

    // Start fade-out animation
    setFadeOut(true);

    // Wait for CSS fade animation
    setTimeout(() => {
      onFinish();
    }, 600);
  };

  // ============================================================
  // VIDEO PLAYBACK
  // ============================================================

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      handleFinish();
      return;
    }

    let cancelled = false;

    const playVideo = async () => {
      try {
        await video.play();

        if (!cancelled) {
          console.log(
            `🎬 Preloader started: ${
              isMobile ? 'm5.mp4' : 'm2.mp4'
            }`
          );
        }
      } catch (error) {
        console.log(
          '🎬 Preloader autoplay blocked:',
          error
        );

        // Give browser a short moment,
        // then continue to website.
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) {
              handleFinish();
            }
          }, 500);
        }
      }
    };

    playVideo();

    // ==========================================================
    // SAFETY FALLBACK
    // ==========================================================
    //
    // Prevent the user from being trapped if the video
    // fails to load or hangs.
    //
    fallbackRef.current = setTimeout(() => {
      if (!cancelled) {
        console.log('🎬 Preloader safety fallback');
        handleFinish();
      }
    }, 15000);

    return () => {
      cancelled = true;

      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
      }
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`preloader ${
        fadeOut ? 'preloader--hidden' : ''
      }`}
    >
      <video
        ref={videoRef}
        key={videoSource}
        src={videoSource}
        className="preloader__video"

        /* Autoplay settings */
        muted
        autoPlay
        playsInline
        preload="auto"

        /* Finish when video actually ends */
        onEnded={handleFinish}

        /* If video has an error */
        onError={() => {
          console.log('🎬 Preloader video error');
          handleFinish();
        }}
      />
    </div>
  );
}