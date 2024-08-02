import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logincontex } from './JobProviderloginContext/Logincontext';
import './JobProviderLogin.css';

function JobProviderLogin() {
  let { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  let [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  const forsubmit = (userObj) => {
    LoginUser(userObj);
  }

  useEffect(() => {
    if (userloginStatus === true) {
      navigate('/job-provider/dashboard')
    }
  }, [userloginStatus, navigate]);

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Job Provider Portal</h1>
      </header>
      <main className="login-main">
        <div className="login-form-container">
          <h2 className="text-center">Login</h2>
          {error.length !== 0 && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit(forsubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="number" name="phone" id="phone" className="form-control" {...register("phone")} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" className="form-control" {...register("password")} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </main>
      <footer className="login-footer">
        <p>&copy; 2024 Job Provider Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default JobProviderLogin;
