/**
 * @fileOverview timerModal.jsx
 * @abstract timerModal component is used to show the timer modal
 * @author Jason
 * @version 1.0.0
 */
import React from 'react';
import { Modal } from '@mui/material';
import propTypes from 'prop-types';
import dayjs from 'dayjs';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const TimerModal = ({ open, handleClose, hintMessage }) => {
  const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));
  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
            <DateTimePicker
                label="Uncontrolled picker"
                defaultValue={dayjs('2022-04-17T15:30')}
            />
            <DateTimePicker
                label="Controlled picker"
                value={value}
                onChange={(newValue) => setValue(newValue)}
            />
            </DemoContainer>
        </LocalizationProvider>
        );
      </Modal>
  );
};

TimerModal.propTypes = {
  open: propTypes.bool.isRequired,
  handleClose: propTypes.func.isRequired,
  hintMessage: propTypes.string.isRequired
};

export default TimerModal;
