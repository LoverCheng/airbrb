import React, { useEffect, useContext } from 'react';
import { Box } from '@mui/system';
import {
  TextField,
  Typography,
  Button,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';

import http from '../../utils/http';
import HintModal from '../../utils/modals/hintModal';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ThumbnailCard from '../../utils/globalComponents/styledThumbnailCard';
import StyledRedButton from './StyledReservedButton';
import fetchBookingListings from '../../utils/asyncUtils/fetchBookingListings';
import propTypes from 'prop-types';
import commentContext from './commentContext';

const ReservedThumbComponent = ({
  rangeSelected, countDays, dateRange,
  handleDateChange, isDateEnabled,
  handleClearDates, handleReserveButton,
  cardData,
}) => {
  const token = localStorage.getItem('token');
  const [commentValue, setCommentValue] = React.useState('');
  const [bookingDetails, setBookingDetails] = React.useState([]);
  const [commentPriority, setCommentPriority] = React.useState(false);
  const [ratingValue, setRatingValue] = React.useState(0);
  const [bookingID, setBookingID] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [hintMessage, setHintMessage] = React.useState('');
  const { commentsSetters } = useContext(commentContext);
  const handleCloseModal = () => {
    setModalOpen(false);
  }
  const handleCommentButton = (comment, cardData) => {
    const listingID = cardData.id;
    if (!commentPriority) {
      setHintMessage('please reserve first');
      setModalOpen(true);
      return;
    } else if (comment === '') {
      setCommentValue('');
      setHintMessage('must provide review content');
      setModalOpen(true);
      return;
    } else if (comment.trim() === '') {
      setCommentValue('');
      setHintMessage('do not submit empty review');
      setModalOpen(true);
      return;
    }
    const body = {
      review: {
        comment,
        rating: ratingValue,
      }
    };
    http.put(`listings/${listingID}/review/${bookingID}`, body)
      .then((response) => {
        setHintMessage('review submitted');
        setModalOpen(true);
        setRatingValue(0);
        setCommentValue('');
        commentsSetters.setReviews((previous) => {
          return [...previous, body.review];
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchBookingListings().then((bookings) => {
      setBookingDetails(bookings);
    });
  }, []);

  useEffect(() => {
    if (bookingDetails.length === 0) return;
    for (const booking of bookingDetails) {
      if (
        String(booking.owner) === localStorage.getItem('user') &&
        String(booking.listingId) === String(cardData.id) &&
        cardData.status === 'accepted'
      ) {
        setCommentPriority(true);
        setBookingID(booking.id);
        return;
      }
    }
  }
  , [bookingDetails]);

  return (
    <>
      <HintModal
        open={modalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
      <ThumbnailCard
      // userSelect='all'
      sx={{
        display: 'block',
        minWidth: '400px',
        marginBottom: '2%',
        marginLeft: '20px',
        '@media (max-width: 850px)': {
          marginTop: '20px',
          maxWidth: '400px',
          marginLeft: '0px',
        },
      }}>
      {
        rangeSelected
          ? <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontWeight: 'lighter',
              textAlign: 'center',
              marginTop: '10px',
            }}
          >
            {`$${
              countDays(dateRange.startDate, dateRange.endDate) * cardData.price
              } AUD total`
            }
          </Typography>
          : <Typography
        variant="h5"
        color="text.secondary"
        sx={{
          fontWeight: 'lighter',
          textAlign: 'center',
          marginTop: '10px',
        }}
      >
        Add dates for prices
      </Typography>
      }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          margin: '20px 10px',
          '@media (max-width: 650px)': {
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%', // Changed to 100% for full width
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check In"
              value={dateRange.startDate}
              onChange={(newDate) => handleDateChange(newDate, true)}
              // Ensure that the start date cannot be after the end date
              maxDate={dateRange.endDate || undefined}
              shouldDisableDate={date => !isDateEnabled(date)}
              // Ensure that the start date cannot be before today
              renderInput={(params) => <TextField {...params} />}
              sx={{
                marginRight: '10px',
                '@media (max-width: 650px)': {
                  minWidth: 160,
                },
              }}
            />
            <DatePicker
              label="Check out"
              value={dateRange.endDate}
              onChange={(newDate) => handleDateChange(newDate, false)}
              shouldDisableDate={date => !isDateEnabled(date)}
              // Ensure that the end date cannot be before the start date
              minDate={dateRange.startDate || undefined}
              renderInput={(params) => <TextField {...params} />}
              sx={{
                '@media (max-width: 650px)': {
                  minWidth: 160,
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        {
        token
          ? <Box
              sx={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Button
                variant="outlined"
                onClick={handleClearDates}
                sx={{
                  textTransform: 'none',
                }}
              >
                Clear Dates
              </Button>
              <StyledRedButton
                onClick={handleReserveButton}
              >
                Reserve
              </StyledRedButton>
            </Box>
          : <Box
              sx={{
                marginTop: '20px',
              }}>
              <Button
                sx={{
                  color: 'rgb(210, 55, 85)',
                  // background: 'rgb(210, 55, 85)'
                }}
                variant="outlined"
                disabled
              >
                Please login to Reserve
              </Button>
            </Box>
        }
      </Box>
      <Box
        sx={{
          borderTop: '1px solid #e4e4e4',
          // marginBottom: '10px', // Increase bottom margin
        }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontWeight: 'lighter',
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          {
            commentPriority
              ? 'Leave a comment'
              : 'Please reserve first'
          }
        </Typography>
        <Box
        sx={{
          marginLeft: '10px',
        }}
        >
          <Rating
            name="controlled-rating"
            value={ratingValue}
            disabled={!commentPriority}
            onChange={(event, newValue) => {
              setRatingValue(newValue);
            }}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
          />
        </Box>
        <TextField
          sx={{
            width: 'calc(100% - 20px)',
            height: 'auto',
            // marginTop: '10px',
            margin: '0 10px 5px 10px',
          }}
          multiline
          rows={3}
          variant="outlined"
          value={commentValue}
          disabled={!commentPriority}
          placeholder={commentPriority ? 'Leave a comment' : 'Please reserve first'}
          onChange={(e) => {
            setCommentValue(e.target.value);
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              // minWidth: '100%',
            }}
            onClick={() => {
              setCommentValue('');
            }}
          >Clear Text</Button>
          <StyledRedButton
            sx={{
              // minWidth: '100%',
            }}
            onClick={() => {
              handleCommentButton(commentValue, cardData);
            }}
          >Submit</StyledRedButton>
        </Box>
      </Box>
      </ThumbnailCard>
    </>
  );
}

export default ReservedThumbComponent;

ReservedThumbComponent.prototype = {
  rangeSelected: propTypes.bool.isRequired,
  countDays: propTypes.func.isRequired,
  dateRange: propTypes.object.isRequired,
  handleDateChange: propTypes.func.isRequired,
  isDateEnabled: propTypes.func.isRequired,
  handleClearDates: propTypes.func.isRequired,
  handleReserveButton: propTypes.func.isRequired,
  cardData: propTypes.object.isRequired,
};
