import axios from 'axios';
import React, { useState } from 'react';
import {useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function JobProviderRegister() {
  let {register,handleSubmit}=useForm();
    let [err,setErr]=useState("")
    const navigate=useNavigate()
    const [selectedImg, setSelectedImg] = useState(null);
    const handleImg = (e) => {
      setSelectedImg(e.target.files[0]);
    };
    const forsubmit=(userObj)=>{
      const formData = new FormData();
      formData.append("userObj", JSON.stringify(userObj));
      formData.append("image", selectedImg);
        axios.post("https://nagaconnect-iitbilai.onrender.com/jobProvider/register",formData)
        .then(res=>{
          console.log(res.data);
          if(res.status===201){
            navigate("/job-provider/login");
          }else{
            setErr(res.data.message);
          }
        })
        .catch(error => {
          console.error(error);
          setErr("Registration failed. Please try again.");
        })
    }
  return (
    
    <div>
      <div className="signup-container">
      <div className="form-section">
        <h2>Join us</h2>
        {err.length!==0 && <p>{err}</p>}
        <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" className="form-control" {...register("name")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo">Phone No</label>
              <input type="number" onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}name="phoneNo" id="phoneNo" className="form-control" {...register("phone")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="dob">Password</label>
              <input type="password" name="pass" id="pass" className="form-control" {...register("password")}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="img">Profile Image</label>
                <input type="file" name="img" id="image" className="form-control" onChange={handleImg} required />
              </div>
            <button className="btn btn-success" type="submit">Register</button>
          </form>
        </div>
        <div className="alternative-signup">
          <p>or</p>
        </div>
        <p>Already have an account? <a href="/job-provider/login">Log in</a></p>
      </div>
      </div>
    </div>
  );
}

export default JobProviderRegister;