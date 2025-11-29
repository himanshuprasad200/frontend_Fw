// src/component/Home/Home.jsx
import React, { Fragment, useEffect, useRef } from "react";
import { CgMouse } from "react-icons/cg";
import {
  FaCode, FaPaintBrush, FaBullhorn, FaVideo, FaPenFancy,
  FaMusic, FaBriefcase, FaRobot, FaStar
} from "react-icons/fa";
import "./Home.css";
import ProjectCard from "./ProjectCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProject } from "../../actions/projectAction.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { toast } from "react-hot-toast";

// Import GSAP + ScrollTrigger properly
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once at the top level
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, projects } = useSelector((state) => state.projects);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProject());
  }, [dispatch, error]);

  // GSAP Scroll Animations - Now works without error
  useEffect(() => {
    // Animate sections on scroll
    sectionRefs.current.forEach((section) => {
      if (!section) return;

      gsap.fromTo(
        section.children,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
            // debug: true, // remove in production
          },
        }
      );
    });

    // Animate Project Cards
    if (projects && projects.length > 0) {
      gsap.fromTo(
        ".modern-project-card",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [projects]);

  const categories = [
    { name: "Website Development", icon: <FaCode size={50} />, color: "#8b5cf6" },
    { name: "Graphic Design", icon: <FaPaintBrush size={50} />, color: "#ec4899" },
    { name: "Digital Marketing", icon: <FaBullhorn size={50} />, color: "#f59e0b" },
    { name: "Video Editing", icon: <FaVideo size={50} />, color: "#ef4444" },
    { name: "Writing & Translation", icon: <FaPenFancy size={50} />, color: "#10b981" },
    { name: "Music & Audio", icon: <FaMusic size={50} />, color: "#06b6d4" },
    { name: "Business", icon: <FaBriefcase size={50} />, color: "#6366f1" },
    { name: "AI Services", icon: <FaRobot size={50} />, color: "#a855f7" },
  ];

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="FlexiWork — Hire Top Talent Instantly" />

          <div className="homepage-master">
            {/* Wavy Background */}
            <div className="wavy-bg">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
            </div>

            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="heros-content">
                <h1 className="hero-title stylish-cursive">
                  <span className="line">Hire Expert</span>
                  <span className="line">
                    <span className="highlight cursive-highlight">Freelancers</span>
                  </span>
                  <span className="line">For Any Job,</span>
                  <span className="line">Online</span>
                </h1>
                <p className="hero-subtitle">
                  Millions of people use <strong>FlexiWork</strong> to turn their ideas into reality.
                </p>
                <a href="#projects" className="cta-button premium-cta">
                  Start Freelancing Now <CgMouse className="mouse-icon" />
                </a>
                <div className="trust-line">
                  <span>Trusted by 1M+ businesses worldwide</span>
                </div>
              </div>

              <div className="hero-graphic">
                <div className="floating-shape s1"></div>
                <div className="floating-shape s2"></div>
                <div className="floating-shape s3"></div>
                <div className="floating-shape s4"></div>
              </div>
            </section>

            {/* 1. POPULAR SERVICES */}
            <section className="projects-showcase" id="projects" ref={(el) => (sectionRefs.current[0] = el)}>
              <div className="container">
                <div className="section-header">
                  <h2>Popular Professional Services</h2>
                  <p>Explore the marketplace</p>
                </div>
                <div className="projects-grid">
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))
                  ) : (
                    <p className="no-data">No services available yet.</p>
                  )}
                </div>
              </div>
            </section>

            {/* 2. HOW IT WORKS */}
            <section className="how-it-works-section" ref={(el) => (sectionRefs.current[1] = el)}>
              <div className="container">
                <div className="section-header">
                  <h2>How FlexiWork Works</h2>
                  <p>Get your project done in 3 simple steps</p>
                </div>
                <div className="steps-grid">
                  <div className="step-card">
                    <div className="step-number">1</div>
                    <h3>Post Your Job</h3>
                    <p>Free & fast — get proposals in minutes</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">2</div>
                    <h3>Receive Proposals</h3>
                    <p>Top talent competes for your project</p>
                  </div>
                  <div className="step-card">
                    <div className="step-number">3</div>
                    <h3>Hire & Deliver</h3>
                    <p>Secure payment only when satisfied</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. TRUSTED BY - LOGOS NOW VISIBLE */}
            <section className="trust-stats-section" ref={(el) => (sectionRefs.current[2] = el)}>
              <div className="container">
                <div className="trust-content">
                  <h2>Trusted by World-Class Companies</h2>
                  <p className="trust-subtitle">Join 1M+ users growing with FlexiWork</p>

                  <div className="stats-grid">
                    <div className="stat-item"><h3>100k+</h3><p>Users</p></div>
                    <div className="stat-item"><h3>10+</h3><p>Countries</p></div>
                    <div className="stat-item"><h3>$3M+</h3><p>Paid to Freelancers</p></div>
                    <div className="stat-item"><h3>98%</h3><p>Satisfaction</p></div>
                  </div>

                  <div className="brand-logos">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/google.svg" alt="Google" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/netflix.svg" alt="Netflix" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/samsung.svg" alt="Samsung" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/airbnb.svg" alt="Airbnb" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/paypal.svg" alt="PayPal" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazon.svg" alt="Amazon" className="brand-logo" />
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/spotify.svg" alt="Spotify" className="brand-logo" />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. CATEGORIES */}
            <section className="categories-section" ref={(el) => (sectionRefs.current[3] = el)}>
              <div className="container">
                <div className="section-header">
                  <h2>Browse Top Categories</h2>
                  <p>Find experts in 1000+ skills</p>
                </div>
                <div className="categories-grid">
                  {categories.map((cat, i) => (
                    <div key={i} className="category-card">
                      <div className="cat-icon" style={{ color: cat.color }}>
                        {cat.icon}
                      </div>
                      <h4>{cat.name}</h4>
                      <span>1,200+ services</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section className="testimonials-section" ref={(el) => (sectionRefs.current[4] = el)}>
              <div className="container">
                <h2>What Our Clients Say</h2>
                <div className="testimonials-grid">
                  {[
                    { name: "Sarah Chen", role: "CEO at TechFlow", text: "FlexiWork saved us months of hiring time." },
                    { name: "Michael Ross", role: "Marketing Director", text: "Best talent, fastest delivery, amazing results." },
                    { name: "Emma Lopez", role: "Startup Founder", text: "We scaled from 0 to 100K users using FlexiWork devs." },
                  ].map((t, i) => (
                    <div key={i} className="testimonial-card">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} style={{ color: "#fbbf24" }} />
                        ))}
                      </div>
                      <p>"{t.text}"</p>
                      <div className="author">
                        <strong>{t.name}</strong>
                        <span>{t.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. FINAL CTA */}
            <section className="final-cta-section" ref={(el) => (sectionRefs.current[5] = el)}>
              <div className="container">
                <h2>Ready to Grow Faster?</h2>
                <p>Join thousands of businesses hiring top talent today</p>
                <a href="/signup" className="cta-button premium-cta large">
                  Start Exploring Now <CgMouse />
                </a>
              </div>
            </section>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;