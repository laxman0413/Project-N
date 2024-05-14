import React from 'react'
import {useState} from "react";
import {useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
function JobSeekerRegister() {
  const navigate=useNavigate()
    let {register,handleSubmit}=useForm();
    let [err,setError]=useState("")
    const forsubmit=(userObj)=>{
      axios
      .post("http://localhost:3001/jobSeeker/register",userObj)
      .then((response)=>{
        if(response.status===201){
          navigate("/job-seeker/login")
        }else{
          setError(response.data.message)
        }
      })
      .catch((error)=>{
        setError(error.message)
      })
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
      <h1>JobSeeker Register</h1>
      {err===undefined}?<p></p>:<p>{err}</p>
        <div className="container col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" className="form-control" {...register("name")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" className="form-control" {...register("pass")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo">Phone No</label>
              <input type="number" onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) {event.preventDefault();}}}name="phoneNo" id="phoneNo" className="form-control" {...register("phone")} required></input>
            </div>
            <div className="mb-3">
              <label htmlFor="age">Age</label>
              <input type="number" name="age" id="age" className="form-control" {...register("age")}></input>
            </div>
            <div className="mb-3">
              <p>Sex</p>
              <div className='form-check'>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="male" className="form-check-input" {...register("sex")} />{' '}Male
              </label>
              </div>
              <div className='form-check'>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="female" className="form-check-input" {...register("sex")} />female
              </label>
              </div>
              <div className='form-check'>
              <label htmlFor="sex">
              <input type="radio" id="sex" value="others" className="form-check-input" {...register("sex")} />others
              </label>
              </div>
            </div>
            <div className="mb-3">
                <label htmlFor="location">Type Of Job</label>
                <select className="mb-3"
                {...register('jobType', {
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