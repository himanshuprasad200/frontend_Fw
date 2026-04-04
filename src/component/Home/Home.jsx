// src/component/Home/Home.jsx
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaStar, FaArrowLeft, FaArrowRight,
  FaUsers, FaShieldAlt, FaHandshake, FaChevronLeft, FaChevronRight,
  FaQuoteLeft, FaCheckCircle, FaThLarge, FaVideo, FaPaintBrush,
  FaBullhorn, FaBolt, FaLock, FaMicrophone,
} from "react-icons/fa";
import { TbGridDots } from "react-icons/tb";
import "./Home.css";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProject } from "../../actions/projectAction.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const popularSkills = ["UI Design", "Web Dev", "Branding", "Animation", "Copywriting"];

const services = [
  {
    title: "3D ARTIST",
    tags: ["3D Modelling", "Environment Design", "VFX"],
    artists: 12,
    reviews: 980,
    img: "/service_3d_artist.png",
    color: "#8b9e7a",
  },
  {
    title: "VIDEO EXPLAINER",
    tags: ["Motion Graphics", "Whiteboard", "Animation"],
    artists: 8,
    reviews: 1240,
    img: "/service_video_explainer.png",
    color: "#c2a46a",
  },
  {
    title: "GRAPHIC DESIGN",
    tags: ["Brand Identity", "Logo Design", "Print Design"],
    artists: 20,
    reviews: 2100,
    img: "/service_graphic_design.png",
    color: "#7bb0c2",
  },
  {
    title: "DIGITAL MARKETING",
    tags: ["SEO", "Social Media", "Lead Generation"],
    artists: 15,
    reviews: 1650,
    img: "/service_digital_marketing.png",
    color: "#c27b9e",
  },
];

const whyFeatures = [
  {
    icon: <FaHandshake />,
    title: "Seamless Collaboration",
    desc: "Our user-friendly platform ensures a seamless collaborative experience. Communicate with freelancers, share files, and track project progress effortlessly.",
  },
  {
    icon: <FaUsers />,
    title: "Support and Community",
    desc: "Join a vibrant community of freelancers and clients who are passionate about their work. Our support team is available to guide you and help resolve enquiries.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure and Reliable",
    desc: "Your safety and security are our top priorities. We implement robust measures to protect your data and financial transactions.",
  },
];

const testimonials = [
  {
    text: "I recently hired a freelancer for a project, and I couldn't be happier with the results. Their skills exceeded my expectations in every way; communication was smooth, deadlines were met, and the quality was outstanding. I highly recommend this freelancer to anyone looking for top-notch skills and professionalism.",
    name: "Thomas Karlow",
    role: "CEO at Kakar",
    company: "KAKAR",
  },
  {
    text: "Working with this platform changed everything for our business. The quality of freelancers available is outstanding and the whole process was smooth from start to finish. Highly recommend to any business owner.",
    name: "Sarah Mitchell",
    role: "Founder at PixelBrand",
    company: "PIXELBRAND",
  },
  {
    text: "Exceptional service! The freelancer we hired delivered beyond our expectations. The whole experience was seamless and professional. We will definitely use this platform again.",
    name: "James Carter",
    role: "CTO at NovaTech",
    company: "NOVATECH",
  },
];

// Freelancer avatar grid (using placeholder service for diverse avatars)
const freelancerAvatars = [
  "https://i.pravatar.cc/60?img=1",
  "https://i.pravatar.cc/60?img=2",
  "https://i.pravatar.cc/60?img=3",
  "https://i.pravatar.cc/60?img=4",
  "https://i.pravatar.cc/60?img=5",
  "https://i.pravatar.cc/60?img=6",
  "https://i.pravatar.cc/60?img=7",
  "https://i.pravatar.cc/60?img=8",
  "https://i.pravatar.cc/60?img=9",
  "https://i.pravatar.cc/60?img=10",
  "https://i.pravatar.cc/60?img=11",
  "https://i.pravatar.cc/60?img=12",
  "https://i.pravatar.cc/60?img=13",
  "https://i.pravatar.cc/60?img=14",
  "https://i.pravatar.cc/60?img=15",
  "https://i.pravatar.cc/60?img=16",
  "https://i.pravatar.cc/60?img=17",
  "https://i.pravatar.cc/60?img=18",
  "https://i.pravatar.cc/60?img=19",
  "https://i.pravatar.cc/60?img=20",
];

