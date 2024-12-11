import React from 'react';
import './Footer.css'; // Make sure to create this CSS file

const Footer = () => {
  return (
    <footer>
  <div className="footer">
    <div className="help-section">
      <h3>We’re here to help</h3>
      <p>Visit our Help Centre for answers to common questions or contact us directly.</p>
      <div className="buttons">
        <a href="/help-and-support/unknown">Contact Support</a>
      </div>
    </div>

    <div className="links-section">
      <ul>
        <li><strong>NagaConnect</strong></li>
        <li><a href="#">About NagaConnect</a></li>
        <li><a href="#">Security</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Privacy Centre</a></li>
      </ul>
      <ul>
        <li><strong>Employers</strong></li>
        <li><a href="#">Post a job</a></li>
        <li><a href="#">Advertisements</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">FAQ</a></li>
      </ul>
      <ul>
        <li><strong>Resources</strong></li>
        <li><a href="#">How to hire employees</a></li>
        <li><a href="#">How to write job descriptions</a></li>
        <li><a href="#">Guide to hiring with NagaConnect</a></li>
      </ul>
    </div>

    <div className="copyright">
      Copyright © 2024 All rights reserved || Designed By: iiitG
    </div>
  </div>
</footer>

  );
}

export default Footer;
