import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './ResetPassword.css'; // Custom CSS file for styling

function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const sendOtp = (data) => {
    axios.post('https://nagaconnect-iitbilai.onrender.com/jobSeeker/send-otp', { phone: data.phone })
      .then(response => {
        setPhone(data.phone);
        setStep(2);
      })
      .catch(error => {
        console.error('Error sending OTP:', error);
      });
  };

  const verifyOtp = (data) => {
    axios.post('https://nagaconnect-iitbilai.onrender.com/jobSeeker/verify-otp', { phone, otp: data.otp })
      .then(response => {
        setOtp(data.otp);
        setStep(3);
      })
      .catch(error => {
        console.error('Error verifying OTP:', error);
      });
  };

  const resetPassword = (data) => {
    axios.post('https://nagaconnect-iitbilai.onrender.com/jobSeeker/reset-password', { phone, password: data.password })
      .then(response => {
        console.log('Password reset successful:', response);
        navigate('/job-seeker/login');
      })
      .catch(error => {
        console.error('Error resetting password:', error);
      });
  };
  const password = watch("password");
  return (
    <div className="reset-password-container">
      <h1 className="text-center">Reset Password</h1>
      <div className="row">
        <div className="col-l1 col-sm-8 col-md-6 mx-auto mt-3">
          {step === 1 && (
            <form onSubmit={handleSubmit(sendOtp)}>
              <div className="mb-3">
                <label htmlFor="phone">Phone</label>
                <input type="number" name="phone" id="phone" className="form-control" {...register("phone")} required />
              </div>
              <button type="submit" className="btn btn-submit">Send OTP</button>
              
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit(verifyOtp)}>
              <div className="mb-3">
                <label htmlFor="otp">OTP</label>
                <input type="text" name="otp" id="otp" className="form-control" {...register("otp")} required />
              </div>
              <button type="submit" className="btn btn-submit">Verify OTP</button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit(resetPassword)}>
              <div className="mb-3">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  {...register("password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>} {/* Display error for new password */}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>} {/* Display error for confirm password */}
              </div>
              <button type="submit" className="btn btn-submit">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
