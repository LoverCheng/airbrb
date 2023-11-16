/**
 * @fileOverview confirmModal component
 * @abstract confirmModal component is used to confirm the booking of a property
 * @see https://mui.com/components/modal/
 * @author Jason
 * @version 1.0.0
 */
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import propTypes from 'prop-types';
import style from './modalStyle';

const ConfirmModal = ({ confirmModalOpen, handleConfirm, setConfirmModalOpen, dateRange }) => {
  return (
    <Modal
      open={confirmModalOpen}
      onClose={() => setConfirmModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <Box
      sx={style}
    >
    <Typography
      id="modal-modal-title"
      variant="h6"
      component="h2"
      sx={{
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      Confirm Booking
    </Typography>
      <Typography
        id="modal-modal-description"
        sx={{
          mt: 2,
          textAlign: 'center',
        }}
      >
          Are you sure you want to book this property
      </Typography>
      <Typography
        id="modal-modal-description"
        sx={{
          mt: 2,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {dateRange &&
          dateRange.startDate && dateRange.endDate &&
        `${dateRange.startDate.toISOString().split('T')[0]} to ${dateRange.endDate.toISOString().split('T')[0]}`
        }
      </Typography>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
      }}
      >
      <Button
        variant="outlined"
        onClick={() => setConfirmModalOpen(false)}
      >
        Cancel
      </Button>
      <Button
        variant="outlined"
        onClick={handleConfirm}
      >
        Confirm
      </Button>
      </Box>
    </Box>
  </Modal>
  );
}

export default ConfirmModal;
ConfirmModal.prototype = {
  confirmModalOpen: propTypes.bool.isRequired,
  handleConfirm: propTypes.func.isRequired,
  setConfirmModalOpen: propTypes.func.isRequired,
  dateRange: propTypes.any.isRequired,
};
