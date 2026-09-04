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

// New Imports based on the provided image structure
import Img2000 from '../images/2000.JPG';
import Img2002 from '../images/2002.JPG';
import Img2003 from '../images/2003.JPG';
import Img2004 from '../images/2004.JPG';
import Img2005 from '../images/2005.JPG';
import Img2006 from '../images/2006.JPG';
import Img2007 from '../images/2007.JPG';
import Img2008 from '../images/2008.JPG';
import Img2009 from '../images/2009.jpg';
import Img2010 from '../images/2010.jpg';
import Img2011 from '../images/2011.jpg';
import Img2012 from '../images/2012.jpg';
import Img2013 from '../images/2013.jpg';
import Img2014 from '../images/2014.jpg';

const About = () => {
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrollPositionRef = useRef(0);
  const sectionRef = useRef(null);

  const experiences = [
    {
      id: 1,
      title: 'Hackathon Coordinator – HackCraft 3.0',
      description:
        'Organized and coordinated HackCraft 3.0, managing event logistics and facilitating a collaborative environment.',
      fullDescription:
        'Served as the coordinator for HackCraft 3.0. Directed event logistics, managed team communications, and facilitated a dynamic environment to encourage innovative problem-solving among participants, ensuring a smooth and impactful hackathon experience.',
      year: '2025',
      category: 'LEADERSHIP',
      role: 'Coordinator',
      // 2009 is placed first so it acts as the preview image
      images: [Img2009, Img2000, Img2002, Img2003, Img2004, Img2005, Img2006, Img2007, Img2008],
    },
    {
      id: 2,
      title: "1st Place – SGT 36-Hour Hackathon",
      description:
        'Secured 1st place at Innoverse\'36, a 36-hour national-level hackathon hosted by SGT University.',
      fullDescription:
        'As part of Team Byte Wizards, secured 1st place at Innoverse\'36, a 36-hour national-level hackathon hosted by SGT University. Our project focused on IoT-driven innovation, where we designed and developed a fully functional web and Android application under tight deadlines.',
      year: '2025',
      category: 'WINNER',
      role: 'Team Lead',
      images: [Img2010, Img2011, Img2012, Img2013, Img2014],
    },
    {
      id: 3,
      title: 'SnapAR Workshop – Team Eklavya',
      description:
        'Co-organized the SnapAR workshop exploring AR creation using Snapchat Lens Studio.',
      fullDescription:
        'Co-organized and partnered as community lead for the SnapAR workshop at GITM, Gurgaon, featuring Chhavi Garg (Co-Founder, BharatXR & Arexa). The session explored AR creation using Snapchat Lens Studio, creator collaboration, monetization, and XR career pathways.',
      year: '2023',
      category: 'WORKSHOP',
      role: 'Community Lead',
      images: [Image21],
    },
    {
      id: 4,
      title: 'Organising Hackathon',
      description:
        'Led the successful organization of a major hackathon at GITM, demonstrating strong leadership, coordination, and team management skills.',
      fullDescription:
        'Hackathon Organizer Global Institute of Technology and Management Led the successful organization of a major hackathon at GITM, demonstrating strong leadership, coordination, and team management skills. Oversaw end-to-end planning, from ideation to execution, engaging participants in innovation, problem-solving, and collaboration while ensuring smooth event management.',
      year: '2024',
      category: 'LEADERSHIP',
      role: 'Organizer',
      images: [Image1, Image2, Image3],
    },
    {
      id: 5,
      title: 'Industry Visit – Honeywell India',
      description:
        'Gained firsthand exposure to advanced technological solutions and innovation-driven practices at Honeywell India.',
      fullDescription:
        'Engaged in an insightful industry visit to Honeywell India, gaining firsthand exposure to advanced technological solutions and innovation-driven practices. This experience provided a deeper understanding of industrial applications, enriched technical knowledge, and fostered meaningful professional connections for future growth in technology.',
      year: '2024',
      category: 'INDUSTRY',
      role: 'Visitor',
      images: [Image6, Image5, Image7, Image8],
    },
    {
      id: 6,
      title: 'StarkSeek x HackCraft Meet-up',
      description:
        'Organized expert sessions on UI/UX and DevOps in collaboration with StarkSeek and Microsoft Azure Community.',
      fullDescription:
        'Organized by Team Sankalp in collaboration with StarkSeek and supported by Microsoft Azure Community, this meet-up provided tech enthusiasts with expert sessions on UI/UX and DevOps, insights into the StarkSeek community, and an introduction to HackCraft 2.0, fostering learning, networking, and innovation ahead of the main hackathon.',
      year: '2021',
      category: 'COMMUNITY',
      role: 'Co-Organizer',
      images: [Image17, Image18, Image19],
    },
    {
      id: 7,
      title: 'Hackathon Organizer – HackCraft 2.0',
      description:
        'Demonstrated strong leadership by guiding teams, managing events, and driving innovation-focused initiatives.',
      fullDescription:
        'Demonstrated strong leadership by guiding teams, managing events, and driving innovation-focused initiatives. Skilled in decision-making, team coordination, problem-solving, and conflict resolution, with the ability to inspire and motivate peers toward achieving collective goals.',
      year: '2025',
      category: 'LEADERSHIP',
      role: 'Lead Organizer',
      images: [Image15, Image11, Image14, Image13, Image12],
    },
    {
      id: 8,
      title: 'Data Analytics – KPMG',
      description:
        'Gained hands-on experience with real-world data analytics projects and applied analytical skills.',
      fullDescription:
        'Completed a virtual internship in Data Analytics at KPMG, gaining hands-on experience with real-world projects and applying analytical skills to derive meaningful insights. Collaborated with industry professionals, enhanced technical expertise, and acquired practical knowledge in data-driven decision-making.',
      year: '2023',
      category: 'INTERNSHIP',
      role: 'Intern',
      images: [Image16],
    },
  ];

  const openModal = (experience) => {
    scrollPositionRef.current = window.scrollY;
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
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
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

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
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

      {/* ====== EXPERIENCE SECTION ====== */}
      <section
        className="xp-section"
        ref={sectionRef}
        onMouseMove={handleMouseMove}
      >
        {/* Animated gradient orbs */}
        <div className="xp-orb xp-orb-1"></div>
        <div className="xp-orb xp-orb-2"></div>
        <div className="xp-orb xp-orb-3"></div>

        {/* Grid overlay */}
        <div className="xp-grid-bg"></div>

        {/* Cursor glow */}
        <div
          className="xp-cursor-glow"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
        ></div>

        <div className="xp-container">
          {/* Header */}
          <div className="xp-header">
            <div className="xp-header-line">
              <span className="xp-line-dot"></span>
              <span className="xp-header-tag">SELECTED WORK · 2021 — 2025</span>
              <span className="xp-line-dot"></span>
            </div>

            <h2 className="xp-title">
              <span className="xp-title-word" data-text="Experience">
                Experience
              </span>
            </h2>

            <p className="xp-subtitle">
              A curated journey through hackathons, internships, and
              community-driven initiatives.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="xp-cards">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`xp-card ${activeIndex === index ? 'xp-card-active' : ''}`}
                onClick={() => openModal(exp)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="xp-card-inner">
                  {/* Image side */}
                  <div className="xp-card-media">
                    <img
                      src={exp.images[0]}
                      alt={exp.title}
                      className="xp-card-img"
                      loading="lazy"
                    />
                    <div className="xp-card-media-overlay"></div>
                    <div className="xp-card-count">
                      <span>{exp.images.length}</span>
                      <span className="xp-count-label">
                        {exp.images.length > 1 ? 'PHOTOS' : 'PHOTO'}
                      </span>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="xp-card-content">
                    <div className="xp-card-top">
                      <span className="xp-card-num">
                        {String(exp.id).padStart(2, '0')}
                      </span>
                      <span className="xp-card-category">{exp.category}</span>
                    </div>

                    <h3 className="xp-card-title">{exp.title}</h3>
                    <p className="xp-card-desc">{exp.description}</p>

                    <div className="xp-card-bottom">
                      <div className="xp-card-meta">
                        <span className="xp-card-year">{exp.year}</span>
                        <span className="xp-card-dot">·</span>
                        <span className="xp-card-role">{exp.role}</span>
                      </div>
                      <div className="xp-card-arrow">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M13 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover border glow */}
                  <div className="xp-card-glow"></div>
                </div>
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

      {/* ====== MODAL ====== */}
      {isModalOpen && selectedExperience && (
        <div
          className="xp-modal-overlay"
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          <div className="xp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="xp-modal-close"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
              }}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="xp-modal-media">
              {selectedExperience.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="xp-modal-nav xp-modal-prev"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevImage();
                    }}
                    aria-label="Previous"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="xp-modal-nav xp-modal-next"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }}
                    aria-label="Next"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </>
              )}

              <img
                key={currentImageIndex}
                src={selectedExperience.images[currentImageIndex]}
                alt={`${selectedExperience.title} ${currentImageIndex + 1}`}
                className="xp-modal-img"
              />

              {selectedExperience.images.length > 1 && (
                <div className="xp-modal-counter">
                  {String(currentImageIndex + 1).padStart(2, '0')} /{' '}
                  {String(selectedExperience.images.length).padStart(2, '0')}
                </div>
              )}
            </div>

            <div className="xp-modal-body">
              <div className="xp-modal-tags">
                <span className="xp-modal-tag">{selectedExperience.category}</span>
                <span className="xp-modal-tag xp-modal-tag-alt">
                  {selectedExperience.year}
                </span>
                <span className="xp-modal-tag xp-modal-tag-alt">
                  {selectedExperience.role}
                </span>
              </div>

              <h3 className="xp-modal-title">{selectedExperience.title}</h3>

              <p className="xp-modal-desc">
                {selectedExperience.fullDescription}
              </p>

              {selectedExperience.images.length > 1 && (
                <div className="xp-modal-dots">
                  {selectedExperience.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`xp-modal-dot ${i === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        goToImage(i);
                      }}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default About;