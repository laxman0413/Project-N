import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate ,Link} from "react-router-dom";
import { Logincontex } from './JobseekerloginContext/Logincontext';
import './JobSeekerLogin.css'; // Custom CSS file for styling

function JobSeekerLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser] = useContext(Logincontex);

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
        <div className="text-center mt-3">
            <Link to="/job-seeker/reset-password" className="forgot-password-link">
              Forgot your password?
            </Link>
          </div>
      </div>
    </div>
  );
}

export default JobSeekerLogin;
