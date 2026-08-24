import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

import Image1 from '../images/100.jpeg';
import Image2 from '../images/101.jpeg';
import Image3 from '../images/102.jpeg';
import Image5 from '../images/103.jpeg';
import Image6 from '../images/104.jpeg';
import Image7 from '../images/105.jpeg';
import Image8 from '../images/106.jpeg';
import Image9 from '../images/110.jpeg';
import Image10 from '../images/111.jpeg';
import Image11 from '../images/112.jpeg';
import Image12 from '../images/113.jpeg';
import Image13 from '../images/114.jpeg';
import Image14 from '../images/115.jpeg';
import Image15 from '../images/117.jpeg';
import Image16 from '../images/118.jpeg';
import Image17 from '../images/124.jpg';
import Image18 from '../images/125.jpg';
import Image19 from '../images/126.jpeg';
import Image21 from '../images/1000.jpg';

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const scrollPositionRef = useRef(0);

  const experiences = [
    {
      id: 1,
      title: 'Organising Hackathon',
      description:
        'Led the successful organization of a major hackathon at GITM, demonstrating strong leadership, coordination, and team management skills.',
      fullDescription:
        'Hackathon Organizer Global Institute of Technology and Management Led the successful organization of a major hackathon at GITM, demonstrating strong leadership, coordination, and team management skills. Oversaw end-to-end planning, from ideation to execution, engaging participants in innovation, problem-solving, and collaboration while ensuring smooth event management.',
      year: '2024',
      rarity: 'EPIC',
      xp: '+850',
      images: [Image1, Image2, Image3],
    },
    {
      id: 2,
      title: 'Industry Visit – Honeywell India',
      description:
        'Gained firsthand exposure to advanced technological solutions and innovation-driven practices at Honeywell India.',
      fullDescription:
        'Engaged in an insightful industry visit to Honeywell India, gaining firsthand exposure to advanced technological solutions and innovation-driven practices. This experience provided a deeper understanding of industrial applications, enriched technical knowledge, and fostered meaningful professional connections for future growth in technology.',
      year: '2024',
      rarity: 'RARE',
      xp: '+620',
      images: [Image6, Image5, Image7, Image8],
    },
    {
      id: 3,
      title: 'StarkSeek x HackCraft Pre-Hackathon Meet-up',
      description:
        'Organized expert sessions on UI/UX and DevOps in collaboration with StarkSeek and Microsoft Azure Community.',
      fullDescription:
        'Organized by Team Sankalp in collaboration with StarkSeek and supported by Microsoft Azure Community, this meet-up provided tech enthusiasts with expert sessions on UI/UX and DevOps, insights into the StarkSeek community, and an introduction to HackCraft 2.0, fostering learning, networking, and innovation ahead of the main hackathon.',
      year: '2021',
      rarity: 'RARE',
      xp: '+540',
      images: [Image17, Image18, Image19],
    },
    {
      id: 4,
      title: "1st Place – Innoverse'36 Hackathon",
      description:
        'Secured 1st place at Innoverse\'36, a 36-hour national-level hackathon hosted by SGT University.',
      fullDescription:
        'As part of Team Byte Wizards, secured 1st place at Innoverse\'36, a 36-hour national-level hackathon hosted by SGT University. Our project focused on IoT-driven innovation, where we designed and developed a fully functional web and Android application under tight deadlines.',
      year: '2025',
      rarity: 'LEGENDARY',
      xp: '+1500',
      images: [Image9, Image10],
    },
    {
      id: 5,
      title: 'Hackathon Organizer – HackCraft 2.0',
      description:
        'Demonstrated strong leadership by guiding teams, managing events, and driving innovation-focused initiatives.',
      fullDescription:
        'Demonstrated strong leadership by guiding teams, managing events, and driving innovation-focused initiatives. Skilled in decision-making, team coordination, problem-solving, and conflict resolution, with the ability to inspire and motivate peers toward achieving collective goals.',
      year: '2025',
      rarity: 'EPIC',
      xp: '+1200',
      images: [Image15, Image11, Image14, Image13, Image12],
    },
    {
      id: 6,
      title: 'Data Analytics Internship – KPMG',
      description:
        'Gained hands-on experience with real-world data analytics projects and applied analytical skills.',
      fullDescription:
        'Completed a virtual internship in Data Analytics at KPMG, gaining hands-on experience with real-world projects and applying analytical skills to derive meaningful insights. Collaborated with industry professionals, enhanced technical expertise, and acquired practical knowledge in data-driven decision-making.',
      year: '2023',
      rarity: 'RARE',
      xp: '+900',
      images: [Image16],
    },
    {
      id: 7,
      title: 'SnapAR Workshop – Team Eklavya',
      description:
        'Co-organized the SnapAR workshop exploring AR creation using Snapchat Lens Studio.',
      fullDescription:
        'Co-organized and partnered as community lead for the SnapAR workshop at GITM, Gurgaon, featuring Chhavi Garg (Co-Founder, BharatXR & Arexa). The session explored AR creation using Snapchat Lens Studio, creator collaboration, monetization, and XR career pathways.',
      year: '2023',
      rarity: 'UNCOMMON',
      xp: '+780',
      images: [Image21],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (experience) => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;

    // Lock body in place at current scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    setSelectedExperience(experience);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Unlock body
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    // Restore scroll position instantly
    window.scrollTo(0, scrollPositionRef.current);

    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  const nextImage = () => {
    if (selectedExperience) {
      setCurrentImageIndex((prev) =>
        prev === selectedExperience.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedExperience) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedExperience.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => setCurrentImageIndex(index);

  const handleContactClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate('/contact'), 400);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'LEGENDARY': return '#ffaa00';
      case 'EPIC': return '#b344f0';
      case 'RARE': return '#3baaff';
      case 'UNCOMMON': return '#55cc44';
      default: return '#aaaaaa';
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    if (isModalOpen) window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, selectedExperience]);

  // Cleanup on unmount to ensure body isn't stuck locked
  useEffect(() => {
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* ====== ABOUT SECTION ====== */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-header">
            <span className="kpr-text">HEY</span>
            <h1 className="about-title">
              At the age of 15, Mohit came in touch with coding. Start doing
              code with HTML and CSS, and gradually advanced to professional
              skills in DBMS, AI/ML, Python, React, and RUST...
            </h1>
            <div className="compass-icon">
              <div className="compass-star">✦</div>
            </div>
          </div>
          <div className="center-cross">
            <div className="cross-vertical"></div>
            <div className="cross-horizontal"></div>
          </div>
        </div>
      </section>

      {/* ====== EXPERIENCE SECTION — MINECRAFT ====== */}
      <section className="mc-experience-section">
        <div className="mc-dirt-top"></div>
        <div className="mc-floating-blocks">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`mc-float-block mc-fb-${i + 1}`}></div>
          ))}
        </div>

        <div className="mc-torch mc-torch-left">
          <div className="mc-torch-flame"></div>
          <div className="mc-torch-stick"></div>
        </div>
        <div className="mc-torch mc-torch-right">
          <div className="mc-torch-flame"></div>
          <div className="mc-torch-stick"></div>
        </div>

        <div className="mc-container">
          {/* Header */}
          <div className="mc-header">
            <div className="mc-header-bar">
              <span className="mc-header-icon">⛏</span>
              <span className="mc-header-subtitle">ADVENTURE LOG</span>
              <span className="mc-header-icon">⚔</span>
            </div>
            <h2 className="mc-title" data-text="Experience">
              Experience
            </h2>
            <div className="mc-xp-bar-wrapper">
              <div className="mc-xp-bar">
                <div className="mc-xp-fill"></div>
              </div>
              <span className="mc-xp-text">Level 42</span>
            </div>
            <div className="mc-hearts">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="mc-heart">❤</span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="mc-grid">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`mc-item ${hoveredItem === exp.id ? 'mc-item-hovered' : ''}`}
                onClick={() => openModal(exp)}
                onMouseEnter={() => setHoveredItem(exp.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="mc-item-slot">
                  <span className="mc-item-num">{exp.id.toString().padStart(2, '0')}</span>
                  <div
                    className="mc-rarity-stripe"
                    style={{ background: getRarityColor(exp.rarity) }}
                  ></div>
                </div>
                <div className="mc-item-info">
                  <div className="mc-item-top-row">
                    <span
                      className="mc-rarity-badge"
                      style={{ color: getRarityColor(exp.rarity), borderColor: getRarityColor(exp.rarity) }}
                    >
                      {exp.rarity}
                    </span>
                    <span className="mc-item-xp">{exp.xp} XP</span>
                  </div>
                  <h3 className="mc-item-title">{exp.title}</h3>
                  <p className="mc-item-desc">{exp.description}</p>
                  <span className="mc-item-year">⏳ {exp.year}</span>
                </div>
                <div className="mc-item-arrow">▶</div>

                {hoveredItem === exp.id && (
                  <div className="mc-tooltip">
                    <div className="mc-tooltip-title">{exp.title}</div>
                    <div className="mc-tooltip-rarity" style={{ color: getRarityColor(exp.rarity) }}>
                      {exp.rarity}
                    </div>
                    <div className="mc-tooltip-line">Click to view gallery</div>
                    <div className="mc-tooltip-xp">{exp.xp} XP</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* GET IN TOUCH */}
        <div
          className="next-project-wrapper"
          onClick={handleContactClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleContactClick();
          }}
        >
          <div className="next-project-content">
            <p className="next-project-label">next project</p>
            <div className="next-project-title">
              <span className="word-studio">Get In</span>
              <span className="word-mega">Touch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== MODAL — MINECRAFT STYLE ====== */}
      {isModalOpen && selectedExperience && (
        <div
          className="mc-modal-overlay"
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          <div
            className="mc-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="mc-modal-titlebar">
              <span className="mc-modal-titlebar-text">{selectedExperience.title}</span>
              <button
                type="button"
                className="mc-modal-close-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeModal();
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="mc-modal-body">
              <div className="mc-modal-img-wrap">
                {selectedExperience.images.length > 1 && (
                  <button
                    type="button"
                    className="mc-modal-nav mc-nav-prev"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    ◀
                  </button>
                )}
                <img
                  src={selectedExperience.images[currentImageIndex]}
                  alt={`${selectedExperience.title} ${currentImageIndex + 1}`}
                  className="mc-modal-img"
                />
                {selectedExperience.images.length > 1 && (
                  <button
                    type="button"
                    className="mc-modal-nav mc-nav-next"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    ▶
                  </button>
                )}
              </div>

              {selectedExperience.images.length > 1 && (
                <div className="mc-modal-dots">
                  {selectedExperience.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`mc-modal-dot ${i === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        goToImage(i);
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="mc-modal-meta">
                <span
                  className="mc-modal-rarity"
                  style={{ color: getRarityColor(selectedExperience.rarity) }}
                >
                  ◆ {selectedExperience.rarity}
                </span>
                <span className="mc-modal-year">⏳ {selectedExperience.year}</span>
                <span className="mc-modal-xp">{selectedExperience.xp} XP</span>
              </div>

              <p className="mc-modal-description">{selectedExperience.fullDescription}</p>

              <div className="mc-modal-counter">
                {currentImageIndex + 1} / {selectedExperience.images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default About;