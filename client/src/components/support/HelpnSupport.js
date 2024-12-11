import React, { useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImage from '../logo.png';

function HelpnSupport() {
  const { role } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'unknown') {
      alert('please login or create account first');
      navigate('/');
    }
  }, [role]);

  const handleTicketSubmit = (ticketData) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('https://nagaconnect-iitbilai.onrender.com/jobProvider/RaiseTicket', {
        ...ticketData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          alert('Ticket raised successfully!');
          console.log('Ticket raised successfully:', response.data);
          navigate(`/${role}/Dashboard`);
        })
        .catch(error => {
          console.error('Error raising ticket:', error);
        });
    } else {
      console.log("Please Login First");
      navigate(`/${role}/login`);
    }
  };

  const handleHomeNavigation = () => {
    navigate(`/${role}/Dashboard`);
  };

  return (
    <div>
      <header className="header" onClick={() => handleHomeNavigation()} style={{ margin: '0', padding: '20px', backgroundColor: '#f8f8f8', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #ddd' }}>
        <img src={logoImage} alt="NagaConnect Logo" style={{ height: '50px', marginRight: '15px' }} />
        <div>
          <h1 style={{ margin: '0', fontSize: '1.5rem', color: '#333' }}>NagaConnect</h1>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Platform for connecting job seekers with employers. Start your journey today!</p>
        </div>
      </header>

      <div className="help-support-form" style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Raise a Ticket</Typography>
        <form onSubmit={handleSubmit(handleTicketSubmit)}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Title</label>
            <input
              type='text'
              id='title'
              {...register("title", { required: "Title is required" })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            {errors.title && <Typography color="error" style={{ marginTop: '5px' }}>{errors.title.message}</Typography>}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Issue Description</label>
            <TextField
              fullWidth
              id="description"
              {...register("description", { required: "Description is required" })}
              multiline
              rows={4}
              variant="outlined"
            />
            {errors.description && <Typography color="error" style={{ marginTop: '5px' }}>{errors.description.message}</Typography>}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HelpnSupport;
