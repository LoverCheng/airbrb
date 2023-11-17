import React from 'react';
import { Modal, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MainPage from '../mainPage/MainPage';
import LoginPage from './login';
import RegisterPage from './register';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useResponsiveModalStyle = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '100%' : '90%',
    maxWidth: '300px',
    minWidth: isSmallScreen ? 'none' : '200px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '5%', // Makes the button round like a radio button
  };
};

const LoginModal = ({ open, onClose }) => {
  const style = useResponsiveModalStyle();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <LoginPage onClose={onClose}></LoginPage>
      </Box>
    </Modal>
  );
};

const RegisterModal = ({ open, onClose }) => {
  const style = useResponsiveModalStyle();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <RegisterPage onClose={onClose}></RegisterPage>
      </Box>
    </Modal>
  );
}

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

RegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const ModalWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalType = location.state?.modalType;
  const onClose = () => {
    // Navigate back without modal state
    navigate(-1);
  };

  // This is the state from the location state
  const background = location.state && location.state.background;
  return (
    <>
      {/* Always render the main page as the background */}
      {background && <MainPage />}

      {/* Conditionally render the LoginModal if the modalType is 'login' */}
      {modalType === 'login' && (
        <LoginModal open={true} onClose={onClose} />
      )}

      {/* Conditionally render the RegisterModal if the modalType is 'register' */}
      {modalType === 'register' && (
        <RegisterModal open={true} onClose={onClose} />
      )}
    </>
  );
};
