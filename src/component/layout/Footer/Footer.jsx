import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../../images/logo.png";
import {
  FaPinterest,
  FaInstagram,
  FaLinkedin,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerContainer">
        {/* Logo & Description */}
        <div className="footerSection logoSection">
          <Link to="/" className="footerLogo">
            <img src={logo} alt="FlexiWork Logo" />
          </Link>
          <p className="footerDesc">
            Your go-to platform for freelance opportunities. Connect, create, and grow with top talent worldwide.
          </p>
          <div className="socialIcons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="socialIcon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="socialIcon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="socialIcon" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="socialIcon" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest className="socialIcon" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="socialIcon" />
            </a>
          </div>
        </div>

        {/* For Freelancers */}
        <div className="footerSection">
          <h3 className="footerTitle">For Freelancers</h3>
          <ul className="footerLinks">
            <li><Link to="/freelancer/how-it-works">How It Works</Link></li>
            <li><Link to="/freelancer/pricing">Pricing</Link></li>
            <li><Link to="/freelancer/success-stories">Success Stories</Link></li>
            <li><Link to="/freelancer/resources">Resources</Link></li>
            <li><Link to="/freelancer/blog">Blog</Link></li>
          </ul>
        </div>

        {/* For Clients */}
        <div className="footerSection">
          <h3 className="footerTitle">For Clients</h3>
          <ul className="footerLinks">
            <li><Link to="/client/post-project">Post a Project</Link></li>
            <li><Link to="/client/find-talent">Find Talent</Link></li>
            <li><Link to="/client/enterprise">Enterprise</Link></li>
            <li><Link to="/client/case-studies">Case Studies</Link></li>
            <li><Link to="/client/support">Client Support</Link></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="footerSection">
          <h3 className="footerTitle">Company</h3>
          <ul className="footerLinks">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>

        {/* NEW: Support */}
        <div className="footerSection">
          <h3 className="footerTitle">Support</h3>
          <ul className="footerLinks">
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/safety">Safety Tips</Link></li>
            <li><Link to="/report">Report Issue</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footerBottom">
        <p>&copy; {currentYear} FLEXIWORK. All rights reserved.</p>
        <p className="madeWith">Made with <span className="heart">love</span> in India</p>
      </div>
    </footer>
  );
};

export default Footer;