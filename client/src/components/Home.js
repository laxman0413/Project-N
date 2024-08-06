import React from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';
import jobProviderImage from './job-provider.jpg';
import jobSeekerImage from './job-seeker.jpg';
import websiteImage1 from './job-boost.png';

function Home() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/publicads')
      .then(response => setAds(response.data))
      .catch(error => console.error('Error fetching ads:', error));

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
    <div id="container">
      <div className="logo">
        <h1><b>NagaConnect</b></h1>
      </div>
      <h3><b>How do you want to use NagaConnect?</b></h3>
      <div className="intro-text">
        <p>Welcome to NagaConnect, the ultimate platform connecting job seekers with employers. Whether you are looking to hire top talent or find the perfect job that matches your skills, NagaConnect has you covered.</p>
        <img src={websiteImage1} alt='Job' className="intro-image"/>
        <p>Our platform offers an easy-to-use interface, advanced search capabilities, and a seamless experience for both job providers and job seekers.</p>
        <p>Choose your path below and start your journey with NagaConnect today.</p>
      </div>
      <div className="options">
        <div className="option" onClick={() => { navigate('/job-provider/register') }}>
          <div className="image-container">
            <img src={jobProviderImage} alt="Job Provider" className="option-image" />
          </div>
          <div className="button">
            <h2><b>I’m here to hire the talent</b></h2>
            <p>Evaluate the skills at scale</p>
          </div>
        </div>
        <div className="option" onClick={() => { navigate('/job-seeker/register') }}>
          <div className="image-container">
            <img src={jobSeekerImage} alt="Job Seeker" className="option-image" />
          </div>
          <div className="button">
            <h2><b>I’m here to find a job for my skills</b></h2>
            <p>Search Job accordingly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
