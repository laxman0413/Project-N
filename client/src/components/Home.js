import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AdCardPrivate from './advertisement/AdCardPrivate';
import './Home.css';
import jobProviderImage from './job-provider.jpg';
import jobSeekerImage from './job-seeker.jpg';
import logoImage from './logo.png'; // Ensure this is the correct path to your logo
import Footer from './Footer';

function Home() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Static data for testing
  const staticAds = [
    {
      advertisement_id: 1,
      title: "Learn React Today",
      description: "Master React with our comprehensive course.",
      image: "https://via.placeholder.com/300",
    },
    {
      advertisement_id: 2,
      title: "Node.js Bootcamp",
      description: "Become a backend expert with our Node.js Bootcamp.",
      image: "https://via.placeholder.com/300",
    },
  ];

  useEffect(() => {
    // Fetch ads dynamically or use static data
    axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/publicads')
      .then(response => setAds(response.data))
      .catch(error => {
        console.error('Error fetching ads:', error);
        setAds(staticAds); // Use static data in case of error
      });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDelete = (id) => {
    setAds(ads.filter(ad => ad.advertisement_id !== id));
  };

  return (
    <div className="home-wrapper">
      <header className="header">
        <img src={logoImage} alt="NagaConnect Logo" className="logo-image" />
        <div className="title-description">
          <h1 className="logo-title">NagaConnect</h1>
          <p className="intro-text">Platform for connecting job seekers with employers. Start your journey today!</p>
        </div>
      </header>

      <section className="intro-section">
        <p className="intro-description">
          Whether you are an employer searching for top talent or a job seeker looking for the perfect opportunity, NagaConnect provides an intuitive interface to meet your needs. Our advanced search capabilities and seamless experience ensure you find exactly what you're looking for, quickly and efficiently.
        </p>
        <h3><b>How do you want to use NagaConnect?</b></h3>
        <div className="options">
          <div className="option-card" onClick={() => navigate('/job-provider/register')}>
            <img src={jobProviderImage} alt="Job Provider" className="option-image" />
            <div className="option-text">
              <h2><b>I'm here to hire the talent</b></h2>
              <p>Evaluate the skills at scale</p>
            </div>
          </div>
          <div className="option-card" onClick={() => navigate('/job-seeker/register')}>
            <img src={jobSeekerImage} alt="Job Seeker" className="option-image" />
            <div className="option-text">
              <h2><b>I'm here to find a job for my skills</b></h2>
              <p>Search Job accordingly</p>
            </div>
          </div>
        </div>
      </section>

      {ads.length > 0 && (
        <section className="ads-carousel">
          <h3>Advertisements</h3>
          <Carousel 
            showThumbs={false} 
            infiniteLoop 
            autoPlay
            centerMode={!isMobile}
            centerSlidePercentage={isMobile ? 100 : 33.33}
            showStatus={false}
          >
            {ads.map(ad => (
              <div key={ad.advertisement_id} className="carousel-slide">
                <AdCardPrivate ad={ad} onDelete={handleDelete} />
              </div>
            ))}
          </Carousel>
        </section>
      )}

      <Footer style={{ position: 'relative', bottom: 0, left: 0, right: 0 }} />
    </div>
  );
}

export default Home;
