// UserForm.js
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Button, Box, TextField } from '@mui/material';

const UserForm = ({ onSubmit, buttonText, children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' }, // Adjust the margin and width as needed
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
        />
      </div>
      {children} {/* Place for additional fields */}
      <Button variant="contained" onClick={() => onSubmit(email, password)}>
        {buttonText}
      </Button>
    </Box>
  );
};

UserForm.propTypes = {
  onSubmit: propTypes.func.isRequired,
  buttonText: propTypes.string.isRequired,
  children: propTypes.node,
};

export default UserForm;
