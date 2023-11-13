import React, { useState, useContext } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import StyledFilterButton from './StyledFilterButton';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import searchContext from './searchContext';

export default function FilterModal () {
  const { searchGetters, searchSetters } = useContext(searchContext);
  const dateRange = searchGetters.dateRange;
  const setDateRange = searchSetters.setDateRange;
  const priceRange = searchGetters.priceRange;
  const setPriceRange = searchSetters.setPriceRange;
  const bedroomRange = searchGetters.bedroomRange;
  const setBedroomRange = searchSetters.setBedroomRange;

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDateChange = (date, isStartDate) => {
    const updatedDateRanges = (dateRange) => {
      if (isStartDate) {
        return {
          ...dateRange,
          startDate: date,
          endDate: date > dateRange.endDate ? null : dateRange.endDate
        };
      } else {
        return {
          ...dateRange,
          endDate: date,
          startDate: date < dateRange.startDate ? null : dateRange.startDate
        };
      }
    }
    setDateRange(updatedDateRanges);
  };

  const clearAll = () => {
    // const startDate = dateRange.startDate;
    // const endDate = dateRange.endDate;
    // ! Why do I can not pass a Date object into the function below?
    setDateRange({ startDate: null, endDate: null });
    setPriceRange({ minPrice: '', maxPrice: '' });
    setBedroomRange({ minBedrooms: '', maxBedrooms: '' });
  }

  const handleMinPriceBlur = (event) => {
    const newMinPrice = event.target.value;
    if (newMinPrice && priceRange.maxPrice && parseInt(newMinPrice) > parseInt(priceRange.maxPrice)) {
      setPriceRange({ minPrice: priceRange.maxPrice, maxPrice: newMinPrice })
    } else {
      setPriceRange({ ...priceRange, minPrice: newMinPrice })
    }
  }

  const handleMaxPriceBlur = (event) => {
    const newMaxPrice = event.target.value;
    if (newMaxPrice && priceRange.minPrice && parseInt(newMaxPrice) < parseInt(priceRange.minPrice)) {
      setPriceRange({ minPrice: newMaxPrice, maxPrice: priceRange.minPrice });
    } else {
      setPriceRange({ ...priceRange, maxPrice: newMaxPrice });
    }
  }

  const handleMinBedroomsBlur = (event) => {
    const newMinBedrooms = event.target.value;
    if (newMinBedrooms && bedroomRange.maxBedrooms && parseInt(newMinBedrooms) > parseInt(bedroomRange.maxBedrooms)) {
      setBedroomRange({ minBedrooms: bedroomRange.maxBedrooms, maxBedrooms: newMinBedrooms })
    } else {
      setBedroomRange({ ...bedroomRange, minBedrooms: newMinBedrooms })
    }
  }

  const handleMaxBedroomsBlur = (event) => {
    const newMaxBedrooms = event.target.value;
    if (newMaxBedrooms && bedroomRange.minBedrooms && parseInt(newMaxBedrooms) < parseInt(bedroomRange.minBedrooms)) {
      setBedroomRange({ minBedrooms: newMaxBedrooms, maxBedrooms: bedroomRange.minBedrooms })
    } else {
      setBedroomRange({ ...bedroomRange, maxBedrooms: newMaxBedrooms })
    }
  }

  return (
    <div>
      <StyledFilterButton
          variant='outlined'
          startIcon={<FilterListIcon />}
          onClick={handleOpen}
        >
          Filters
        </StyledFilterButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // width: 300,
            width: {
              xs: '80%', // for extra-small screens, use 90% of the screen width
              sm: '70%', // for small screens, use 80% of the screen width
              md: '60%', // for medium screens, use 60% of the screen width
              lg: '50%', // for large screens, use 50% of the screen width
              xl: '40%', // for extra-large screens, use 40% of the screen width
            },
            // minWidth: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Filters
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Typography gutterBottom>Price range</Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Minimum"
                type="number"
                value={priceRange.minPrice}
                onChange={(e) => setPriceRange({ ...priceRange, minPrice: e.target.value })}
                onBlur={handleMinPriceBlur}
              />
              <TextField
                label="Maximum"
                type="number"
                value={priceRange.maxPrice}
                onChange={(e) => setPriceRange({ ...priceRange, maxPrice: e.target.value })}
                onBlur={handleMaxPriceBlur}
              />
            </Box>

            <Typography gutterBottom>Date range</Typography>
            <Box display="flex" gap={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(newDate) => handleDateChange(newDate, true)}
                  // Ensure that the start date cannot be after the end date
                  maxDate={dateRange.endDate || undefined}
                  // Ensure that the start date cannot be before today
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: '10px' }}
                />
                {/* <Typography sx={{ marginRight: '10px' }}>to</Typography> */}
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(newDate) => handleDateChange(newDate, false)}
                  // Ensure that the end date cannot be before the start date
                  minDate={dateRange.startDate || undefined}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Typography gutterBottom>Bedrooms</Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Min"
                type="number"
                value={bedroomRange.minBedrooms}
                onChange={(e) => setBedroomRange({ ...bedroomRange, minBedrooms: e.target.value })}
                onBlur={handleMinBedroomsBlur}
              />
              <TextField
                label="Max"
                type="number"
                value={bedroomRange.maxBedrooms}
                onChange={(e) => setBedroomRange({ ...bedroomRange, maxBedrooms: e.target.value })}
                onBlur={handleMaxBedroomsBlur}
              />
            </Box>

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={clearAll}
              >
                Clear all
              </Button>
              <Button variant="contained" onClick={(event) => {
                searchSetters.handleSearchClick(event);
                handleClose();
              }}>
                Search now
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
