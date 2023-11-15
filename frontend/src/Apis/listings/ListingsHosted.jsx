/**
 * @fileOverview This file is responsible for rendering the
 *               listings that the user has hosted
 * @module ListingsHosted
 */
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import {
  Grid,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
  Box,
  Rating,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';

import http from '../../utils/http';
import fetchAllListingsAndDetailsSequentially from '../../utils/fetchListingsDetails';
import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent';
import HintModal from '../../utils/modals/hintModal';
import ThumbnailCard from '../../utils/globalComponents/styledThumbnailCard';
import UnderLinedText from '../../utils/globalComponents/styledUnderlinedText';

const StyledGridContainer = styled(Grid)(({ theme }) => ({
}));

StyledGridContainer.defaultProps = {
  container: true,
};

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  bottom: 8,
  zIndex: 1 // Make sure this is above all other card contents
}));

const ClockIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 50,
  bottom: 8,
  zIndex: 1 // Make sure this is above all other card contents
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 200,
  zIndex: 1 // Make sure this is above all other card contents
}));

const PostOfficeIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 50,
  top: 200,
  zIndex: 1 // Make sure this is above all other card contents
}));

const ListingsHosted = () => {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();
  const [detailedListings, setDetailedListings] = useState([]);
  const ratingValue = 2.4;
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');

  const handleDelete = async (event, id) => {
    event.stopPropagation();
    // Handle the delete action (e.g., remove the card)
    console.log(`Delete button clicked, ID is ${id}`);
    const response = await http.delete(`listings/${id}`);
    if (response.error) {
      setHintMessage(response.error);
      setHintModalOpen(true);
      console.log(response.error);
      return;
    }
    const updatedListings = detailedListings.filter((listing) => listing.id !== id);
    setDetailedListings(updatedListings);
  };

  const handleClockClick = (event, listing) => {
    event.stopPropagation();
    navigate('/listings/push', { state: { ...listing } });
    console.log('Clock clicked for listing:', listing.id);
  }

  const handleCloseModal = () => {
    setHintModalOpen(false);
  };

  const handleCardClick = (listing) => {
    const listingID = listing.id;
    // Handle the click event for the card
    console.log('Card clicked for listing:', listing.id);
    console.log(listing);
    navigate(`/listings/update?listingId=${listingID}`, { state: { ...listing } });
  };

  const handleUnpublish = (event, listing) => {
    event.stopPropagation();
    http.put(`listings/unpublish/${listing.id}`).then((response) => {
      if (response.error) {
        setHintMessage(response.error);
        setHintModalOpen(true);
        return;
      }
      listing.published = false;
      setHintMessage('Unpublish successfully!');
      setHintModalOpen(true);
    })
  }

  const handleBookings = (event, listing) => {
    event.stopPropagation();
    console.log(listing);
    const listingID = listing.id;
    navigate(`/bookings/view?listingId=${listingID}`, { state: { ...listing } })
  }

  useEffect(() => {
  /**
   * fetch all listings and their details
   */
    fetchAllListingsAndDetailsSequentially(setDetailedListings);
  }, []);

  const extraInfo = 'You can click the card to update your listing';
  return (
    <>
      <HintModal
        open={hintModalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
      <PrimarySearchAppBar />
      <Box sx={{ padding: '2% 5%' }}>
        <WelcomeTitle extraInfo= {extraInfo} />
        <Box sx={{ padding: '20px', display: 'flex' }}>
          <StyledGridContainer spacing={{ xs: 2, sm: 3, md: 4 }}>
            {detailedListings.filter(
              (listing) => listing.owner === user).map((listing) => (
              <StyledGridItem key={listing.id} item xs={12} sm={6} md={4} lg={3}>
                <ThumbnailCard
                  sx={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: listing.published
                      ? 'rgb(255 56 92 / 25%)'
                      : 'default'
                  }}
                  onClick={() => handleCardClick(listing)}
                >

                  {/* Delete */}
                  <Tooltip title="Delete this listing" arrow>
                    <DeleteButton onClick={(event) => handleDelete(event, listing.id)}>
                      <DeleteIcon />
                    </DeleteButton>
                  </Tooltip>

                  {/* Timer */}
                  <Tooltip title="Range availability time and publish" arrow>
                    <ClockIconButton onClick={ (event) => handleClockClick(event, listing)}>
                      <AccessTimeIcon />
                    </ClockIconButton>
                  </Tooltip>
                  {/* Tick */}
                  { listing.published &&
                    listing.availability.length > 0 &&
                    <Tooltip title="unpublished this listing" arrow>
                      <CloseIconButton onClick={ (event) => handleUnpublish(event, listing) }>
                        <CloseIcon sx={{ color: 'black' }} />
                      </CloseIconButton>
                    </Tooltip>
                  }
                  {/* booking messages */}
                  { listing.postedOn
                    ? <Tooltip title="Viewing booking requests" arrow>
                      <PostOfficeIconButton onClick={ (event) => handleBookings(event, listing)}>
                        <Badge badgeContent={listing.bookings.filter(
                          booking => booking.status === 'pending').length}
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: 'rgb(239,54,15)',
                              color: 'white',
                              width: 15, // Adjust the width as needed
                              height: 15, // Adjust the height as needed
                              fontSize: '0.75rem',
                            }
                          }}
                        >
                          <LocalPostOfficeIcon />
                        </Badge>
                      </PostOfficeIconButton>
                    </Tooltip>
                    : <Tooltip title="Please post your property first" arrow>
                          <PostOfficeIconButton onClick={ (event) => { event.stopPropagation(); }}>
                            <LocalPostOfficeIcon />
                          </PostOfficeIconButton>
                        </Tooltip>
                  }

                  <CardMedia
                    component="img"
                    height="194"
                    image={listing.thumbnail} // Assuming this is a URL to the image
                    alt={listing.title}
                  />
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
                      {`${listing.title}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`🚪: ${listing.metadata.bedrooms.length}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`🛌: 
                        ${listing.metadata.bedrooms.reduce(
                          (acc, cur) => parseInt(acc) + parseInt(cur.beds), 0
                          )
                        }`
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`🏡: ${listing.address.street}, 
                          ${listing.address.city}, 
                          ${listing.address.state}, 
                          ${listing.address.postcode}, 
                          ${listing.address.country}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`Property Type: ${listing.metadata.propertyType}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`💬  ${listing.reviews.length}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary"></Typography>
                    <UnderLinedText sx={{ fontWeight: 'bold' }}>
                      {`💰💲${listing.price} per day`}
                    </UnderLinedText>
                  </CardContent>
                </ThumbnailCard>
              </StyledGridItem>
            ))}
          </StyledGridContainer>
        </Box>
      </Box>
    </>
  );
};

export default ListingsHosted;
