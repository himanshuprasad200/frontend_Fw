// src/component/Home/Home.jsx
import React, { Fragment, useEffect, useRef } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProjectCard from "./ProjectCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProject } from "../../actions/projectAction.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { toast } from "react-hot-toast";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, projects } = useSelector((state) => state.projects);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProject());
  }, [dispatch, error]);

  // GSAP Animation for Cards
  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && projects?.length > 0) {
      window.gsap.fromTo(
        ".modern-project-card",
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
        }
      );
    }
  }, [projects]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="FlexiWork — Hire Top Talent Instantly" />

          {/* MAIN WRAPPER WITH WAVY ANIMATION */}
          <div className="homepage-master">
            {/* INFINITE WAVY LIQUID BACKGROUND */}
            <div className="wavy-bg">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
            </div>

            {/* HERO SECTION - CINEMATIC, STYLISH & WIDE 2025 DESIGN */}
            <section className="hero-section">
              <div className="heros-content">
                {/* Main Headline - Elegant Cursive Style */}
                <h1 className="hero-title stylish-cursive">
                  <span className="line">Hire Expert</span>
                  <span className="line">
                    <span className="highlight cursive-highlight">
                      Freelancers
                    </span>
                  </span>
                  <span className="line">For Any Job,</span>
                  <span className="line">Online</span>
                </h1>

                {/* Subheadline - Clean & Modern */}
                <p className="hero-subtitle">
                  Millions of people use <strong>FlexiWork</strong> to turn
                  their ideas into reality.
                </p>

                {/* PREMIUM CTA — NOW FULLY VISIBLE */}
                <a href="#projects" className="cta-button premium-cta">
                  Start Freelancing Now <CgMouse className="mouse-icon" />
                </a>

                {/* Optional Trust Line */}
                <div className="trust-line">
                  <span>Trusted by 1M+ businesses worldwide</span>
                </div>
              </div>

              {/* Floating Blobs - Enhanced */}
              <div className="hero-graphic">
                <div className="floating-shape s1"></div>
                <div className="floating-shape s2"></div>
                <div className="floating-shape s3"></div>
                <div className="floating-shape s4"></div>
              </div>
            </section>

            {/* PROJECTS SECTION */}
            <section className="projects-showcase" id="projects">
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
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;