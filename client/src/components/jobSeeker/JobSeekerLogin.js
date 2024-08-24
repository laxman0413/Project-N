import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logincontex } from './JobseekerloginContext/Logincontext';
import './JobSeekerLogin.css'; // Custom CSS file for styling

function JobSeekerLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  const forsubmit = (userObj) => {
    LoginUser(userObj);
  };

  useEffect(() => {
    if (userloginStatus === true) {
      navigate('/job-seeker/dashboard');
    }
  }, [userloginStatus, navigate]);

  return (
    <div className="login-container">
      <h1 className="text-center">Job Seeker Login</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="login-form-container">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)} className="login-form">
            <div className="mb-3">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits"
                  }
                })}
              />
              {errors.phone && <p className="validation-error">{errors.phone.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={`form-control ${errors.password ? 'input-error' : ''}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long"
                  }
                })}
              />
              {errors.password && <p className="validation-error">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn btn-success">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerLogin;
