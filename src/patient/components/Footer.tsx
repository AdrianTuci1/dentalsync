import React from 'react';
import '../styles/footer.scss';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <LocationOn className="footer-icon" /> Bulevardul Dacia Nr.84, Bucharest
          </p>
          <p>
            <Phone className="footer-icon" /> +40 123 456 789
          </p>
          <p>
            <Email className="footer-icon" /> info@democlinic.com
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Our Services</a></li>
            <li><a href="/appointments">Book Appointment</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Demo Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;