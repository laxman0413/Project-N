import React from 'react';
import './Footer.css'; // Make sure to create this CSS file

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <pre>     </pre>
        <div className="row social-media">
          <a href="#"><i className="fa fa-facebook"></i></a>
          <a href="#"><i className="fa fa-instagram"></i></a>
          <a href="#"><i className="fa fa-youtube"></i></a>
          <a href="#"><i className="fa fa-twitter"></i></a>
        </div>

        <div className="row links">
          <ul>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="row copyright">
           Copyright © 2024 All rights reserved || Designed By: iiitG
        </div>
      </div>
    </footer>
  );
}

export default Footer;
