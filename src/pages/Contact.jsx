import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    services: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Form submitted:', formData);

    try {
      // Using Formspree - replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/myznyelz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      console.log(result);
      alert('Form submitted successfully! You will receive an email notification.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        services: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      
      <div className="contact-wrapper">
        <div className="contact-main">
          <div className="contact-header">
            <h1 className="contact-title">
              Let's <br />
              Connect
            </h1>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span className="form-number">01</span>
                What's your name?
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Your Name *"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-number">02</span>
                What's your email?
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="your@email.com *"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-number">03</span>
                What's the name of your organization?
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Organization Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-number">04</span>
                What services are you looking for?
              </label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Services needed"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="form-number">05</span>
                Your message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Your message *"
                rows="4"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="contact-sidebar">
          <img src="" alt="" />

          <div className="contact-section">
            <h3 className="section-title">Contact Details</h3>
            <div className="contact-info">
              <a href="mailto:akkir4607@gmail.com" className="contact-detail">
                akkir4607@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-section">
            <h3 className="section-title">Socials</h3>
            <div className="social-links">
              <a 
                href="https://www.linkedin.com/in/mohit-grover-99b799336/" 
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        ↓
      </div>
    </div>
  );
};

export default Contact;