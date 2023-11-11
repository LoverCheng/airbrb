import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';

import http from '../../utils/http';
import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import WelcomeTitle from './components/welcomeTitleComponent';
import HintModal from '../../utils/hintModal';

// const FavoriteIconButton = styled(IconButton)({
//   position: 'absolute',
//   top: 0,
//   right: 0,
//   color: 'white',
//   margin: '16px', // assuming you want a 16px margin; adjust as needed
//   // backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   '&:hover': {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
// });

const UnderLinedText = styled(Typography)({
  textDecoration: 'underline',
});

const ThumbnailCard = styled(Card)({
  maxWidth: 345,
  position: 'relative',
  borderRadius: '10px', // This will give you rounded corners
  m: 'auto',
});

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  // Add any additional styles we want for the container
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

const fetchListings = async () => {
  try {
    // Await the HTTP get request
    const response = await http.get('listings');
    // Set the listings in state
    return response.listings;
  } catch (error) {
    // If there's an error, log it
    console.error('Failed to fetch listings:', error);
  }
};

const fetchListingDetails = async (id) => {
  try {
    const additionalInfo = await http.get(`listings/${id}`);
    return additionalInfo.listing;
  } catch (error) {
    console.error(`Failed to fetch additional info for ${id}:`, error);
    return null; // Or handle the error as you see fit
  }
};

const ListingsHosted = () => {
  // const [listings, setListings] = useState([]);
  // const handleFavoriteClick = (id) => {
  //   // Handle the click event for the favorite icon
  //   console.log('Favorite clicked for listing:', id);
  // };
  const [detailedListings, setDetailedListings] = useState([]);
  const ratingValue = 2.4;
  const [modalOpen, setModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');

  const handleDelete = async (id) => {
    // Handle the delete action (e.g., remove the card)
    console.log(`Delete button clicked, ID is ${id}`);
    const response = await http.delete(`listings/${id}`);
    if (response.error) {
      setHintMessage(response.error);
      setModalOpen(true);
      console.log(response.error);
      return;
    }
    const updatedListings = detailedListings.filter((listing) => listing.id !== id);
    setDetailedListings(updatedListings);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchAllListingsAndDetailsSequentially = async () => {
      try {
        // Fetch all listings first
        const listings = await fetchListings();
        if (listings) {
          // Set the listings in state
          // setListings(listings);

          // Iterate over the listings and fetch details for each one sequentially
          for (const listing of listings) {
            const details = await fetchListingDetails(listing.id);
            // console.log(details);
            // Immediately update the state with the new details
            setDetailedListings((prevDetailedListings) => {
              // console.log(details.listing);
              // console.log(details);
              // const d = details.listing;
              const metadata = details.metadata;
              const result = [...prevDetailedListings, { ...listing, metadata }]
              console.log('result');
              console.log(result);
              return result;
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };
    fetchAllListingsAndDetailsSequentially();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <HintModal
        open={modalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
      <PrimarySearchAppBar />
      <Box sx={{ padding: '2% 5%' }}>
        <WelcomeTitle/>
        <Box sx={{ padding: '20px', display: 'flex' }}>
          <StyledGridContainer spacing={{ xs: 2, sm: 3, md: 4 }}>
            <StyledGridItem item xs={12} sm={6} md={4} lg={3}>
              <ThumbnailCard
                sx={{
                  cursor: 'pointer'
                }}
              >
                <CardMedia
                  component="img"
                  height="194"
                  image="https://mui.com/static/images/cards/paella.jpg"
                  alt="Paella dish"
                />
                <CardContent>
                  <Rating
                    name="controlled-rating"
                    value={ratingValue}
                    readOnly
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />
                  <Typography variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {/* <FavoriteIconButton
                    aria-label="add to favorites"
                    onClick={handleFavoriteClick}
                  >
                    <FavoriteIcon />
                  </FavoriteIconButton> */}
                </CardActions>
              </ThumbnailCard>
            </StyledGridItem>
            {detailedListings.map((listing) => (
              // fetchListingDetails(listing);
              <StyledGridItem key={listing.id} item xs={12} sm={6} md={4} lg={3}>
                <ThumbnailCard
                  sx={{
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <DeleteButton onClick={() => handleDelete(listing.id)}>
                    <DeleteIcon />
                  </DeleteButton>
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
                  <CardActions disableSpacing>
                    {/* <FavoriteIconButton
                      aria-label="add to favorites"
                      onClick={() => handleFavoriteClick(listing.id)}
                    >
                      <FavoriteIcon/>
                    </FavoriteIconButton> */}
                  </CardActions>
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
