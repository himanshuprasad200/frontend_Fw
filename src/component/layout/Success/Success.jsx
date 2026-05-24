import React, { Fragment } from "react";
import "./Success.css";
import MetaData from "../MetaData";
import { Link } from "react-router-dom";

const Success = () => {
  const stories = [
    {
      id: 1,
      title: "How TechVantage Scaled Their AI Team",
      category: "Software Development",
      content: "TechVantage used FlexiWork to find top-tier Python developers. Within 3 weeks, they onboarded 5 expert freelancers who helped launch their MVP.",
      author: "Robert Chen, CEO",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Sarah's Transition to High-Ticket Design",
      category: "UI/UX Design",
      content: "Starting as a student, Sarah built her portfolio on FlexiWork. Today, she works with global brands while travelling the world.",
      author: "Sarah Jenkins, Freelancer",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "A Marketplace Success: The Green Project",
      category: "Marketing",
      content: "The Green Project needed a viral campaign. They found a marketing wizard on FlexiWork and saw a 400% increase in user engagement.",
      author: "Marcus Thorne, Founder",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const metrics = [
    { label: "Projects Completed", value: "15,000+" },
    { label: "Freelancers Earning", value: "₹250M+" },
    { label: "Global Clients", value: "2,500+" },
    { label: "Success Rate", value: "99.8%" }
  ];

  return (
    <Fragment>
      <MetaData title="Success Stories — FlexiWork" />
      <div className="success-page">
        {/* Banner Section */}
        <section className="success-hero">
          <div className="hero-blur-bg"></div>
          <div className="hero-content-wrap">
            <span className="success-badge">Wall of Fame</span>
            <h1>Real People. Real Results.</h1>
            <p>FlexiWork isn't just a platform; it's where dreams turn into successful project milestones. Explore our journey through the eyes of our community.</p>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="metrics-bar">
          <div className="metrics-container">
            {metrics.map((m, i) => (
              <div key={i} className="metric-item">
                <h2 className="metric-value">{m.value}</h2>
                <p className="metric-label">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stories Grid */}
        <section className="stories-section">
          <div className="section-header-success">
            <h2>Community Success Stories</h2>
            <div className="title-underline"></div>
          </div>
          <div className="stories-grid">
            {stories.map((story) => (
              <div key={story.id} className="success-card">
                <div className="s-card-img">
                  <img src={story.img} alt={story.title} />
                  <span className="s-card-cat">{story.category}</span>
                </div>
                <div className="s-card-content">
                  <h3>{story.title}</h3>
                  <p>{story.content}</p>
                  <div className="s-card-author">
                    <div className="author-avatar">{story.author[0]}</div>
                    <span>{story.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="success-cta">
          <div className="cta-box">
            <h2>Ready to write your own story?</h2>
            <p>Join thousands of others building their future on the world's most professional freelance platform.</p>
            <div className="cta-btns">
              <Link to="/login" className="cta-btn primary">Join Now</Link>
              <Link to="/projects" className="cta-btn secondary">Explore Work</Link>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Success;
