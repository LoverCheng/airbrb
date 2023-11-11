import React from 'react';
import { Paper, Typography } from '@mui/material';

const WelcomeTitle = () => {
  return (
      <Paper elevation={0} sx={{ margin: '20px' }}>
      <Typography variant="h4">Welcome!</Typography>
      <Typography variant="body1" sx={{ marginBottom: '25px', color: 'gray', fontWeight: 'light' }}>
        Guests can reserve your place 24 hours after you publish.
      </Typography>
      </Paper>
  )
}

export default WelcomeTitle;
