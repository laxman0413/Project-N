import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './JobSeekerRegister.css'; // Custom CSS for styling
import { Link } from 'react-router-dom';

function JobSeekerRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [otpStep, setOtpStep] = useState(false); // OTP step control
  const [otp, setOtp] = useState(""); // OTP state
  const [userDetails, setUserDetails] = useState(null); // Store form data before OTP verification

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImg(file);
    } else {
      setError("Please upload a valid image file (jpg, png, etc.)");
    }
  };

  const handleSendOtp = (data) => {
    setError(""); // Reset error messages
    axios.post("https://nagaconnect-iitbilai.onrender.com/jobSeeker/send-register-otp", { phone: data.phone })
      .then(res => {
        if (res.status === 200) {
          setOtpStep(true); // Move to OTP verification step
          setUserDetails(data); // Save user details
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
    formData.append("userObj", JSON.stringify({ ...userDetails, otp })); // Add OTP to the user data
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
      <h1 className="text-center">Job Seeker Register</h1>
      {err && <p className="error-message">{err}</p>}
      <div className="form-container col-lg-6 col-md-8 col-sm-10 mx-auto mt-3">
        {!otpStep ? (
          <form onSubmit={handleSubmit(handleSendOtp)} className="register-form">
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className={`form-control ${errors.name ? 'input-error' : ''}`}
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
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={`form-control ${errors.pass ? 'input-error' : ''}`}
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
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNo">Phone No</label>
              <input
                type="text"
                id="phoneNo"
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
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
              <label>Type of Job</label>
              <select className="form-select" {...register("jobType", { required: true })}>
                {jobOptions.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                className={`form-control ${errors.age ? 'input-error' : ''}`}
                {...register("age", { required: true })}
              />
            </div>

            <div className="mb-3">
              <label>Sex</label>
              <select className="form-select" {...register("sex", { required: true })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Upload Image</label>
              <input type="file" className="form-control" onChange={handleImg} required />
            </div>

            <button type="submit" className="btn btn-primary">Send OTP</button>
            <p>Already have an account? <Link to="/job-seeker/login">Log in</Link></p>
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
            <button className="btn btn-primary mt-3" onClick={handleRegister}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSeekerRegister;
