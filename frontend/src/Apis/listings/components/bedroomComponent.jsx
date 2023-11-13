/**
 * @fileOverview Bedroom component
 * @author <Jason>
 * @version 1.0.0
 * @abstract Component for the bedroom number and bed type
 */
import React from 'react';
import { Button, TextField, IconButton, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import propTypes from 'prop-types';
import { BedroomContext, useContext } from '../bedroomContext';

const BedroomForm = ({ updateListingInfo }) => {
  const { bedrooms, setBedrooms } = useContext(BedroomContext);
  const handleBedroomChange = (index, field, value) => {
    const updatedBedrooms = bedrooms.map((bedroom, i) =>
      i === index ? { ...bedroom, [field]: value } : bedroom
    );
    setBedrooms(updatedBedrooms);
    updateListingInfo(updatedBedrooms);
  };

  const addBedroom = () => {
    const newBedrooms = [...bedrooms, { beds: '0', bedType: '' }];
    setBedrooms(newBedrooms);
    updateListingInfo(newBedrooms); // Call the callback with the new bedrooms array
  };

  const removeBedroom = (index) => {
    const filteredBedrooms = bedrooms.filter((_, i) => i !== index);
    setBedrooms(filteredBedrooms);
    updateListingInfo(filteredBedrooms);
  };

  return (
    <>
      {bedrooms.map((bedroom, index) => (
        <Grid
          container
          spacing={2}
          key={index}
          alignItems="center"
          sx={{ mb: 2, p: 2 }}
        >
          <Grid item xs>
            <TextField
                label="Number of Beds"
                type="number"
                value={bedroom.beds}
                onChange={(e) => handleBedroomChange(index, 'beds', e.target.value)}
                InputProps={{
                  inputProps: {
                    min: 0
                  }
                }}
            />
          </Grid>
          <Grid item xs>
            <TextField
                label="Bed Type"
                value={bedroom.bedType}
                onChange={(e) => handleBedroomChange(index, 'bedType', e.target.value)}
            />
          </Grid>
          <Grid item xs>
              <IconButton onClick={() => removeBedroom(index)}>
                  <RemoveCircleOutlineIcon />
              </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button startIcon={<AddCircleOutlineIcon />} onClick={addBedroom}>
        Add Bedroom number
      </Button>
    </>
  );
};

BedroomForm.propTypes = {
  updateListingInfo: propTypes.func.isRequired
}

export default BedroomForm;
