import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import AdCard from "../advertisement/AdCard";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import { useParams } from 'react-router-dom';
import './Styles.css'

function JobProviderPubP(){
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [ads, setAds] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch Ads
  const { userId } = useParams();
  useEffect(() => {
    axios
      .get("https://nagaconnect-iitbilai.onrender.com/advertise/publicads")
      .then((response) => setAds(response.data))
      .catch((error) => console.error("Error fetching ads:", error));

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle ad delete
  const handleDelete = (id) => {
    setAds(ads.filter((ad) => ad.advertisement_id !== id));
  };

  // Fetch Job Seeker Profile using axios
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          axios.get(`https://nagaconnect-iitbilai.onrender.com/jobProvider/pub-profile/${userId}`)
          .then(response => {
            setProfile({...response.data});
          })
          .catch(() => {
            setError('Error fetching profile details. Please try again later.');
          });
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Show loading, error, or profile information
  if (loading) {
    return <p>Loading profile...</p>; // Show loading text
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  return (
    <div>
      {profile ? (
        <div className="profile-card">
          <img src={profile.image} alt={profile.name} className="profile-image" />
          <div className="profile-details">
            <h2>{profile.name}</h2>
            {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
          </div>
        </div>
      ) : (
        <p>No profile available.</p>
      )}


      
      {ads.length > 0 && (
        <div className="ads-carousel">
          <h3>Advertisements</h3>
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            centerMode={!isMobile}
            centerSlidePercentage={isMobile ? 100 : 33.33}
            showStatus={false}
          >
            {ads.map((ad) => (
              <div key={ad.advertisement_id} className="carousel-slide">
                <AdCard ad={ad} onDelete={handleDelete} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <Footer style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
    </div>
  );
};

export default JobProviderPubP;
