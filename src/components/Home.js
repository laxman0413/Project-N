import React from 'react'
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate=useNavigate()
    function handleadmin(){
        navigate("/admin")
    }
    function handleseek(){
        navigate("/jobseeker")
    }
    function handlepro(){
        navigate("/jobprovider")
    }
  return (
    <div>
        <div >
            <h1 className='justify-content-center bg-secondary'>Home</h1>
            <p className='justify-content-center'>Here is a website that allows job providers to post job openings and job seekers to search for jobs. It has a number of features that make it a valuable tool for both parties.<br/>

<b>For job providers:</b>
Post job openings: Job providers can easily post job openings. They can include a variety of information about the job, such as the job title, description, qualifications, and salary.<br/>
<b>For job seekers:</b>
Search for jobs: Job seekers can search Jobify's database of job openings. They can filter their search by a variety of criteria, such as job title, location, and salary.<br/></p>
            <div className="d-flex align-items-center justify-content-center">
                <button className="btn btn-danger btn-lg" onClick={handleadmin} >Admin   </button>
            </div>
            <div></div>
            <div className=" d-flex align-items-middle justify-content-center">
                <button className="btn btn-primary btn-lg" onClick={handleseek} >JobSeeker</button>
            </div>
            <div></div>
            <div className="d-flex align-items-bottom justify-content-center ">
                <button className="btn btn-secondary btn-lg" onClick={handlepro} >JobProvider</button>
            </div>
        </div>
    </div>
  )
}

export default Home