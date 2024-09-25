import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle login and request for OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/admin/login', { phone, password });
      if (response.status === 200) {
        setIsOtpSent(true); // OTP will be sent after login
      }
    } catch (err) {
      setError('Invalid phone or password');
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/admin/verify-otp', { phone, otp });
      if (response.status === 200) {
        const { token } = response.data; // Use 'token' instead of 'adminToken'
        
        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem('token', token);

        alert('Login successful!');
        navigate('/admindashboard'); // Redirect to AdminDashboard on success
      }
    } catch (err) {
      setError('Invalid OTP or OTP expired');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {!isOtpSent ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Phone Number:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleOtpVerification}>
          <div>
            <label>Enter OTP:</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="submit">Verify OTP</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default AdminLogin;
