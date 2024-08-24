import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './JobSeekerRegister.css'; // Custom CSS for styling

function JobSeekerRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImg(file);
    } else {
      setError("Please upload a valid image file (jpg, png, etc.)");
    }
  };

  const forsubmit = (userObj) => {
    const formData = new FormData();
    formData.append("userObj", JSON.stringify(userObj));
    formData.append("image", selectedImg);

    axios.post("https://nagaconnect-iitbilai.onrender.com/jobSeeker/register", formData)
      .then((response) => {
        if (response.status === 201) {
          navigate("/job-seeker/login");
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
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
        <form onSubmit={handleSubmit(forsubmit)} className="register-form">
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
            <label htmlFor="age">Age</label>
            <input
              type="number"
              name="age"
              id="age"
              className={`form-control ${errors.age ? 'input-error' : ''}`}
              {...register("age", {
                required: "Age is required",
                min: {
                  value: 18,
                  message: "You must be at least 18 years old"
                },
                max: {
                  value: 65,
                  message: "Age must be less than or equal to 65"
                }
              })}
              required
            />
            {errors.age && <p className="validation-error">{errors.age.message}</p>}
          </div>

          <div className="mb-3">
            <label>Sex</label>
            <div className="form-check">
              <input
                type="radio"
                value="male"
                id="male"
                className="form-check-input"
                {...register("sex", { required: "Please select your gender" })}
              />
              <p>Male</p>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value="female"
                className="form-check-input"
                {...register("sex", { required: "Please select your gender" })}
              />
              <p>Female</p>
            </div>
            <div className="form-check">
              <input
                type="radio"
                value="others"
                className="form-check-input"
                {...register("sex", { required: "Please select your gender" })}
              />
              <p>Others</p>
            </div>
            {errors.sex && <p className="validation-error">{errors.sex.message}</p>}
          </div>

          <div className="mb-3">
            <label>Type Of Job</label>
            <select
              className={`form-control ${errors.jobType ? 'input-error' : ''}`}
              {...register('jobType', {
                required: "Please select a job type",
              })}
            >
              <option value="">-- Please select --</option>
              {jobOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.jobType && <p className="validation-error">{errors.jobType.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="img">Profile Image</label>
            <input
              type="file"
              name="img"
              id="image"
              className="form-control"
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
      <p>Already have an account? <a href="/job-seeker/login">Log in</a></p>
    </div>
  );
}

export default JobSeekerRegister;
