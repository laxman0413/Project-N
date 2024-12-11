import React, { useState ,useEffect} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './JobProviderRegister.css'; // Assume you add styles here
import { Link } from 'react-router-dom';
import logoImage from '../logo.png';

function JobProviderRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [otpSessionId, setOtpSessionId] = useState('');
  const apiKey = '48d44a76-8792-11ef-8b17-0200cd936042'; // Your API key
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImg(file);
    } else {
      setError("Please upload a valid image file (jpg, png, etc.)");
    }
  };

  const handleSendOtp = (data) => {
    setError("");
    axios.get(`https://2factor.in/API/V1/${apiKey}/SMS/${data.phone}/AUTOGEN`)
      .then(res => {
        if (res.data.Status === 'Success') {
          setOtpStep(true);
          setUserDetails(data);
          setOtpSessionId(res.data.Details);
        } else {
          setError(res.data.Details);
        }
      })
      .catch(error => {
        setError("Failed to send OTP. Please try again.");
      });
  };

  const handleRegister = () => {
    if (!userDetails || !otp) return;

    axios.get(`https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${otpSessionId}/${otp}`)
      .then(res => {
        if (res.data.Status === 'Success') {
          const formData = new FormData();
          formData.append("userObj", JSON.stringify(userDetails)); // Exclude otp from userDetails
          formData.append("image", selectedImg);

          axios.post("https://nagaconnect-iitbilai.onrender.com/jobProvider/register", formData)
            .then(res => {
              if (res.status === 201) {
                alert(res.data.message+"  Please Login!");
                navigate("/job-provider/login");
              } else {
                setError(res.data.message);
              }
            })
            .catch(error => {
              setError("Registration failed. Please try again.");
            });
        } else {
          setError("Invalid OTP. Please try again.");
        }
      })
      .catch(error => {
        setError("Error verifying OTP. Please try again.");
      });
  };

  return (
    <div className="register-page">
      <div className="register-contain">
      {!isMobile && (
        <div className="info-section">
          
          <img src={logoImage} alt="Registration Info" className="info-image" />
          <h3>On registering, you can</h3>
          <ul className="info-list">
            <li><span className="checkmark">✔</span> Find, engage, and hire talent recruitment platform</li>
            <li><span className="checkmark">✔</span> Get job postings delivered to right Persons</li>
            <li><span className="checkmark">✔</span> Find the skilled and grow your bussiness</li>
          </ul>
        </div>
      )}

        <div className="form-section">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>
          <h2 className="form-title">Create your NagaConnect Profile</h2>
          <p className="form-subtitle">Create and Post to jobs from India's No.1 Job Site</p>

          {err && <p className="error-message">{err}</p>}
          <div className="form-container">
            {!otpStep ? (
              <form onSubmit={handleSubmit(handleSendOtp)} className="register-form">
                <label htmlFor="username" className="form-label">Full Name*</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${errors.name ? 'input-error' : ''}`}
                  placeholder="What is your name?"
                  {...register("name", {
                    required: "Username is required",
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: "Username should not contain special characters"
                    }
                  })}
                  required
                />
                {errors.name && <p className="validation-error">{errors.name.message}</p>}


                <label htmlFor="password" className="form-label">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.pass ? 'input-error' : ''}`}
                  placeholder="Minimum 8 characters"
                  {...register("pass", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long"
                    }
                  })}
                  required
                />
                {errors.pass && <p className="validation-error">{errors.pass.message}</p>}

                <label htmlFor="phone" className="form-label">Mobile Number*</label>
                <input
                  type="text"
                  id="phone"
                  className={`form-control ${errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter your mobile number"
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

                <label htmlFor="profileImage" className="form-label">Profile Image:</label>
                <input type="file" id="profileImage" className="form-control" onChange={handleImg} required />

                <button type="submit" className="btn-dark btn-submit">Generate OTP</button>
                <p className="alternative-login">Already have an account? <Link to="/job-provider/login">Log in</Link></p>
              </form>
            ) : (
              <div className="otp-verification">
                <h2>Enter the OTP sent to your phone</h2>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
                <button className="btn-dark btn-submit" onClick={handleRegister}>Register</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobProviderRegister;
