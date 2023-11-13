/**
 * @fileOverview Welcome title component
 * @author <Jason>
 * @version 1.0.0
 * @abstract Component for the welcome title
 */
import React from 'react';
import { Paper, Typography } from '@mui/material';
import propTypes from 'prop-types';

const WelcomeTitle = (extraInfo) => {
  const info = extraInfo.extraInfo;
  return (
      <Paper elevation={0} sx={{ margin: '20px' }}>
      <Typography variant="h4">Welcome!</Typography>
      <Typography variant="body1" sx={{ marginBottom: '25px', color: 'gray', fontWeight: 'light' }}>
        {/* Guests can reserve your place 24 hours after you publish. */}
        <br />
        { info }
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '25px', color: 'gray', fontWeight: 'light' }}>
      </Typography>
      </Paper>
  )
}

WelcomeTitle.propTypes = {
  extraInfo: propTypes.string
};

export default WelcomeTitle;
