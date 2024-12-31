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
        {/* Column 1: Logo and Powered By */}
        <div className="footer-column">
          <div className="footer-logo">
            <img src="/path/to/logo.png" alt="Clinic Logo" className="clinic-logo" />
            <h3 className="clinic-name">Shinedent</h3>
          </div>
          <p className="powered-by">Powered by DentMS</p>
        </div>

        {/* Column 2: Contact and Social Media */}
        <div className="footer-column">
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
        <p>© {new Date().getFullYear()} DentMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;