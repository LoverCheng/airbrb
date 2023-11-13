/**
 * Register page for admin
 * @module RegisterPage
 */
import React, { useState } from 'react';
import { Button, Box, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import propTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import http from '../../utils/http';

const styleFormControl = {
  pt: 2
}

const RegisterPage = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const handleRegister = (event) => {
    event.preventDefault();
    if (email && password && username && !passwordConfirmError) {
      // Assume registration is successful
      http.post('user/auth/register', {
        email,
        password,
        name: username
      }).then((res) => {
        if (res.token) {
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

  const checkPasswordConfirmation = () => {
    if (passwordConfirmation && password !== passwordConfirmation) {
      setPasswordConfirmError(true);
    } else {
      setPasswordConfirmError(false);
    }
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 }
      }}
      noValidate
      autoComplete="off"
    >
      {errorMessage &&
        <styleFormControl>
          {errorMessage}
        </styleFormControl>
      }
      <h2>Register to Airbnb</h2>
      <Stack sx={ styleFormControl }>
        <FormControl>
          <InputLabel htmlFor="email">email</InputLabel>
          <OutlinedInput
            required
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="password">password</InputLabel>
          <OutlinedInput
            required
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            onBlur={checkPasswordConfirmation}
          />
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="confirmed-password">confirm</InputLabel>
          <OutlinedInput
            id="confirmed-password"
            label="confirm password"
            type='password'
            aria-describedby="password-confirm-error-text"
            error={passwordConfirmError}
            value={passwordConfirmation}
            onBlur={checkPasswordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          {passwordConfirmError && (
            <FormHelperText
              id="password-confirm-error-text"
              sx={{ color: 'red' }}>
              Password not same
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="username">username</InputLabel>
          <OutlinedInput
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
          />
        </FormControl>
      </Stack>
    <Button onClick={(e) => handleRegister(e)}>Register</Button>
    <Button onClick={onClose}>Close</Button>
  </Box>
  );
};

RegisterPage.propTypes = {
  onClose: propTypes.func.isRequired,
};

export default RegisterPage;
