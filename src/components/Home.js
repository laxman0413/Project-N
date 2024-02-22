import React, { useState } from 'react'
import './Home.css';
import { useNavigate } from "react-router-dom";
function Home() {
    const [open,setOpen]=useState(false);
    const Menu=["admin","jobseeker","jobprovider"];
    const navigate=useNavigate()
  return (
    <div>
        <nav className="navbar d-flex navbar-expand navbar-light bg-secondary ">
        <ul className="navbar-nav">
            
            <li className="nav-item ml-auto">
                <button onClick={()=>setOpen(!open)} class="btn btn-primary">Login</button>
            </li>
                <h1 className='text-white text-center my-2 my-sm-0'>Home</h1>
        </ul>
        </nav>
        { open && (
        <div className="bg-secondary">
            <ul>
                {
                    Menu.map((menu)=>(
                        <div><button className=" btn btn-secondary text-white col-4"onClick={()=>navigate('/'+menu)}key={menu}>{menu}</button></div>
                    ))
                }
            </ul>
        </div>)}
            <p className='justify-content-center'>Here is a website that allows job providers to post job openings and job seekers to search for jobs. It has a number of features that make it a valuable tool for both parties.<br/></p>
    </div>
  )
}

export default Home