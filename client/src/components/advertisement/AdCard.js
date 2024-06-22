import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, CardMedia } from '@mui/material';

function AdCard({ ad, onDelete }) {
  const styles = {
    card: {
      marginBottom: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      maxWidth: '345px',
      borderRadius: '8px',
    },
    media: {
      height: 140,
    },
    deleteButton: {
      marginLeft: 'auto',
    },
    content: {
      textAlign: 'left',
    },
  };

  // Fallback image URL
  const fallbackImageUrl = 'https://via.placeholder.com/140';
  return (
    <Card style={styles.card}>
      <CardMedia
        style={styles.media}
        image={ad.images || fallbackImageUrl}
        title={ad.shop_name}
      />
      <CardContent style={styles.content}>
        <Typography variant="h5">{ad.shop_name}</Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Location:</strong> {ad.shop_location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Phone:</strong> {ad.phone_number}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Name:</strong> {ad.shop_name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="secondary"
          style={styles.deleteButton}
          onClick={() => onDelete(ad.advertisement_id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default AdCard;
