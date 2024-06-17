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
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import AdCard from './AdCard';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

function Advertise() {
  const classes = useStyles();
  const { register, handleSubmit, reset } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:3001/advertise/getUserAds', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAds(response.data);
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
      const response = await axios.post('http://localhost:3001/advertise/addAd', adDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      await axios.delete(`http://localhost:3001/advertise/deleteAd/${id}`, {
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
          className={classes.submit}
          onClick={handlePostAdClick}
        >
          Post an Advertisement
        </Button>
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Post an Advertisement</DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={handleSubmit(formSubmit)}>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
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
            <AdCard ad={ad} onDelete={handleDeleteAd} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Advertise;
