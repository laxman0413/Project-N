import React from 'react'
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate=useNavigate()
  return (
    <div>
        <h1 className="text-center">Home</h1>
        <button onClick={()=>{navigate('/job-provider')}}>JobProvider</button>
        <button onClick={()=>{navigate('/job-seeker')}}>JobSeeker</button>
    </div>
  )
}

export default Home