// src/components/Contact/Contact.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader'; // Reuse your existing loader
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Contact form submitted:', formData);
      
      toast.success('Thank you! Your message has been sent successfully. We\'ll get back to you soon!');

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error('Oops! Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

        {isSubmitted && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We’ll get back to you within 24 hours.</p>
            </div>
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="message">
              <i className="fas fa-comment-dots"></i> Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className={errors.message ? 'error' : ''}
              placeholder="Write your message here..."
              disabled={isSubmitting}
            />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader small /> Sending Message...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Send Message
              </>
            )}
          </button>
        </form>

        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-envelope-open-text"></i>
            <div>
              <h4>Email Us</h4>
              <p>support@flexiwork.com</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <div>
              <h4>Call Us</h4>
              <p>+08035739792</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <div>
              <h4>Response Time</h4>
              <p>Within 24 hours</p>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;