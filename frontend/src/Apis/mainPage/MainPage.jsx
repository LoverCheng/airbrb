import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Rating,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';

import PrimarySearchAppBar from './navigationComponents/navigationBar';
import fetchAllListingsAndDetailsSequentially from '../../utils/asyncUtils/fetchListingsDetails';
import UnderLinedText from '../../utils/globalComponents/styledUnderlinedText';
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent';
import searchContext from '../searchFilter/searchContext';
import FilterModal from '../searchFilter/searchFilterModal';
import computeRating from '../../utils/computingUtils/computeRating';

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
  const navigate = useNavigate();
  const [detailedListings, setDetailedListings] = useState([]);
  // const [filteredSearch, setFilteredSearch] = useState(false);
  const [searchValueAtSearch, setSearchValueAtSearch] = useState('');
  const [basicSearchValue, setBasicSearchValue] = React.useState('');
  const [filteredListings, setFilteredListings] = useState(detailedListings);
  const [dateRange, setDateRange] = useState(
    { startDate: null, endDate: null },
  );
  const [priceRange, setPriceRange] = useState(
    { minPrice: '', maxPrice: '' },
  );
  const [bedroomRange, setBedroomRange] = useState(
    { minBedrooms: '', maxBedrooms: '' },
  );
  const [useDateRange, setUseDateRange] = useState(false);
  const [ratingOrder, setRatingOrder] = useState('descending');

  useEffect(() => {
    fetchAllListingsAndDetailsSequentially(setDetailedListings).then((result) => {
    });
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const hasStartDate = dateRange.startDate !== null;
    const hasEndDate = dateRange.endDate !== null;
    setUseDateRange(hasStartDate && hasEndDate);
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    // alphabetical order
    // const result = detailedListings.sort((a, b) => a.title.localeCompare(b.title));
    setFilteredListings(detailedListings);
  }, [detailedListings]);

  // const handleBasicSearchClick = (event) => {
  //   event.preventDefault();
  //   // setSearchValueAtSearch(basicSearchValue);
  //   setFilteredListings(basicSearchValue)

  const filterListings = (listings, searchValue, filters) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();

    return listings.filter(listing => {
      console.log('enter filterListings');
      // Text search filter
      const matchesSearch = lowerCaseSearchValue.trim() === '' ||
                            listing.title.toLowerCase().includes(lowerCaseSearchValue) ||
                            listing.address.city.toLowerCase().includes(lowerCaseSearchValue);

      // Availability filter
      const filterStartDate = filters.startDate ? new Date(filters.startDate) : null;
      const filterEndDate = filters.endDate ? new Date(filters.endDate) : null;
      const matchesAvailability = listing.availability.some(availability => {
        const listingStartDate = new Date(availability.startDate);
        const listingEndDate = new Date(availability.endDate);

        return (!filterStartDate || listingEndDate >= filterEndDate) &&
               (!filterEndDate || listingStartDate <= filterStartDate);
      });

      // Price range filter
      const listingPrice = parseInt(listing.price, 10);
      const minPrice = filters.minPrice ? parseInt(filters.minPrice, 10) : null;
      const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice, 10) : null;
      const matchesPrice = (minPrice === null || listingPrice >= minPrice) &&
                           (maxPrice === null || listingPrice <= maxPrice);

      // Bedrooms filter
      const listingBedrooms = listing.metadata.bedrooms.length;
      const minBedrooms = filters.minBedrooms ? parseInt(filters.minBedrooms, 10) : null;
      const maxBedrooms = filters.maxBedrooms ? parseInt(filters.maxBedrooms, 10) : null;
      const matchesBedrooms = (minBedrooms === null || listingBedrooms >= minBedrooms) &&
                              (maxBedrooms === null || listingBedrooms <= maxBedrooms);

      return matchesSearch && matchesAvailability && matchesPrice && matchesBedrooms;
    });
  }

  const handleCardClick = (listing) => {
    navigate(`/listings/viewing?${listing.id}`,
      { state: { ...listing, useDateRange } });
  };

  const sortByRating = (listings, order) => {
    console.log('entered');
    if (order === 'descending') {
      return listings.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      return listings.sort((a, b) => a.averageRating - b.averageRating);
    }
  }

  // let filteredListings = detailedListings;
  // console.log('filteredListings');
  // console.log(filteredListings);

  // useEffect(() => {
  //   if (filterListings === detailedListings) {
  //     setFilteredSearch(false);
  //   }
  // }, [filteredListings]);

  const handleSearchClick = (event) => {
    event.preventDefault();
    setSearchValueAtSearch(basicSearchValue);
    // Trigger the filtering logic here
    console.log('handleSearchClick');
    const result = sortByRating(
      filterListings(detailedListings,
        searchValueAtSearch,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          minPrice: priceRange.minPrice,
          maxPrice: priceRange.maxPrice,
          minBedrooms: bedroomRange.minBedrooms,
          maxBedrooms: bedroomRange.maxBedrooms
        }),
      ratingOrder
    );
    setFilteredListings(result);
    console.log('filteredListings');
    console.log(filteredListings);
    // : detailedListings;
    // setFilteredSearch(true); // This will indicate that a search has been performed
  };

  const searchGetters = {
    basicSearchValue,
    dateRange,
    priceRange,
    bedroomRange,
    ratingOrder
  }

  const searchSetters = {
    setBasicSearchValue,
    // handleBasicSearchClick,
    handleSearchClick,
    setDateRange,
    setPriceRange,
    setBedroomRange,
    setRatingOrder
  }

  return (
    <>
      <searchContext.Provider value={{ searchGetters, searchSetters }}>
        <PrimarySearchAppBar />
        <FilterModal/>
        <Box sx={{ padding: '2% 5%' }}>
            <WelcomeTitle/>
            <Box sx={{ padding: '20px', display: 'flex' }}>
            <StyledGridContainer spacing={{ xs: 2, sm: 3, md: 4 }}>
              {filteredListings.map((listing) => (
                // check if listing is published
                listing.published && (
                  <StyledGridItem
                    key={listing.id}
                    item xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <ThumbnailCard
                      sx={{
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => handleCardClick(listing)}
                    >
                      <CardMedia
                        component="img"
                        height="194"
                        image={listing.thumbnail} // Assuming this is a URL to the image
                        alt={listing.title}
                      />
                      <CardContent>
                        <Rating
                          name="controlled-rating"
                          value={computeRating(listing.reviews)}
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
                        <Typography variant="body2" color="text.secondary">
                          {listing.status ? `📅 ${listing.status}` : '📅try to get it'}
                        </Typography>
                        <UnderLinedText sx={{ fontWeight: 'bold' }}>
                          {`💰💲${listing.price} per day`}
                        </UnderLinedText>
                      </CardContent>
                    </ThumbnailCard>
                  </StyledGridItem>
                )
              ))}
            </StyledGridContainer>
          </Box>
        </Box>
      </searchContext.Provider>
    </>
  );
};

export default MainPage;
