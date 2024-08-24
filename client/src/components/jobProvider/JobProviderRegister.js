import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './JobProviderRegister.css'; // Assume you add styles here

function JobProviderRegister() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImg(file);
    } else {
      setErr("Please upload a valid image file (jpg, png, etc.)");
    }
  };

  const forsubmit = (userObj) => {
    const formData = new FormData();
    formData.append("userObj", JSON.stringify(userObj));
    formData.append("image", selectedImg);

    axios.post("https://nagaconnect-iitbilai.onrender.com/jobProvider/register", formData)
      .then(res => {
        if (res.status === 201) {
          navigate("/job-provider/login");
        } else {
          setErr(res.data.message);
        }
      })
      .catch(error => {
        console.error(error);
        setErr("Registration failed. Please try again.");
      });
  };

  return (
    <div className="signup-container">
      <div className="form-section">
        <h2>Join Us</h2>
        {err.length !== 0 && <p className="error-message">{err}</p>}
        <div className="container col-lg-6 col-md-8 col-sm-10 mx-auto mt-3">
          <form onSubmit={handleSubmit(forsubmit)}>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className={`form-control ${errors.username ? 'input-error' : ''}`}
                {...register("name", { required: "Username is required" })}
              />
              {errors.username && <p className="validation-error">{errors.username.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                id="phoneNo"
                className={`form-control ${errors.phone ? 'input-error' : ''}`}
                onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
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
            <div className="mb-3">
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
            <div className="mb-3">
              <label htmlFor="image">Profile Image</label>
              <input
                type="file"
                name="image"
                id="image"
                className={`form-control ${errors.image ? 'input-error' : ''}`}
                onChange={handleImg}
                required
              />
            </div>
            <button className="btn btn-success" type="submit">Register</button>
          </form>
        </div>
        <div className="alternative-signup">
          <p>or</p>
        </div>
        <p>Already have an account? <a href="/job-provider/login">Log in</a></p>
      </div>
    </div>
  );
}

export default JobProviderRegister;
