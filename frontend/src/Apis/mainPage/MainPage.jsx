import React, { useEffect, useState } from 'react';

// import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { Grid } from '@mui/material';

import PrimarySearchAppBar from './navigationComponents/navigationBar';
import http from '../../utils/http';

const FavoriteIconButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
  color: 'white',
  margin: '16px', // assuming you want a 16px margin; adjust as needed
  // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
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

const MainPage = () => {
  const [listings, setListings] = useState([]);
  const handleFavoriteClick = (id) => {
    // Handle the click event for the favorite icon
    console.log('Favorite clicked for listing:', id);
  };

  useEffect(() => {
    // Define an async function inside the effect
    const fetchListings = async () => {
      try {
        // Await the HTTP get request
        const response = await http.get('listings');
        // Set the listings in state
        setListings(response.listings);
        // console.log(response);
        // console.log(listings);
        // console.log(typeof response.listings);
      } catch (error) {
        // If there's an error, log it
        console.error('Failed to fetch listings:', error);
      }
    };

    // Call the async function
    fetchListings();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <PrimarySearchAppBar />
      <Box sx={{ padding: '20px', display: 'flex' }}>

        <StyledGridContainer spacing={{ xs: 2, sm: 3, md: 4 }}>
          <StyledGridItem item xs={12} sm={6} md={4} lg={3}>
            <ThumbnailCard>
              <CardMedia
                component="img"
                height="194"
                image="https://mui.com/static/images/cards/paella.jpg"
                alt="Paella dish"
                sx= {{ position: 'relative' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal to cook
                  together with your guests. Add 1 cup of frozen peas along with the mussels,
                  if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <FavoriteIconButton
                  aria-label="add to favorites"
                  onClick={handleFavoriteClick}
                >
                  <FavoriteIcon />
                </FavoriteIconButton>
              </CardActions>
            </ThumbnailCard>
          </StyledGridItem>

          <StyledGridItem item xs={12} sm={6} md={4} lg={3}>
            <ThumbnailCard>
              <CardMedia
                component="img"
                height="194"
                image="https://mui.com/static/images/cards/paella.jpg"
                alt="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal to cook
                  together with your guests. Add 1 cup of frozen peas along with the mussels,
                  if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <FavoriteIconButton
                  aria-label="add to favorites"
                  onClick={handleFavoriteClick}
                >
                  <FavoriteIcon />
                </FavoriteIconButton>
              </CardActions>
            </ThumbnailCard>
          </StyledGridItem>

          <StyledGridItem item xs={12} sm={6} md={4} lg={3}>
            <ThumbnailCard>
              <CardMedia
                component="img"
                height="194"
                image="https://mui.com/static/images/cards/paella.jpg"
                alt="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This impressive paella is a perfect party dish and a fun meal to cook
                  together with your guests. Add 1 cup of frozen peas along with the mussels,
                  if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <FavoriteIconButton
                  aria-label="add to favorites"
                  onClick={handleFavoriteClick}
                >
                  <FavoriteIcon />
                </FavoriteIconButton>
              </CardActions>
            </ThumbnailCard>
          </StyledGridItem>
          {listings.map((listing) => (
            <StyledGridItem key={listing.id} item xs={12} sm={6} md={4} lg={3}>
              <ThumbnailCard>
                <CardMedia
                  component="img"
                  height="194"
                  image={listing.thumbnail} // Assuming this is a URL to the image
                  alt={listing.title}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {`${listing.address.street}, ${listing.address.city}, ${listing.address.state}, ${listing.address.postcode}, ${listing.address.country}`}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <FavoriteIconButton
                    aria-label="add to favorites"
                    onClick={() => handleFavoriteClick(listing.id)}
                  >
                    <FavoriteIcon/>
                  </FavoriteIconButton>
                </CardActions>
              </ThumbnailCard>
            </StyledGridItem>
          ))}
        </StyledGridContainer>
      </Box>
    </>
  );
};

export default MainPage;
