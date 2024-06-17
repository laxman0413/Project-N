import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  deleteButton: {
    marginLeft: 'auto',
  }
}));

function AdCard({ ad, onDelete }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
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
          className={classes.deleteButton}
          onClick={() => onDelete(ad.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default AdCard;