const Home = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.projects);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [servicesStart, setServicesStart] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProject());
  }, [dispatch, error]);

  const nextTestimonial = () =>
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const visibleServices = services.slice(servicesStart, servicesStart + 4);

  return (
    <Fragment>
      <MetaData title="FlexiWork — Find Top Freelancers & Get Work Done" />

      <div className="lp-root">

        {/* ══════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════
            SECTION 1 — HERO (layered layout)
        ══════════════════════════════════════════ */}
        <section className="lp-hero">
          {/* FREELANCE — massive title, sits BEHIND the woman */}
          <h1 className="lp-hero__big-title" aria-label="Freelance">FLEXIWORK</h1>

          {/* Subject — sitting over "NCE" for depth */}
          <div className="lp-hero__woman-wrap">
            <img src="/hero_woman.png" alt="Freelancer" className="lp-hero__woman-img" />
          </div>

          {/* "Discover more" circular badge — sits in center */}
          <div className="lp-hero__discover-badge">
            <svg viewBox="0 0 100 100" className="lp-hero__badge-svg">
              <path id="circle-text" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
              <text fontSize="9.5" fill="rgba(0,0,0,0.6)" letterSpacing="2.5">
                <textPath href="#circle-text">discover more • discover more •</textPath>
              </text>
            </svg>
            <TbGridDots size={20} className="lp-hero__badge-icon" />
          </div>

          {/* Bottom content row: left info + right profile card */}
          <div className="lp-hero__bottom">
            {/* Left column */}
            <div className="lp-hero__left">
              {/* Search Bar */}
              <div className="lp-hero__search">
                <FaSearch className="lp-hero__search-icon" />
                <input type="text" placeholder="Search for any services..." />
                <FaMicrophone className="lp-hero__mic-icon" />
                <button className="lp-hero__search-btn">
                  <FaArrowRight />
                </button>
              </div>

              {/* Popular Skills */}
              <div className="lp-hero__skills">
                <span className="lp-hero__skills-label">Popular skills:</span>
                {popularSkills.map((skill, i) => (
                  <span key={i} className="lp-hero__skill-tag">{skill}</span>
                ))}
              </div>

              <p className="lp-hero__desc">
                A freelance service web portal connects businesses with<br />
                freelancers, facilitating project collaboration and hiring.
              </p>

              {/* Trusted Freelancers card */}
              <div className="lp-hero__trust">
                <div className="lp-hero__trust-header">
                  <strong>Trusted Freelancers</strong>
                  <div className="lp-hero__trust-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <div className="lp-hero__trust-row">
                  <div className="lp-hero__trust-avatars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="User" />
                    ))}
                  </div>
                  <div>
                    <strong className="lp-hero__trust-num">200+</strong>
                    <span className="lp-hero__trust-sub">Satisfied Customers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Profile info card */}
            <div className="lp-hero__right">
              <div className="lp-hero__profile-card">
                <div className="lp-hero__card-top">
                  <img src="https://i.pravatar.cc/50?img=47" alt="Jenny" className="lp-hero__card-avatar" />
                  <div>
                    <span className="lp-hero__card-handle">@jenny</span>
                    <strong className="lp-hero__card-role">Ui/Ux Designer</strong>
                  </div>
                </div>
                <div className="lp-hero__card-stats">
                  <div className="lp-hero__card-stat">
                    <span className="lp-hero__stat-icon">🏆</span>
                    <span><strong>80+</strong> projects completed</span>
                  </div>
                  <div className="lp-hero__card-stat">
                    <span className="lp-hero__stat-icon">💵</span>
                    <span><strong>$30</strong> per hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — POPULAR SERVICES
        ══════════════════════════════════════════ */}
        <section className="lp-services">
          <div className="lp-services__header">
            <div>
              <h2 className="lp-section-title">POPULAR SERVICES</h2>
              <p className="lp-section-sub">
                Freelancing offers a diverse range of popular services, from web development to content writing, catering to various clients' needs.
              </p>
            </div>
            <div className="lp-services__nav">
              <button
                onClick={() => setServicesStart(Math.max(0, servicesStart - 1))}
                disabled={servicesStart === 0}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => setServicesStart(Math.min(services.length - 4, servicesStart + 1))}
                disabled={servicesStart >= services.length - 4}
                className="lp-services__nav-active"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="lp-services__grid">
            {services.map((svc, i) => (
              <div key={i} className="lp-svc-card">
                <div className="lp-svc-card__img-wrap">
                  <img src={svc.img} alt={svc.title} />
                  <div className="lp-svc-card__overlay">
                    <h3 className="lp-svc-card__title">{svc.title}</h3>
                    <div className="lp-svc-card__tags">
                      {svc.tags.map((tag, j) => (
                        <span key={j} className="lp-svc-card__tag">{tag}</span>
                      ))}
                    </div>
                    <div className="lp-svc-card__meta">
                      <span>👤 {svc.artists} Artists</span>
                      <span>⭐ {svc.reviews} Reviews</span>
                    </div>
                  </div>
                </div>
                <div className="lp-svc-card__footer">
                  <Link to="/projects" className="lp-svc-card__btn">Explore</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — FIND OUTSTANDING WORKMANSHIP
        ══════════════════════════════════════════ */}
        <section className="lp-workmanship">
          <div className="lp-workmanship__img-wrap">
            <img src="/workmanship_banner.png" alt="Outstanding Workmanship" />
            <div className="lp-workmanship__overlay">
              <span className="lp-workmanship__tag">For Talent</span>
              <h2 className="lp-workmanship__title">
                FIND OUTSTANDING<br />WORKMANSHIP.
              </h2>
              <p className="lp-workmanship__desc">
                The outstanding workmanship displayed in the intricate craftmanship of the finest cabinet makers furniture meticulously detailed with ornate patterns and flawless finishes, is a testament to the artisan's exceptional skill and dedication to their craft.
              </p>
            </div>
            <div className="lp-workmanship__play">
              <div className="lp-workmanship__play-btn">▶</div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — WHY CHOOSE US
        ══════════════════════════════════════════ */}
        <section className="lp-why">
          <div className="lp-why__inner">
            {/* Left — Person + Guarantee stamp */}
            <div className="lp-why__left">
              <div className="lp-why__deco-burst lp-why__deco-burst--tl"></div>
              <img src="/why_choose_us_person.png" alt="Why Choose Us" className="lp-why__person" />
              <div className="lp-why__guarantee">
                <div className="lp-why__guarantee-inner">
                  <span className="lp-why__guarantee-text">GUARANTEE</span>
                </div>
              </div>
            </div>

            {/* Right — Features */}
            <div className="lp-why__right">
              <h2 className="lp-section-title centered">WHY CHOOSE US?</h2>
              <p className="lp-section-sub centered">
                Choose us for committed quality, exceptional service, and a commitment to exceeding your expectations every time.
              </p>
              <div className="lp-why__features">
                {whyFeatures.map((feat, i) => (
                  <div key={i} className={`lp-why__feature ${i === 0 ? "lp-why__feature--active" : ""}`}>
                    <div className="lp-why__feature-icon">{feat.icon}</div>
                    <div>
                      <h4>{feat.title}</h4>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — TESTIMONIALS
        ══════════════════════════════════════════ */}
        <section className="lp-testimonials">
          <div className="lp-testimonials__inner">
            <div className="lp-testimonials__left">
              <h2 className="lp-section-title lp-testimonials__title">
                WHAT OUR<br />CUSTOMERS<br />SAY
              </h2>
              <div className="lp-testimonials__nav">
                <button onClick={prevTestimonial}><FaArrowLeft /></button>
                <button onClick={nextTestimonial} className="lp-testimonials__nav-active"><FaArrowRight /></button>
              </div>
            </div>

            <div className="lp-testimonials__right">
              <div className="lp-testimonials__card">
                <FaQuoteLeft className="lp-testimonials__quote-icon" />
                <p className="lp-testimonials__text">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="lp-testimonials__author">
                  <img src={`https://i.pravatar.cc/50?img=${activeTestimonial + 20}`} alt="Reviewer" />
                  <div>
                    <strong>{testimonials[activeTestimonial].name}</strong>
                    <span>{testimonials[activeTestimonial].role}</span>
                  </div>
                  <span className="lp-testimonials__company">{testimonials[activeTestimonial].company}</span>
                </div>
              </div>
              {/* Dots */}
              <div className="lp-testimonials__dots">
                {testimonials.map((_, i) => (
                  <span
                    key={i}
                    className={`lp-testimonials__dot ${i === activeTestimonial ? "active" : ""}`}
                    onClick={() => setActiveTestimonial(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — EXPERIENCED FREELANCERS
        ══════════════════════════════════════════ */}
        <section className="lp-freelancers">
          <div className="lp-freelancers__inner">
            {/* Left — Avatar Grid */}
            <div className="lp-freelancers__avatars">
              {freelancerAvatars.map((src, i) => (
                <img key={i} src={src} alt={`Freelancer ${i + 1}`} className="lp-freelancers__avatar" />
              ))}
            </div>

            {/* Right — Text */}
            <div className="lp-freelancers__text">
              <div className="lp-freelancers__stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} style={{ color: "#f59e0b" }} />
                ))}
              </div>
              <h2 className="lp-freelancers__title">
                EXPERIENCED<br />FREELANCERS
              </h2>
              <p className="lp-freelancers__desc">
                Experienced freelancers possess a deep understanding of their trade, delivering high-quality work and client satisfaction.
              </p>
              <Link to="/projects" className="lp-freelancers__cta">Start Finding</Link>
            </div>
          </div>
          {/* Decorative burst bottom right */}
          <div className="lp-freelancers__deco"></div>
        </section>

      </div>
    </Fragment>
  );
};

export default Home;
