import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useContact } from '../../hooks/useContact';
import { formatPhoneNumber } from '../../utils/formatters';
import '@/styles/pages/storefront/Contact.css';

const Contact = () => {
  const { storeSettings, isSettingsLoading, isLoading, formData, handleChange, handleSubmit } = useContact();

  return (
    <div className="contact-page fade-in">
      <div className="contact-header">
        <h1 className="contact-title pulse-element" style={{ animationDuration: '3s' }}>Get in Touch</h1>
        <p className="contact-subtitle">
          Have a question about our exquisite collection or need assistance? We're here to help you perfect your ethnic look.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          {isSettingsLoading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading contact information...</p>
            </div>
          ) : (
            <>
              <div className="info-card glass-panel hover-lift">
                <div className="info-icon-wrapper">
                  <MapPin size={28} />
                </div>
                <div className="info-details">
                  <h3>Visit {storeSettings?.settings?.storeSettings?.storeName}</h3>
                  <p>
                    {storeSettings?.settings?.contacts?.address?.street}<br />
                    {storeSettings?.settings?.contacts?.address?.city}, {storeSettings?.settings?.contacts?.address?.state} {storeSettings?.settings?.contacts?.address?.pincode}
                  </p>
                </div>
              </div>

              <div className="info-card glass-panel hover-lift">
                <div className="info-icon-wrapper">
                  <Phone size={28} />
                </div>
                <div className="info-details">
                  <h3>Call Us</h3>
                  <p>{formatPhoneNumber(storeSettings?.settings?.contacts?.phone)}<br />Mon-Sun, 10:00 AM - 10:00 PM (IST)</p>
                </div>
              </div>

              <div className="info-card glass-panel hover-lift">
                <div className="info-icon-wrapper">
                  <Mail size={28} />
                </div>
                <div className="info-details">
                  <h3>Email Us</h3>
                  <p>{storeSettings?.settings?.contacts?.email}<br />We'll respond within 24 hours.</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="contact-form-container glass-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." required></textarea>
            </div>
            
            <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={20} />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
