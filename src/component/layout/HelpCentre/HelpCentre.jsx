import React, { useState } from "react";
import { FaSearch, FaQuestionCircle, FaUser, FaDollarSign, FaShieldAlt, FaHeadset, FaArrowRight, FaExclamationTriangle, FaTools } from "react-icons/fa";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
        </div>
      </div>

      <div className="help-content">
        {/* Popular Categories - Added new ones */}
        <div className="categories-grid">
          <div className="category-card">
            <FaQuestionCircle />
            <h3>Getting Started</h3>
            <p>Account setup, posting jobs, finding work</p>
            <a href="#getting-started">Explore →</a>
          </div>
          <div className="category-card">
            <FaDollarSign />
            <h3>Payments</h3>
            <p>Earnings, withdrawals, fees & invoices</p>
            <a href="#payments">Explore →</a>
          </div>
          <div className="category-card">
            <FaExclamationTriangle />
            <h3>Disputes & Issues</h3>
            <p>Late responses, approvals, disputes</p>
            <a href="#disputes-late-responses">Explore →</a>
          </div>
          <div className="category-card">
            <FaTools />
            <h3>Troubleshooting</h3>
            <p>Website down, errors, technical help</p>
            <a href="#troubleshooting-technical-issues">Explore →</a>
          </div>
          <div className="category-card">
            <FaUser />
            <h3>Profile & Skills</h3>
            <p>Building your profile, verification</p>
            <a href="#account-security">Explore →</a>
          </div>
          <div className="category-card">
            <FaShieldAlt />
            <h3>Safety & Security</h3>
            <p>Trust, disputes, best practices</p>
            <a href="#account-security">Explore →</a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="faq-sections">
          <h2>Frequently Asked Questions</h2>
          
          {faqs.map((section, secIdx) => (
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
          ))}
        </div>

        {/* Contact Support */}
        <div className="contact-support">
          <FaHeadset />
          <div>
            <h3>Still need help?</h3>
            <p>Our support team is available 24/7 • Average response time: &lt;2 hours</p>
            <a href="/contact" className="contact-btn">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;