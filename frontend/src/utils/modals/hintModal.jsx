import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import propTypes from 'prop-types';
import style from './modalStyle';

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

export default HintModal;

HintModal.propTypes = {
  open: propTypes.bool.isRequired,
  handleClose: propTypes.func.isRequired,
  hintMessage: propTypes.string.isRequired
};
