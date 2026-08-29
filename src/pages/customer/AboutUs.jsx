import React, { useState, useEffect } from 'react';
import { useGetAllWorksQuery } from '../../api/aboutUsApi';
import { Loader } from 'lucide-react';
import '@/styles/pages/customer/AboutUs.css';

const AboutUs = () => {
  const { data: works = [], isLoading } = useGetAllWorksQuery();

  if (isLoading) {
    return (
      <div className="about-us-page flex-center" style={{ minHeight: '60vh' }}>
        <Loader className="spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  const mainWorks = works.filter(w => w.type === 'MAIN');
  const pastWorks = works.filter(w => w.type === 'PAST');
  const presentWorks = works.filter(w => w.type === 'PRESENT');
  const futureWorks = works.filter(w => w.type === 'FUTURE');

  return (
    <div className="about-us-page">
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Discover our journey, what we do today, and our vision for the future.</p>
      </div>

      <div className="about-content-wrapper">
        {mainWorks.length > 0 && (
          <section className="about-section fade-in">
            {mainWorks.map(work => (
              <div key={work.id} className="about-main-card">
                {work.imageUrl && <div className="about-main-image" style={{ backgroundImage: `url(${work.imageUrl})` }} />}
                <div className="about-main-text">
                  <h2>{work.title}</h2>
                  <p>{work.content}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {(pastWorks.length > 0 || presentWorks.length > 0 || futureWorks.length > 0) && (
          <div className="timeline-container">
            {pastWorks.length > 0 && (
              <div className="timeline-section">
                <h3 className="timeline-heading">Our Past</h3>
                <div className="timeline-grid">
                  {pastWorks.map(work => <WorkCard key={work.id} work={work} />)}
                </div>
              </div>
            )}

            {presentWorks.length > 0 && (
              <div className="timeline-section">
                <h3 className="timeline-heading">What We Do Now</h3>
                <div className="timeline-grid">
                  {presentWorks.map(work => <WorkCard key={work.id} work={work} />)}
                </div>
              </div>
            )}

            {futureWorks.length > 0 && (
              <div className="timeline-section">
                <h3 className="timeline-heading">Future Vision</h3>
                <div className="timeline-grid">
                  {futureWorks.map(work => <WorkCard key={work.id} work={work} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {works.length === 0 && (
          <div className="empty-about">
            <h2>Welcome to our store</h2>
            <p>We are currently updating our about us page. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkCard = ({ work }) => (
  <div className="timeline-card fade-in">
    {work.imageUrl && <div className="timeline-card-image" style={{ backgroundImage: `url(${work.imageUrl})` }} />}
    <div className="timeline-card-content">
      <h4>{work.title}</h4>
      <p>{work.content}</p>
    </div>
  </div>
);

export default AboutUs;
