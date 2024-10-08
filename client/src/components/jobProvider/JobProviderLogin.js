import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logincontex } from './JobProviderloginContext/Logincontext';
import './JobProviderLogin.css';

function JobProviderLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);

  const onSubmit = (userObj) => {
    LoginUser(userObj);
  };

  useEffect(() => {
    if (userloginStatus === true) {
      navigate('/job-provider/dashboard');
    }
  }, [userloginStatus, navigate]);

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Job Provider Login</h1>
      </header>
      <main className="login-main">
        <div className="login-form-container">
          {error.length !== 0 && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
            <input
              type="text"
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              placeholder="Phone No"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key) || event.target.value.length >= 10) {
                  event.preventDefault();
                }
              }}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits"
                }
              })}
              required
            />
            {errors.phone && <p className="validation-error">{errors.phone.message}</p>}
            </div>
            <div className="mb-3">
              
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long"
                }
              })}
              required
            />
            {errors.password && <p className="validation-error">{errors.password.message}</p>}
            </div>
            <button type="submit" className="btn-dark btn-submit">Login</button>
          </form>
        </div>
      </main>
      
    </div>
  );
}

export default JobProviderLogin;
