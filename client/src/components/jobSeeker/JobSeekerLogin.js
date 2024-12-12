import React, { useContext, useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate ,Link} from "react-router-dom";
import { Logincontex } from './JobseekerloginContext/Logincontext';
import './JobSeekerLogin.css'; // Custom CSS file for styling
import logoImage from '../logo.png';
import Swal from 'sweetalert2';
function showAlertSuccess(data){
  Swal.fire({
    title: data,
    confirmButtonText: 'OK'
  })
}
function showAlertError(data){
  Swal.fire({
    title: data,
    icon: 'error',
    confirmButtonText: 'OK'
  })
}
function JobSeekerLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser] = useContext(Logincontex);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const forsubmit = (userObj) => {
    LoginUser(userObj);
  };

  useEffect(() => {
    if (userloginStatus === true) {
      showAlertSuccess("User Login Successfully")
      navigate('/job-seeker/dashboard');
    }
  }, [userloginStatus, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
      {!isMobile && (
        <div className="info-section">
          <img src={logoImage} alt="Login Info" className="info-image" />
          <h3>Empower Your Career with NagaConnect!</h3>
          <p>Find your job, connect with top recruiters, and take your work life to the next level.</p>
          <ul className="info-links">
            <li>Top Job Opportunities</li>
            <li>Guided Job Application</li>
          </ul>
        </div>
      )}

        <div className="form-section">
          <h1 className="text-center">Job Seeker Login</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="form-container">
            <form onSubmit={handleSubmit(forsubmit)} className="login-form">
              <label htmlFor="email" className="form-label">Phone </label>
              <input
                type="number"
                id="number"
                className={`form-control ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your registered phone"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid Phone Number",
                  }
                })}
                required
              />
              {errors.email && <p className="validation-error">{errors.email.message}</p>}

              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
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

              <button type="submit" className="btn-primary btn-submit">Log in</button>
            </form>
            <div className="text-center mt-3">
              <Link to="/job-seeker/reset-password" className="forgot-password-link">
                Forgot your password?
              </Link>
              <p>or</p>
              <Link to="/job-seeker/register" className="create-account-link">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerLogin;
