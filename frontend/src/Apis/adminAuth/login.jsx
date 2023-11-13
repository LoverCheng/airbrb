import React, { useState } from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import { Button, Box, TextField } from '@mui/material';
import http from '../../utils/http';

const ErrorMessage = styled.p`
  color: red;
`;

const LoginPage = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (event) => {
    // Here, you'd normally make an API call to your backend to authenticate the user
    // For now, we'll just mock an error
    event.preventDefault();
    if (email && password) {
      // Assume registration is successful
      http.post('user/auth/login', {
        email,
        password
      }).then((res) => {
        if (res.token) {
          console.log(`token: ${res.token}`);
          localStorage.setItem('token', res.token);
          onClose();
        } else {
          setErrorMessage(res.error);
        }
      });
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
          width: '100%', // Use 100% of the container width
          // maxWidth: {
          //   xs: '100%', // 100% of the width on extra-small devices
          //   sm: '400px', // 400px on small devices and up
          // },
          minWidth: '90%',
          mx: 'auto', // Horizontally center the Box in the container
          p: 4, // Padding inside the Box
        }}
        noValidate
        autoComplete="off"
      >
        <h2>Login to Airbnb</h2>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
      <Button onClick={(e) => handleLogin(e)}>Login</Button>
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
};

LoginPage.propTypes = {
  onClose: propTypes.func.isRequired,
  style: propTypes.object,
};

export default LoginPage;
