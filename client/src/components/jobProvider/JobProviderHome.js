import React from 'react'
import {useNavigate} from "react-router-dom";

function JobProviderHome() {
  const navigate=useNavigate();
  return (
    <div>JobProviderHome
      <div>
      <button onClick={() => navigate("/job-provider/register")}>Register</button>
      </div>
      <p>Already register? then </p>
      <div>
      <button onClick={() => navigate("/job-provider/login")}>Login</button>
      </div>
    </div>
  )
}

export default JobProviderHome