import React, { memo } from 'react';
import './Portfolio.css';
import bg160 from '../images/161.png';
import TextPressure from './TextPressure';
import Navbar from '../components/Navbar';
import Work from './Work';
import Mkg from './Mkg'
import Projectx from './Projectx';
const Portfolio = () => {
  return (
    <div className="main-wrapper">
      {/* Add Navbar */}
      <Navbar />

      {/* ===== Portfolio Section ===== */}
      <section className="portfolio-container" id="portfolio">
        {/* Desktop Background Text */}
        <div className="background-text desktop-text">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`desktop-${i}`} style={{ position: 'relative', height: '35%', width: '100%' }}>
              <TextPressure
                text="MOHITGROVER"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ed642e"
                minFontSize={40}
              />
            </div>
          ))}
        </div>

        {/* Mobile Scrolling Text */}
        <div className="background-text mobile-text">
          {Array.from({ length: 13 }).map((_, i) => (
            <div
              key={`mobile-${i}`}
              className="text-line"
              style={{
                whiteSpace: 'nowrap',
                fontSize: '12vw',
                display: 'flex',
                animation: `scroll${i % 2 === 0 ? 'Left' : 'Right'} 25s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                willChange: 'transform',
              }}
            >
              <span>
                MOHIT GROVER&nbsp;MOHIT GROVER&nbsp;MOHIT GROVER&nbsp;MOHIT GROVER&nbsp;MOHIT GROVER&nbsp;MOHIT GROVER
              </span>
            </div>
          ))}
        </div>

        {/* Background Image Overlay */}
        <img 
          src={bg160} 
          alt="Mohit Grover" 
          className="bg-overlay"
          loading="lazy"
        />

        {/* Inline Keyframes */}
        <style>
          {`
            @keyframes scrollLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scrollRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }

            .portfolio-container {
              position: relative;
              width: 100%;
              min-height: 100vh;
              overflow: hidden;
              scroll-snap-align: start;
            }

            .background-text {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            }

            .mobile-text {
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }

            @media (min-width: 769px) {
              .mobile-text { display: none !important; }
              .desktop-text { display: flex; flex-direction: column; }
            }

            @media (max-width: 768px) {
              .desktop-text { display: none !important; }
            }

            .main-wrapper {
              width: 100%;
              overflow-x: hidden;
              scroll-snap-type: y mandatory;
            }
          `}
        </style>
      </section>

      {/* ===== Work Section ===== */}
      <section id="work" className="work-section">
        <Work />
        <Mkg/>
        <Projectx/>
      </section>
    </div>
  );
};

export default memo(Portfolio);
