import React,{useContext,useEffect,useState} from "react"
import {useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logincontex } from './JobseekerloginContext/Logincontext';

function JobSeekerLogin() {
  let {register,handleSubmit}=useForm();
  const navigate=useNavigate()
  let [currentuser,error,userloginStatus,LoginUser,LogoutUser]=useContext(Logincontex)

  const forsubmit=(userObj)=>{
    LoginUser(userObj);
  }

  useEffect(()=>{
    if(userloginStatus===true){
      navigate('/job-seeker/dashboad')
    }
  },[userloginStatus])
  
  return (
    <div>
      <h1 className="text-center">Login</h1>
      {error.length!==0 && <p>{error}</p>}
      <div className="row">
        <div className="col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="phone">phone</label>
              <input type="number" name="phone" id="phone" className="form-control" {...register("phone")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="password">password</label>
              <input type="password" name="password" id="password" className="form-control" {...register("password")} required></input>
            </div>
            <button type="submit" className="btn btn-success">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default JobSeekerLogin