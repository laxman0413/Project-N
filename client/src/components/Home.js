import React from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div id="container">
      <div className="logo">
        <div className="icon"><h1><b>NagaConnect</b></h1></div>
      </div>
      <h3><b>How do you want to use NagaConnect?</b></h3>
      <div className="options">
        <div className="option" onClick={() => { navigate('/job-provider/register') }}>
          <div className="icon-search">🔍</div>
          <div className='button'>
            <h2><b>I’m here to hire the talent</b></h2>
            <p>Evaluate the skills at scale</p>
          </div>
        </div>
        <div className="option" onClick={() => { navigate('/job-seeker/register') }}>
          <div className="icon-code">➜</div>
          <div className='button'>
            <h2><b>I’m here to find a job for my skills</b></h2>
            <p>Search Job accordingly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
