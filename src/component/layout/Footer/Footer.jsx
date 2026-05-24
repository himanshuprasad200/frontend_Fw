import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Logo from "../Logo/Logo";
import {
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
          <Link to="/" className="footerLogoLink">
            <Logo size="normal" className="footer-logo light-text" />
          </Link>
          <p className="footerDesc">
            A freelance service web portal connects businesses with freelancers, facilitating project collaboration and hiring.
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
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="socialIcon" />
            </a>
          </div>
        </div>

        {/* Product */}
        <div className="footerSection">
          <h3 className="footerTitle">Product</h3>
          <ul className="footerLinks">
            <li><Link to="/">About</Link></li>
            <li><Link to="/projects">Find Jobs</Link></li>
            <li><Link to="/admin/joinasclient">Clients</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footerSection">
          <h3 className="footerTitle">Support</h3>
          <ul className="footerLinks">
            <li><Link to="/find-a-mentor">Find a Mentor</Link></li>
            <li><Link to="/faq">Community</Link></li>
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/safety">Safety Tips</Link></li>
            <li><Link to="/accessibility">Settings & Policy</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footerSection">
          <h3 className="footerTitle">Resources</h3>
          <ul className="footerLinks">
            <li><Link to="/freelancer/how-it-works">Customer Stories</Link></li>
            <li><Link to="/freelancer/blog">Blog</Link></li>
            <li><Link to="/freelancer/resources">Help Docs</Link></li>
            <li><Link to="/client/enterprise">Pricing</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footerBottom">
        <p>© {currentYear} Connect Pvt. Ltd.</p>
        <div className="footerBottomLinks">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/terms-of-service">Compliance</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;