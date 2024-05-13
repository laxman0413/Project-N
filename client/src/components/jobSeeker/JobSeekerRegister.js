import React from 'react'
import {useState} from "react";
import {useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
function JobSeekerRegister() {
  const navigate=useNavigate()
    let {register,handleSubmit}=useForm();
    let [user,setUser]=useState({})
    const forsubmit=(userObj)=>{
        setUser(userObj);
        console.log(user);
        navigate("/");
    }
    const options = [
        { label: 'Construction', value: 'construction' },
        { label: 'Factory work', value: 'factory_work' },
        { label: 'Agriculture', value: 'agriculture' },
        { label: 'Domestic work', value: 'domestic_work' },
        { label: 'Transportation', value: 'transportation' }
      ];
  return (
    <div>
      <h1>JobSeeker SignUp</h1>
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
              <label htmlFor="age">Age</label>
              <input type="number" name="age" id="age" className="form-control" {...register("age")}></input>
            </div>
            <div className="mb-3">
              <p>Sex</p>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="Male" className="form-control" {...register("sex")} />Male
              </label>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="feMale" className="form-control" {...register("sex")} />feMale
              </label>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="others" className="form-control" {...register("sex")} />others
              </label>
            </div>
            <div className="mb-3">
                <label htmlFor="location">Type Of Job</label>
                <select className="mb-3"
                {...register('job', {
                required: true,
                validate: (value) => value !== '' || 'Please select an job',
                })}>
                <option value="">-- Please select --</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                </select>
            </div>

            <button className="btn btn-success" type="submit">Register</button>
          </form>
        </div>

    </div>
  )
}

export default JobSeekerRegister