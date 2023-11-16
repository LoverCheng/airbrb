/**
 * @fileOverview SingleCardComponent is a component that renders a vertical single card
 * @see https://mui.com/components/cards/#customization
 * @author Jason
 * @version 1.0.0
 */
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Box } from '@mui/system';
import {
  Rating,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PropTypes from 'prop-types';

import ThumbnailCard from './styledThumbnailCard';
import UnderLinedText from './styledUnderlinedText';

const SingleCardComponent = ({ cardData, ratingValue, useDateRange }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    // only one slide will be displayed at a time
    slidesToShow: 1,
    // carousel will move one slide at a time
    slidesToScroll: 1,
    // NextArrow: <NextArrow />,
    // PrevArrow: <PrevArrow />,
  };
  return (
    <>
      <ThumbnailCard
          sx={{
            display: 'block',
            // position: 'fixed',
            maxWidth: 400,
            // margin: 'auto',
            marginBottom: '2%',
            // Change to block display under 650px
            alignItems: 'center',
            '@media (max-width: 650px)': {
              maxWidth: 400,
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
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <CardContent>
              <Rating
                name="controlled-rating"
                value={ratingValue}
                readOnly
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold' }}
              >
                {`${cardData.title}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`🚪: ${cardData.metadata.bedrooms.length}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`🛌: 
                  ${cardData.metadata.bedrooms.reduce(
                    (acc, cur) => parseInt(acc) + parseInt(cur.beds), 0
                    )
                  }`
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`🏡: ${cardData.address.street}, 
                    ${cardData.address.city}, 
                    ${cardData.address.state}, 
                    ${cardData.address.postcode}, 
                    ${cardData.address.country}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Property Type: ${cardData.metadata.propertyType}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`💬  ${cardData.reviews.length}`}
              </Typography>
              <Typography variant="body2" color="text.secondary"></Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ width: '90%' }}
              >
                {`Amenities:  ${cardData.metadata.amenities}`}
              </Typography>
              <UnderLinedText sx={{ fontWeight: 'bold' }}>
                {`💰💲${cardData.price}`}
                {
                  useDateRange
                    ? ' price per stay'
                    : ' per night'
                }
              </UnderLinedText>
            </CardContent>
          </Box>
      </ThumbnailCard>
    </>
  )
}

export default SingleCardComponent;

SingleCardComponent.prototype = {
  cardData: PropTypes.object.isRequired,
  ratingValue: PropTypes.number.isRequired,
}
