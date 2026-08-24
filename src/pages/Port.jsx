// pages/Port.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import m3 from '../images/m3.mp4'
import './Port.css'

const projects = [
  { id: '01', year: '', name: 'Preview', url: '/preview' },
  { id: '02', year: '', name: 'Project', url: '/projects' },
  { id: '03', year: '', name: 'About', url: '/about' },
  { id: '04', year: '', name: 'Get in touch', url: '/contact' },
]

export default function Portfolio() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mounted, setMounted] = useState(false)
  const listRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by the browser.
      })
    }
  }, [])

  const pageVariants = {
    initial: {
      x: '-100%',
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      className={`portfolio${mounted ? ' is-mounted' : ''}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background Video */}
      <div className="bg-video-wrapper">
        <video
          ref={videoRef}
          className="bg-video"
          src={m3}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="bg-video-overlay" />
      </div>

      {/* Mobile Header */}
      <header className="mobile-header">
        <Link to="/" className="mobile-logo">
          <span></span>
          <span></span>
        </Link>
      </header>

      {/* Main */}
      <main className="stage" ref={listRef}>
        <ul
          className={`projects-list${
            hoveredIndex !== null ? ' has-hover' : ''
          }`}
        >
          {projects.map((project, i) => {
            const isInternal = project.url.startsWith('/')

            const linkContent = (
              <>
                <span className="project-meta">
                  <span className="project-year">{project.year}</span>
                  <span className="project-slash">/</span>
                </span>

                <span className="project-name">
                  {project.name}
                </span>
              </>
            )

            return (
              <li
                key={project.id}
                className={`project-item${
                  hoveredIndex === i ? ' is-hovered' : ''
                }`}
                style={{ '--i': i }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isInternal ? (
                  <Link
                    to={project.url}
                    className="project-link"
                  >
                    {linkContent}
                  </Link>
                ) : (
                  <a
                    href={project.url}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkContent}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-col footer-logo">
          <Link to="/" className="logo-block">
            <span></span>
            <span></span>
            <span></span>
          </Link>

          <div className="footer-meta">
            <div>
              <p>Check it out</p>
            </div>

            <div>
              <p>Portland of</p>

              <a
                href="mailto:akkir4607@gmail.com"
                className="footer-email"
              >
                akkir4607@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}