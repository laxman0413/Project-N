import React from "react"
import {useForm } from "react-hook-form";


const Admin = (props) => {

  let {register,handleSubmit}=useForm();
  const forsubmit=(userObj)=>{
    console.log(userObj);
  }
  return (
    <div>
      <h1 className="text-center">Admin Login</h1>
      <div className="row">
        <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" className="form-control" {...register("username")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="username">password</label>
              <input type="password" name="password" id="password" className="form-control" {...register("password")} required></input>
            </div>
            <button type="submit" className="btn btn-success">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default Admin;
