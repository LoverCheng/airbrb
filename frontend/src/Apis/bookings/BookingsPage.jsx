import React from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/system';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  CardContent,
  Typography,
} from '@mui/material';

import calculateTotalAcceptedDays from '../../utils/computingUtils/totalAcceptedDays';
import ThumbnailCard from '../../utils/globalComponents/styledThumbnailCard';
import { countDays } from '../../utils/computingUtils/countDays';
import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent';
import BookingInfoComponent from './BookingInfoComponent';
import SingleCardComponent from '../../utils/globalComponents/singleCardComponent';

function calculateTotalPriceThisYear (bookings) {
  const currentYear = new Date().getFullYear();
  let totalPrice = 0;

  bookings.forEach(booking => {
    if (booking.status === 'accepted') {
      const startDate = new Date(booking.dateRange.startDate);
      const endDate = new Date(booking.dateRange.endDate);

      // Check if the booking is within the current year
      if (startDate.getFullYear() === currentYear ||
        endDate.getFullYear() === currentYear) {
        totalPrice += booking.totalPrice;
      }
    }
  });

  return totalPrice;
}

const BookingsPage = () => {
  const location = useLocation();
  const cardData = location.state;
  console.log('cardData');
  console.log(cardData);
  const extraInfo = 'You can view your bookings request here';
  return (
    <>
      <PrimarySearchAppBar />
      <Box sx={{ padding: '2% 5%' }}>
        <WelcomeTitle extraInfo= {extraInfo} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2%',
            '@media (max-width: 650px)': {
              flexDirection: 'column',
            },
          }}
        >
          <SingleCardComponent cardData={cardData} />
          <ThumbnailCard
            sx={{
              display: 'block',
              // position: 'fixed',
              maxWidth: 400,
              minWidth: 300,
              // margin: 'auto',
              marginTop: '20px',
              // Change to block display under 650px
              alignItems: 'center',
              marginLeft: '20px',
              '@media (max-width: 650px)': {
                maxWidth: 400,
                margin: '20px auto',
              },
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <CardContent>
                <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{ width: '90%' }}
                >
                  Listing Info
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: '90%' }}
                  fontWeight={600}
                >
                  Online Time: {countDays(cardData.postedOn, new Date())} days.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ width: '90%' }}
                >
                  Booked Days:{calculateTotalAcceptedDays(cardData.bookings)} days.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ width: '90%' }}
                >
                  Total profits this year: {calculateTotalPriceThisYear(cardData.bookings)}$
                </Typography>
              </CardContent>
            </Box>
          </ThumbnailCard>
        </Box>
        <BookingInfoComponent cardData={cardData} />
      </Box>
    </>
  );
}

export default BookingsPage;
