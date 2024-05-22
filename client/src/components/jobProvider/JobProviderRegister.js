import axios from 'axios';
import React, { useState } from 'react';
import {useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function JobProviderRegister() {
  let {register,handleSubmit}=useForm();
    let [user,setUser]=useState({})
    const navigate=useNavigate()
    const forsubmit=(userObj)=>{
        setUser(userObj);
        axios
        .post("http://localhost:3001/jobProvider/register",userObj)
        console.log(userObj);
        navigate("/job-provider/login");
    }
  return (
    <div>
      <h1>JobProvider SignUp</h1>
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
            <button className="btn btn-success" type="submit">Register</button>
          </form>
        </div>
    </div>
  );
}

export default JobProviderRegister;