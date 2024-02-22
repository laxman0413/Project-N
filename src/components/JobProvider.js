import {useState} from "react";
import {useForm } from "react-hook-form";
import React from "react";
import { useNavigate } from "react-router-dom";
const JobProvider = () => {
    let {register,handleSubmit}=useForm();
    let [user,setUser]=useState({})
    const navigate=useNavigate()
    const forsubmit=(userObj)=>{
        setUser(userObj);
        console.log(userObj);
        navigate("/jobprovider-1")
    }
  return (
    <div>
      <h1>JobProvider SignUp</h1>
        <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" className="form-control" {...register("username")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo">Phone No</label>
              <input type="number" onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}name="phoneNo" id="phoneNo" className="form-control" {...register("phoneNo")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="dob">Date Of Birth</label>
              <input type="date" name="dob" id="dob" className="form-control" {...register("dob")}></input>
            </div>
            <div className="mb-3">
                <label htmlFor="location">Location</label>
              <input type="text" name="location" id="location" className="form-control" {...register("location")}></input>
            </div>

            <button className="btn btn-success" type="submit">SignUp</button>
          </form>
        </div>
    </div>
  )
};

export default JobProvider;
