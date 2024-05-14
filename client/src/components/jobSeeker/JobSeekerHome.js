import React from 'react'
import {useNavigate} from "react-router-dom";

function JobSeekerHome() {
  const navigate=useNavigate()
  return (
    <div> Welcome to JobSeekerHome
      <div>
      <button onClick={() => navigate("/job-seeker/register")}>Register</button>
      </div>
      <p>Already register? then </p>
      <div>
      <button onClick={() => navigate("/job-seeker/login")}>Login</button>
      </div>
    </div>
  )
}

export default JobSeekerHome