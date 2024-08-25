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
              <label htmlFor="phone">Phone</label>
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
                {...register("phone", { 
                  required: "Phone number is required", 
                  pattern: {
                    value: /^[0-9]{10}$/, 
                    message: "Phone number must be 10 digits"
                  }
                })} 
              />
              {errors.phone && <p className="validation-error">{errors.phone.message}</p>}
            </div>
            <div className="form-group">
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
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </main>
      <footer className="login-footer">
        <p>&copy; 2024 Job Provider Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default JobProviderLogin;
