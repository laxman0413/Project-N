import React, { useContext, useEffect,useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate,Link} from "react-router-dom";
import { Logincontex } from './JobProviderloginContext/Logincontext';
import './JobProviderLogin.css';
import logoImage from '../logo.png';

function JobProviderLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [currentuser, error, userloginStatus, LoginUser, LogoutUser] = useContext(Logincontex);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSubmit = (userObj) => {
    LoginUser(userObj);
  };

  useEffect(() => {
    if (userloginStatus === true) {
      alert("User Login Successfully")
      navigate('/job-provider/dashboard');
    }
  }, [userloginStatus, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
      {!isMobile && (
        <div className="info-section">
          <img src={logoImage} alt="Login Info" className="info-image" />
          <h3>Hire talent with NagaConnect!</h3>
          <p>Find, engage, and hire talent on India’s leading recruitment platform.</p>
          <ul className="info-links">
            <li>Job Posting</li>
            <li>Assisted Hiring</li>
          </ul>
        </div>
      )}

        <div className="form-section">
          <h1 className="text-center">Job Provider Login</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="text"
                id="phone"
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
                placeholder="Enter registered phone"
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

              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter password"
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
              <Link to="/job-provider/reset-password" className="forgot-password-link">
                Forgot your password?
              </Link>
              <p>or</p>
              <Link to="/job-provider/register" className="create-account-link">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobProviderLogin;
