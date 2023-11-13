/**
 * @name ListingPush.jsx
 * @fileOverview This file contains the ListingPush component.
 * @abstract ListingPush component is used to show the listing information in public
 * @bonus User can only select the date range
 *        that is not overlapped with the existing date range
 */
import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import {
  Typography,
  Button,
  IconButton,
  TextField
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import HintModal from '../../utils/modals/hintModal';

import http from '../../utils/http';
import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent';
import SingleCardComponent from '../../utils/globalComponents/singleCardComponent';

const ListingForm = () => {
  const ratingValue = 4;
  const location = useLocation();
  const navigate = useNavigate();
  const cardData = location.state;
  const info = 'Please fill the time range for your listing.';
  const [dateRanges, setDateRanges] = useState([
    { id: 'range1', startDate: null, endDate: null },
  ]);
  const [maxDateRange, setMaxDateRange] = useState(dateRanges.length);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');

  // Function to handle the publish action
  const handlePublish = () => {
    console.log(dateRanges);
    if (dateRanges.length === 0) {
      setHintMessage('Please add at least one date range');
      setHintModalOpen(true);
      return;
    }
    const hasIncompleteRange = dateRanges.some((range) => {
      return range.startDate === null || range.endDate === null;
    })
    if (hasIncompleteRange) {
      setHintMessage('Please fill in all the date ranges');
      setHintModalOpen(true);
      return;
    }
    http.put(`listings/publish/${cardData.id}`, {
      availability: dateRanges.map((range) => ({
        startDate: range.startDate.toISOString().split('T')[0],
        endDate: range.endDate.toISOString().split('T')[0]
      }))
    }).then((response) => {
      if (response.error) {
        setHintMessage(response.error);
        setHintModalOpen(true);
        return;
      }
      console.log(response);
      setHintMessage('Publish successfully!');
      setHintModalOpen(true);
      navigate('/listings/hosted');
    }).catch((error) => {
      console.log(error);
      setHintMessage('Publish failed!');
      setHintModalOpen(true);
    });
  };

  // Function to handle adding a new date range
  const handleAddDateRange = () => {
    const newRange = {
      // id: `range${dateRanges.length + 1}`,
      id: `range${maxDateRange + 1}`,
      startDate: null,
      endDate: null
    };
    setDateRanges([...dateRanges, newRange]);
    setMaxDateRange(maxDateRange + 1);
  };

  // Function to handle date change
  const handleDateChange = (rangeId, date, isStartDate) => {
    const updatedDateRanges = dateRanges.map((range) => {
      if (range.id === rangeId) {
        if (isStartDate) {
          return { ...range, startDate: date, endDate: date > range.endDate ? null : range.endDate };
        } else {
          return { ...range, endDate: date, startDate: date < range.startDate ? null : range.startDate };
        }
      }
      return range;
    });
    setDateRanges(updatedDateRanges);
  };

  // Function to handle deleting a date range
  const handleDeleteDateRange = (rangeId) => {
    const updatedDateRanges = dateRanges.filter(range => range.id !== rangeId);
    setDateRanges(updatedDateRanges);
  };

  const handleCloseModal = () => {
    setHintModalOpen(false);
  };

  const handleClosePage = () => {
    navigate('/listings/hosted');
  }

  return (
    <>
      <HintModal
        open={hintModalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
      <PrimarySearchAppBar />
      <Box sx={{ padding: '2% 5%' }}>
        <WelcomeTitle extraInfo={ info }/>
        <SingleCardComponent
          cardData={cardData}
          ratingValue={ratingValue}
          useDateRange={false}
        />
      </Box>

      <Box sx={{
        padding: '2% 5%',
        display: 'flex',
        flexDirection:
        'column',
        alignItems: 'center',
      }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {dateRanges.map((rangeTime, index) => (
            <Box key={rangeTime.id} sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}>
              <Typography
                sx={{
                  marginRight: '10px'
                }}>
                {`Time Slot ${index + 1}`}
              </Typography>
              <DatePicker
                label="Start Date"
                value={rangeTime.startDate}
                onChange={(newDate) => handleDateChange(rangeTime.id, newDate, true)}
                // Ensure that the start date cannot be after the end date
                maxDate={rangeTime.endDate || undefined}
                // Ensure that the start date cannot be before today
                renderInput={(params) => <TextField {...params} />}
                sx={{ marginRight: '10px' }}
              />
              <Typography sx={{ marginRight: '10px' }}>to</Typography>
              <DatePicker
                label="End Date"
                value={rangeTime.endDate}
                onChange={(newDate) => handleDateChange(rangeTime.id, newDate, false)}
                // Ensure that the end date cannot be before the start date
                minDate={rangeTime.startDate || undefined}
                renderInput={(params) => <TextField {...params} />}
              />
              <IconButton onClick={() => handleDeleteDateRange(rangeTime.id)} sx={{ marginLeft: '10px' }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddDateRange} sx={{ marginBottom: '20px' }}>
              Add Available Date
          </Button>
        </LocalizationProvider>
    </Box>
      <Box sx={{ mt: '20px', display: 'flex', justifyContent: 'space-around' }}>
        <Button variant="contained" onClick={handlePublish}>
          Publish
        </Button>
        <Button variant="contained" onClick={ handleClosePage }>
          Close
        </Button>
      </Box>
    </>
  );
}

export default ListingForm;
