// pages/AboutReveal.jsx
import React, { useState, useRef, useEffect } from 'react'
import bgVideo from '../images/1003.mp4' // Make sure this path is correct for your project
import './AboutReveal.css'

export default function AboutReveal() {
  // State tracks which sections are independently revealed
  const [revealed, setRevealed] = useState({
    intro: false,
    work: false,
    location: false,
    social: false,
  })

  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  // Toggles the specific span associated with the clicked pill
  const handleReveal = (section) => {
    setRevealed((prev) => ({ ...prev, [section]: true }))
  }

  // Pill Component
  const Pill = ({ label, section, href }) => {
    const isRevealed = revealed[section]
    const cls = [
      'pill',
      !isRevealed ? 'is-trigger' : 'is-done'
    ].join(' ')

    if (href && isRevealed) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {label}
        </a>
      )
    }

    return (
      <button
        className={cls}
        onClick={() => !isRevealed && handleReveal(section)}
        disabled={isRevealed}
        type="button"
      >
        {label}
      </button>
    )
  }

  return (
    <section className="about-reveal">
      {/* Background video */}
      <div className="ar-bg-wrapper">
        <video
          ref={videoRef}
          className="ar-bg-video"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="ar-bg-overlay" />
      </div>

      {/* Interactive Content */}
      <div className="ar-content">
        
        {/* ── INTRO ── */}
        <span className="ar-block">
          <span className="ar-clear-anchor">
            Hey! I'm <Pill label="MOHIT" section="intro" />
          </span>
          <span className={`ar-chunk ${revealed.intro ? 'is-revealed' : 'is-blurred'}`}>
            {' '}I started coding when I was 15, and honestly, I haven't looked back since. My passion lies in figuring out how things work under the hood and building them back up.{' '}
          </span>
        </span>

        {/* ── WORK & TECH ── */}
        <span className="ar-block">
          <span className="ar-clear-anchor">
            I build software with <Pill label="AI & WEB" section="work" />
          </span>
          <span className={`ar-chunk ${revealed.work ? 'is-revealed' : 'is-blurred'}`}>
            , turning data into real-world products. I wear many different hats. But my main focus is building intelligent applications, crafting modern user experiences, and solving problems with Python, Machine Learning, React, and Databases. Along the way, I've created AI Projects, Cybersecurity tools, and Full-stack applications.{' '}
          </span>
        </span>

        {/* ── LOCATION ── */}
        <span className="ar-block">
          <span className="ar-clear-anchor">
            I live in <Pill label="HARYANA" section="location" />
          </span>
          <span className={`ar-chunk ${revealed.location ? 'is-revealed' : 'is-blurred'}`}>
            , India. I am currently pursuing AI & Data Science and spend most of my time learning, coding, and turning ambitious ideas into reality.{' '}
          </span>
        </span>

        {/* ── SOCIALS ── */}
        <span className="ar-block">
          <span className="ar-clear-anchor">
            You can find me on <Pill label="Linkedin" section="social" href="https://www.linkedin.com/in/mohit-grover-99b799336/" />
          </span>
          <span className={`ar-chunk ${revealed.social ? 'is-revealed' : 'is-blurred'}`}>
            {' '}where I continue exploring new technologies, sharing open-source code, and building products that aim to make an impact.
          </span>
        </span>
        
      </div>
    </section>
  )
}