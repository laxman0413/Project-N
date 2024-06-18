import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

function AdCard({ ad, onDelete }) {
  const styles = {
    card: {
      marginBottom: '16px',
      padding: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    deleteButton: {
      marginLeft: 'auto',
    }
  };

  return (
    <Card style={styles.card}>
      <CardContent>
        <Typography variant="h6">{ad.shop_name}</Typography>
        <Typography variant="body2" color="textSecondary">
          Location: {ad.shop_location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Phone: {ad.phone_number}
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
