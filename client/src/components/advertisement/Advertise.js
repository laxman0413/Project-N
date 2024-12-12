import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Container,
  CssBaseline,
  Typography,
  Grid
} from '@mui/material';
import { useForm } from 'react-hook-form';
import AdCard from './AdCard';
import Swal from 'sweetalert2';
function showAlert(){
  Swal.fire({
    title: 'Login Successfull',
    text: 'Please continue to the application',
    icon: 'success',
    confirmButtonText: 'OK'
  })
}
function Advertise() {
  
  const { register, handleSubmit, reset } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [selectedImg,SetselectedImg]=useState(null)

  const handleImg=(e)=>{
    SetselectedImg(e.target.files[0]);
  }

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('https://nagaconnect-iitbilai.onrender.com/advertise/getUserAds', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAds(response.data.payload);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAds();
  }, []);

  const handlePostAdClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset(); // Reset the form fields
  };

  const formSubmit = async (adDetails) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const formData=new FormData();
      formData.append("adver",JSON.stringify(adDetails));
      formData.append("image",selectedImg);
      const response = await axios.post('https://nagaconnect-iitbilai.onrender.com/advertise/addAd', formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      showAlert("Advertise added Successfully");
      console.log(response.data);
      setAds([...ads, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting ad:', error);
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`https://nagaconnect-iitbilai.onrender.com/advertise/deleteAd/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAds(ads.filter(ad => ad.advertisement_id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Post an Advertisement
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '24px', marginBottom: '16px' }}
          onClick={handlePostAdClick}
        >
          Post an Advertisement
        </Button>
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Post an Advertisement</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(formSubmit)} style={{ width: '100%', marginTop: '8px' }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="shopName"
                label="Shop Name"
                name="shopName"
                autoComplete="shopName"
                autoFocus
                {...register("shopName")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="shopLocation"
                label="Shop Location"
                name="shopLocation"
                autoComplete="shopLocation"
                {...register("shopLocation")}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="phoneNumber"
                {...register("phoneNumber")}
              />
              <div className="mb-3">
                <label htmlFor="img">advertise</label>
                <input type="file" name="img" id="image" className="form-control" onInput={handleImg} required></input>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '24px', marginBottom: '16px' }}
              >
                Submit
              </Button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Typography component="h1" variant="h5" gutterBottom>
        Advertisements
      </Typography>
      <Grid container spacing={2}>
        {ads.map((ad) => (
          <Grid item xs={12} key={ad.advertisement_id}>
            <AdCard  ad={ad} onDelete={handleDeleteAd} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Advertise;
