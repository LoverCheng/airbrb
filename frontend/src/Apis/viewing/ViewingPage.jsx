import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@mui/system';
import isWithinInterval from 'date-fns/isWithinInterval';
import parseISO from 'date-fns/parseISO';

import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import styled from '@mui/material/styles/styled';

import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar'
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent'
import SingleCardComponent from '../../utils/globalComponents/singleCardComponent'
import HintModal from '../../utils/modals/hintModal';
import http from '../../utils/http';
import ConfirmModal from '../../utils/modals/confirmModal';
import ReservedThumbComponent from './reservedThumbComponent';
import ThumbnailCard from '../../utils/globalComponents/styledThumbnailCard';
import { countDays } from '../../utils/computingUtils/countDays';
import commentContext from './commentContext';
import computeRating from '../../utils/computingUtils/computeRating';
import { Button } from '@mui/material';

const FlexCenterBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
});

const CommentWrapperCard = styled(ThumbnailCard)({
  minWidth: '800px',
  margin: '10px 20px',
  '@media (max-width: 920px)': {
    maxWidth: '400px',
    minWidth: '400px',
    margin: '20px 0px',
  },
});

const EachCommentBox = styled(Box)({
  // display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  margin: '10px 0px',
  padding: '10px 0px',
  border: '1px solid black',
  borderRadius: '10px',
});

const M20LRBox = styled(Box)({
  margin: '0px 20px',
});

const ViewingPage = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const cardData = location.state;
  const navigate = useNavigate();
  console.log(cardData);
  const [dateRange, setDateRange] = useState(
    { startDate: null, endDate: null },
  );
  const [rangeSelected, setRangeSelected] = useState(false);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const commentsGetters = {
    reviews,
  }
  const commentsSetters = {
    setReviews,
  }
  const handleCloseModal = () => {
    setHintModalOpen(false);
  };

  useEffect(() => {
    setReviews(cardData.reviews);
  }, []);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      setRangeSelected(true);
    } else {
      setRangeSelected(false);
    }
  }, [dateRange]);

  // Function to check if a date should be enabled based on the availability
  const isDateEnabled = (date) => {
    return cardData.availability.some(({ startDate, endDate }) =>
    // e.g. isWithinInterval(date, { start, end: date }) // => true
      isWithinInterval(date, {
        // Parse the given string in ISO 8601 format and return an instance of Date.
        start: parseISO(startDate),
        end: parseISO(endDate),
      })
    );
  };

  const handleDateChange = (date, isStartDate) => {
    const updatedDateRanges = (range) => {
      if (isStartDate) {
        return { ...range, startDate: date, endDate: date > range.endDate ? null : range.endDate };
      } else {
        return { ...range, endDate: date, startDate: date < range.startDate ? null : range.startDate };
      }
    }
    setDateRange(updatedDateRanges);
  };

  const handleClearDates = () => {
    setDateRange({ startDate: null, endDate: null });
  }

  const handleReserveButton = () => {
    console.log('Reserve button clicked');
    if (!token || !rangeSelected) {
      setHintMessage('Please select a date range to reserve');
      setHintModalOpen(true);
      return;
    }
    setConfirmModalOpen(true);
  }

  const handleConfirm = () => {
    const startDate = dateRange.startDate.toISOString().split('T')[0];
    const endDate = dateRange.endDate.toISOString().split('T')[0];
    console.log('startDate', startDate);
    console.log('endDate', endDate);

    http.post(`bookings/new/${cardData.id}`, {
      dateRange: { startDate, endDate },
      totalPrice: countDays(dateRange.startDate, dateRange.endDate) * cardData.price,
    }).then((response) => {
      if (response.error) {
        setHintMessage(response.error);
        setHintModalOpen(true);
      } else {
        setHintMessage('Booking successful!');
        setConfirmModalOpen(false);
        setHintModalOpen(true);
      }
    }).catch((error) => {
      setHintMessage(error);
      setHintModalOpen(true);
    });
  }

  const handleBackButton = () => {
    navigate('/');
  }

  return (
    <>
      <commentContext.Provider value={{ commentsGetters, commentsSetters }}>
        <PrimarySearchAppBar />
        <Box sx={{ padding: '2% 5%', position: 'relative' }}>
          <WelcomeTitle extraInfo={ '' }/>
          <Button
            sx={{
              position: 'absolute',
              right: '5%',
              color: 'gray',
              top: '0%',
              textTransform: 'none'
            }}
            // not upper case
            onClick={handleBackButton}
          >
            Back to home page
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <SingleCardComponent
              cardData={cardData}
              ratingValue={computeRating(reviews)}
              useDateRange={cardData.useDateRange}
            />
            <ReservedThumbComponent
              rangeSelected={rangeSelected}
              countDays={countDays}
              dateRange={dateRange}
              handleDateChange={handleDateChange}
              isDateEnabled={isDateEnabled}
              handleClearDates={handleClearDates}
              handleReserveButton={handleReserveButton}
              cardData={cardData}
            />
          </Box>
          <FlexCenterBox>
            <CommentWrapperCard>
              <M20LRBox>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 'bolder',
                    marginTop: '10px',
                  }}
                >
                  Your booking history:
                </Typography>
                  {token && cardData.bookings.map((booking, index) => (
                    <EachCommentBox key={'booking' + index}>
                      <M20LRBox>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{
                            fontWeight: 'lighter',
                            marginTop: '10px',
                          }}
                        >
                          {`Time: ${booking.dateRange.startDate} - ${booking.dateRange.endDate}`}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{
                            fontWeight: 'lighter',
                            marginTop: '10px',
                          }}
                        >
                          status: {booking.status}
                        </Typography>
                      </M20LRBox>
                    </EachCommentBox>
                  ))}
              </M20LRBox>
            </CommentWrapperCard>
          </FlexCenterBox>
          <FlexCenterBox>
            <CommentWrapperCard>
              <M20LRBox>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 'bolder',
                    marginTop: '10px',
                  }}
                >
                  Comments:
                </Typography>
                  {
                    reviews.map((reserving, index) => (
                      <EachCommentBox key={index}>
                        <M20LRBox>
                          <Rating
                            name="controlled-rating"
                            value={reserving.rating}
                            disabled={true}
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                              fontWeight: 'lighter',
                              marginTop: '10px',
                            }}
                          >
                            {`${reserving.comment}`}
                          </Typography>
                        </M20LRBox>
                      </EachCommentBox>
                    ))
                  }
              </M20LRBox>
            </CommentWrapperCard>
          </FlexCenterBox>
        </Box>
        <HintModal
          open={hintModalOpen}
          handleClose={handleCloseModal}
          hintMessage={hintMessage}
        />
        <ConfirmModal
          confirmModalOpen={confirmModalOpen}
          handleConfirm={handleConfirm}
          setConfirmModalOpen={setConfirmModalOpen}
          dateRange={dateRange}
        />
      </commentContext.Provider>
    </>
  )
}

export default ViewingPage;
