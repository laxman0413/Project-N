import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './JobSeekerRegister.css';
import { Link } from 'react-router-dom';

function JobSeekerRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState(null);

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
    axios.post("http://localhost:3001/jobSeeker/send-register-otp", { phone: data.phone })
      .then(res => {
        if (res.status === 200) {
          setOtpStep(true);
          setUserDetails(data);
        } else {
          setError(res.data.message);
        }
      })
      .catch(error => {
        setError("Failed to send OTP. Please try again.");
      });
  };

  const handleRegister = () => {
    if (!userDetails || !otp) return;

    const formData = new FormData();
    formData.append("userObj", JSON.stringify({ ...userDetails, otp }));
    formData.append("image", selectedImg);

    axios.post("https://nagaconnect-iitbilai.onrender.com/jobSeeker/register", formData)
      .then(res => {
        if (res.status === 201) {
          navigate("/job-seeker/login");
        } else {
          setError(res.data.message);
        }
      })
      .catch(error => {
        setError("Registration failed. Please try again.");
      });
  };

  const jobOptions = [
    { label: 'Construction', value: 'construction' },
    { label: 'Factory work', value: 'factory_work' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Domestic work', value: 'domestic_work' },
    { label: 'Transportation', value: 'transportation' }
  ];

  return (
    <div className="register-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>
      <h2 className="form-title">Sign Up</h2>
      {err && <p className="error-message">{err}</p>}
      <div className="form-container">
        {!otpStep ? (
          <form onSubmit={handleSubmit(handleSendOtp)} className="register-form">
            <input
              type="text"
              name="username"
              className={`form-control ${errors.name ? 'input-error' : ''}`}
              placeholder="Username"
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

            <input
              type="password"
              name="password"
              className={`form-control ${errors.pass ? 'input-error' : ''}`}
              placeholder="Password"
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

            <select className="form-control" {...register("jobType", { required: true })}>
              <option value="" disabled selected>Type of Job</option>
              {jobOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>

            <input
              type="number"
              className={`form-control ${errors.age ? 'input-error' : ''}`}
              placeholder="Age"
              {...register("age", { required: true })}
            />

            <select className="form-control" {...register("sex", { required: true })}>
              <option value="" disabled selected>Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input type="file" className="form-control" onChange={handleImg} required />
            <button type="submit" className="btn btn-submit">send OTP</button>
            <p className="alternative-login">Already have an account? <Link to="/job-seeker/login">Log in</Link></p>
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
            <button className="btn btn-submit" onClick={handleRegister}>Register</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSeekerRegister;
