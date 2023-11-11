import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import propTypes from 'prop-types';

// Style for the modal, using the system properties for responsiveness
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto', // Adjust width to be auto, so it will not overflow the viewport
  maxWidth: '100%', // Ensure the modal does not exceed the width of the viewport
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto', // Add scroll if content is larger than the modal
  '&:focus-visible': {
    outline: 'none', // Remove focus outline for accessibility
  },
  // Use MUI's breakpoints for responsiveness
  '@media (max-width:600px)': {
    width: '80%', // On small screens, make the modal width 80% of the viewport
    p: 2, // Reduce padding on small screens
  }
};

const HintModal = ({ open, handleClose, hintMessage }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Hint
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {hintMessage}
        </Typography>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
};

HintModal.propTypes = {
  open: propTypes.bool.isRequired,
  handleClose: propTypes.func.isRequired,
  hintMessage: propTypes.string.isRequired
};

export default HintModal;
