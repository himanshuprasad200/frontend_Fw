import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "../../../utils/CustomToast";
import { FaSearch, FaQuestionCircle, FaUser, FaDollarSign, FaShieldAlt, FaHeadset, FaArrowRight, FaExclamationTriangle, FaTools, FaClock } from "react-icons/fa";
import "./HelpCentre.css";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "How do I create an account on FlexiWork?", a: "Click 'Sign Up' in the top right, choose Freelancer or Client, and fill in your details. Verification takes less than 2 minutes!" },
      { q: "How do I post a job?", a: "Go to 'Post a Job', describe your project, set budget & timeline, and publish. Freelancers will bid instantly." },
      { q: "How do I find freelance work?", a: "Browse 'Find Projects' or set up job alerts. Submit tailored proposals to win jobs." },
    ]
  },
  {
    category: "Payments & Earnings",
    questions: [
      { q: "How do payments work?", a: "Clients fund milestones. You complete work → client releases payment. Funds appear in your wallet instantly." },
      { q: "When do I get paid?", a: "Payments are released upon milestone approval. Withdraw to bank/PayPal anytime (processed in 1-3 days)." },
      { q: "What are the fees?", a: "FlexiWork charges 10% service fee on earnings. No hidden costs." },
    ]
  },
  {
    category: "Account & Security",
    questions: [
      { q: "How do I verify my account?", a: "Upload ID in Settings → Verification. Verified accounts win 4x more jobs!" },
      { q: "Is my data safe?", a: "Yes! We use bank-level encryption and never share your info." },
      { q: "How do I update my profile?", a: "Go to Profile → Edit. Add skills, portfolio, and rates to attract better clients." },
    ]
  },
  {
    category: "Disputes & Late Responses",
    questions: [
      { q: "What if a client is late approving my milestone or response?", a: "Milestones auto-release after 14 days if no action. For bids/proposals, contact support if no response in 7 days. We mediate all disputes fairly." },
      { q: "My freelancer/client is not responding. What should I do?", a: "Send a reminder message first. If no reply in 48 hours, open a dispute in the project dashboard. Our team will intervene and protect your funds/time." },
      { q: "How do I resolve a dispute?", a: "Go to the project → 'Open Dispute'. Provide evidence. Our team reviews within 48 hours and decides fairly (refund, partial payment, or extension)." },
    ]
  },
  {
    category: "Troubleshooting & Technical Issues",
    questions: [
      { q: "The website is down or not responding. What should I do?", a: "First, try clearing cache, using incognito mode, or a different browser/device. Check our status page at status.flexiwork.com for any outages. If it's just you, contact support." },
      { q: "I'm getting errors loading pages or submitting bids.", a: "This is usually temporary. Refresh the page, check your internet, or disable VPN/ad-blockers. If persistent, clear browser cache or try our mobile app." },
      { q: "My notifications/emails are not coming through.", a: "Check spam/junk folder. Go to Settings → Notifications and ensure they're enabled. Still issues? Contact support with screenshots." },
    ]
  },
];

const HelpCenter = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  // Support Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveIndex(null);
  }, [searchQuery]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const openSupportModal = (subject) => {
    setModalSubject(subject);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      message: "",
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/v1/support/new", {
        name: formData.name,
        email: formData.email,
        subject: modalSubject,
        message: formData.message,
        userId: user?._id,
      });

      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs
    .map((section) => {
      const filteredQuestions = section.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...section,
        questions: filteredQuestions,
      };
    })
    .filter((section) => section.questions.length > 0);

  return (
    <div className="help-center-page">
      <div className="help-hero">
        <div className="hero-content">
          <h1>How can we help you?</h1>
          <p>Find answers instantly or contact our support team</p>
          
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for articles, questions, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isAuthenticated && (
            <div className="track-queries-cta-hero">
              <Link to="/support/me" className="track-link-hero">
                <FaClock /> View & Track Your Submitted Queries
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="help-content">
        {/* Popular Categories */}
        <div className="categories-grid">
          <div className="category-cardd">
            <FaQuestionCircle className="category-icon" />
            <h3>Getting Started</h3>
            <p>Account setup, posting jobs, finding work</p>
            <a href="#getting-started">Explore →</a>
          </div>
          <div className="category-cardd">
            <FaDollarSign className="category-icon payments" />
            <h3>Payments</h3>
            <p>Earnings, withdrawals, fees & invoices</p>
            <button onClick={() => openSupportModal("Payments & Earnings Support")} className="explore-btn">
              Explore →
            </button>
          </div>
          <div className="category-cardd">
            <FaExclamationTriangle className="category-icon disputes" />
            <h3>Disputes & Issues</h3>
            <p>Late responses, approvals, disputes</p>
            <button onClick={() => openSupportModal("Disputes & Late Responses Support")} className="explore-btn">
              Explore →
            </button>
          </div>
          <div className="category-cardd">
            <FaTools className="category-icon troubleshooting" />
            <h3>Troubleshooting</h3>
            <p>Website down, errors, technical help</p>
            <a href="#troubleshooting-technical-issues">Explore →</a>
          </div>
          <div className="category-cardd">
            <FaUser className="category-icon" />
            <h3>Profile & Skills</h3>
            <p>Building your profile, verification</p>
            <a href="#account-security">Explore →</a>
          </div>
          <div className="category-cardd">
            <FaShieldAlt className="category-icon" />
            <h3>Safety & Security</h3>
            <p>Trust, disputes, best practices</p>
            <a href="#account-security">Explore →</a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="faq-sections">
          <h2>Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((section, secIdx) => (
              <div key={secIdx} id={section.category.toLowerCase().replace(/ & | /g, "-")} className="faq-category">
                <h3>{section.category}</h3>
                <div className="faq-list">
                  {section.questions.map((faq, idx) => {
                    const globalIdx = `${secIdx}-${idx}`;
                    return (
                      <div key={globalIdx} className={`faq-item ${activeIndex === globalIdx ? "active" : ""}`}>
                        <div className="faq-question" onClick={() => toggleFAQ(globalIdx)}>
                          <span>{faq.q}</span>
                          <FaArrowRight className="arrow" />
                        </div>
                        <div className="faq-answer">
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="no-faqs-found">
              <p>No questions found matching your search. Please try a different query or contact our support team below.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="contact-support">
          <FaHeadset className="support-icon" />
          <div>
            <h3>Still need help?</h3>
            <p>Our support team is available 24/7 • Average response time: &lt;2 hours</p>
            <a href="/contact" className="contact-btn">Contact Support</a>
          </div>
        </div>
      </div>

      {/* Support Query Modal */}
      {isModalOpen && (
        <div className="support-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="support-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Support Query</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-subheader">
              <p>Topic: <strong className="subject-highlight">{modalSubject}</strong></p>
            </div>
            <form onSubmit={handleModalSubmit} className="support-modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting || isAuthenticated}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting || isAuthenticated}
                />
              </div>
              <div className="form-group">
                <label>Your Message / Query</label>
                <textarea
                  placeholder="Explain your payment/earnings or dispute issue here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows="5"
                  disabled={isSubmitting}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Request..." : "Submit Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;