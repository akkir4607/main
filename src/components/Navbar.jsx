import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { id: '01', name: 'Preview', path: '/preview' },
  { id: '02', name: 'Project', path: '/project' },
  { id: '03', name: 'About', path: '/about' },
  { id: '04', name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activePath, setActivePath] = useState(null) // path currently animating to center
  const [leaving, setLeaving] = useState(false)

  const handleClick = (e, path) => {
    e.preventDefault()
    if (path === location.pathname) return

    setActivePath(path)   // triggers "go to middle" animation on clicked item
    setLeaving(true)       // triggers "others slide right" animation

    // wait for animation to finish, then navigate
    setTimeout(() => {
      navigate(path)
      setActivePath(null)
      setLeaving(false)
    }, 650)
  }

  return (
    <nav className={`shared-navbar${leaving ? ' is-leaving' : ''}`}>
      <div className="navbar-inner">
        <a
          href="/"
          className="nav-brand"
          onClick={(e) => handleClick(e, '/')}
        >
          <span>MOHIT</span>
          <span>GROVER</span>
        </a>

        <ul className="navbar-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const isTargeted = activePath === item.path
            return (
              <li
                key={item.id}
                className={`navbar-item${isActive ? ' is-current' : ''}${isTargeted ? ' is-centering' : ''}${
                  leaving && !isTargeted ? ' is-sliding-right' : ''
                }`}
              >
                <a href={item.path} onClick={(e) => handleClick(e, item.path)}>
                  <span className="navbar-index">{item.id}</span>
                  <span className="navbar-name">{item.name}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}