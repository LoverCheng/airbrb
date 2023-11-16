import React from 'react';

import {
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ThumbnailCard from '../../utils/globalComponents/styledThumbnailCard';
import HintModal from '../../utils/modals/hintModal';
import http from '../../utils/http';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  // only one slide will be displayed at a time
  slidesToShow: 1,
  // carousel will move one slide at a time
  slidesToScroll: 1,
};

const BookingInfoComponent = ({ cardData }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [hintMessage, setHintMessage] = React.useState('');
  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleAccept = (booking) => {
    http.put(`bookings/accept/${booking.id}`).then((res) => {
      if (res.error) {
        setHintMessage(res.error);
        setModalOpen(true);
      } else {
        setHintMessage('Accept successfully');
        booking.status = 'accepted';
        setModalOpen(true);
      }
    });
  }

  const handleDecline = (booking) => {
    http.put(`bookings/decline/${booking.id}`).then((res) => {
      if (res.error) {
        setHintMessage(res.error);
        setModalOpen(true);
      } else {
        setHintMessage('Reject successfully');
        booking.status = 'rejected';
        setModalOpen(true);
      }
    });
  }

  return (
    <>
      <HintModal
        open={modalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
      <Box
        sx={{
          display: 'block',
          flexDirection: 'row',
          margin: '20px',
          '@media (max-width: 650px)': {
            display: 'block',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold' }}
        >
          Booking Requests:
        </Typography>
        {cardData.bookings.map((booking, index) => (
          <ThumbnailCard
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              // This ensures that child elements will stretch to fit the container's height
              alignItems: 'stretch',
              maxWidth: 800,
              margin: '0 auto 10px auto',
              // Change to block display under 650px
              // alignItems: 'center',
              '@media (max-width: 650px)': {
                display: 'block',
                maxWidth: 400,
                // margin: 'auto',
              },
            }}
          >
              <Box
                sx={{
                  width: '50%', // Control the width of the slider container
                  height: '50%', // Height will adjust to content
                  margin: '10px 40px',
                  '@media (max-width: 650px)': {
                    width: '100%',
                    margin: 'auto',
                  },
                }}
              >
                <Slider {...settings}>
                  {/* concat the image of images and thumbnail */}
                    {[cardData.thumbnail]
                      .concat(cardData.metadata.images)
                      .map((image, index) => (
                      <Box
                        key={index}
                        sx={{ width: '100%' }}>
                        <CardMedia
                          component="img"
                          height="250px"
                          image={image}
                          alt={`Image ${index}`}
                        />
                      </Box>
                      ))}
                </Slider>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
              }}>
                <CardContent>
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Status: {booking.status}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Request User:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {`${booking.owner}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      width: '90%',
                      fontWeight: 'bold',
                    }}
                  >
                    {`Earn:  ${booking.totalPrice} $`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      width: '90%',
                      // bold
                      fontWeight: 'bold',
                    }}
                  >
                    {'Date range: '}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      width: '90%',
                      // bold
                      fontWeight: 'bold',
                    }}
                  >
                    {booking.dateRange.startDate} to {booking.dateRange.endDate}
                  </Typography>
                  { booking.status === 'pending' &&
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                      <Button onClick={() => handleAccept(booking)}>Accept</Button>
                      <Button onClick={() => handleDecline(booking)}>Decline</Button>
                    </Box>
                  }
                </CardContent>
              </Box>
          </ThumbnailCard>
        ))}
      </Box>
    </>
  )
}

export default BookingInfoComponent;

BookingInfoComponent.propTypes = {
  cardData: PropTypes.object.isRequired,
};
