import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Card,
  CardContent,
  CardMedia,
  FormHelperText
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import InputAdornment from '@mui/material/InputAdornment';
import BedroomForm from './components/bedroomComponent';
import { BedroomContext } from './bedroomContext';
import { fileToDataUrl } from '../../utils/fileToDataUrl';
import http from '../../utils/http';
import stripWhitespace from '../../utils/cleanData';
import HintModal from '../../utils/hintModal';

const AddNew = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [listing, setListing] = useState({
    title: '',
    address: {
      street,
      city,
      state,
      postcode,
      country,
    },
    price: '',
    thumbnail: '',
    propertyType: '',
    bathrooms: '',
    bedrooms: [],
    amenities: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  // error hint modal
  const [modalOpen, setModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const navigate = useNavigate();
  // initialize the bedrooms as none { beds: '0', bedType: '' }
  const [bedrooms, setBedrooms] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const handleChange = (event) => {
    // use the value of `event.target.name` as the property name
    // asynchronously set the property value in state
    setListing({ ...listing, [event.target.name]: event.target.value });
  };

  const addRoomCallback = (newBedrooms) => {
    // update bedrooms info after add one bedroom
    handleChange({ target: { name: 'bedrooms', value: newBedrooms } });
  }

  const handleClose = () => {
    navigate('/'); // Navigate to the root URL
  };
  const handleOpenModal = (message) => {
    setHintMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileToDataUrl(file).then((dataUrl) => {
        setImagePreview(dataUrl);
        setListing({ ...listing, thumbnail: dataUrl });
      });
    }
  };

  // Function to send data to backend
  const handleSubmit = () => {
    setButtonClicked(true);
    const originalData = {
      title: listing.title,
      address: listing.address,
      price: listing.price,
      thumbnail: listing.thumbnail,
      metadata: {
        bathrooms: listing.bathrooms,
        bedrooms: listing.bedrooms,
        amenities: listing.amenities,
        propertyType: listing.propertyType,
        rates: [],
      }
    }
    const cleanedData = stripWhitespace({ ...originalData });
    const requiredFields = [
      cleanedData.title,
      cleanedData.address.street,
      cleanedData.address.city,
      cleanedData.address.state,
      cleanedData.address.postcode,
      cleanedData.address.country,
      cleanedData.price,
      cleanedData.thumbnail,
      cleanedData.metadata.propertyType,
      cleanedData.metadata.bathrooms,
      // originalData.metadata.bedrooms.length, // Assuming that # of bedrooms is 0
      cleanedData.metadata.amenities,
    ];
    const isInvalid = requiredFields.some(field => field == null || field === '');

    setListing(prevListing => ({
      ...prevListing,
      address: {
        ...prevListing.address,
        ...cleanedData.address,
      },
      title: cleanedData.title,
      price: cleanedData.price,
      thumbnail: cleanedData.thumbnail,
      propertyType: cleanedData.metadata.propertyType,
      bathrooms: cleanedData.metadata.bathrooms,
      bedrooms: cleanedData.metadata.bedrooms,
      amenities: cleanedData.metadata.amenities,
    }));
    if (isInvalid) {
      return;
    }
    http.post('listings/new', cleanedData).then((res) => {
      if (!res.error) {
        console.log('Successfully added new listing');
        navigate('/');
      } else {
        console.log(res);
        // remember to pass a string into handleOpenModal
        handleOpenModal(res.error);
        console.log('Failed to add new listing');
      }
    });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    switch (event.target.name) {
      case 'street':
        setStreet(event.target.value);
        break;
      case 'city':
        setCity(event.target.value);
        break;
      case 'state':
        setState(event.target.value);
        break;
      case 'postcode':
        setPostcode(event.target.value);
        break;
      case 'country':
        setCountry(event.target.value);
        break;
      default:
        break;
    }
    setListing(prevListing => ({
      ...prevListing,
      address: {
        ...prevListing.address,
        [name]: value,
      }
    }));
  };

  return (
    <BedroomContext.Provider value={{ bedrooms, setBedrooms }}>
      <PrimarySearchAppBar />
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mt: 5 }}
        >
          Listing Information
        </Typography>

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          name="title"
          value={listing.title}
          onChange={handleChange}
          margin="normal"
          error= { buttonClicked && !listing.title }
          helperText={
            buttonClicked &&
            !listing.title &&
            'Please fill the title'
          }
        />
         <TextField
          label="Street"
          variant="outlined"
          fullWidth
          name="street"
          value={street}
          onChange={handleAddressChange}
          error= { buttonClicked && !street }
          helperText={
            buttonClicked &&
            !street &&
            'Please fill the street'
          }
          margin="normal"
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          name="city"
          value={city}
          error= { buttonClicked && !city }
          helperText={
            buttonClicked &&
            !city &&
            'Please fill the city'
          }
          onChange={handleAddressChange}
          margin="normal"
        />
        <TextField
          label="State"
          variant="outlined"
          fullWidth
          name="state"
          value={state}
          error= { buttonClicked && !state }
          helperText={
            buttonClicked &&
            !state &&
            'Please fill the state'
          }
          onChange={handleAddressChange}
          margin="normal"
        />
        <TextField
          label="Postcode"
          type='number'
          variant="outlined"
          fullWidth
          name="postcode"
          value={postcode}
          error= { buttonClicked && !postcode }
          helperText={
            buttonClicked &&
            !postcode &&
            'Please fill the postcode'
          }
          onChange={handleAddressChange}
          margin="normal"
        />

        <TextField
          label="Country"
          variant="outlined"
          fullWidth
          name="country"
          value={country}
          error= { buttonClicked && !country }
          helperText={
            buttonClicked &&
            !country &&
            'Please fill the country'
          }
          onChange={handleAddressChange}
          margin="normal"
        />

        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          name="price"
          type="number"
          value={listing.price}
          onChange={handleChange}
          margin="normal"
          helperText={
            buttonClicked &&
            !listing.price &&
            'Please fill the price'
          }
          error= { buttonClicked && !listing.price }
          InputProps={{
            startAdornment:
            <InputAdornment position="start">
              $
            </InputAdornment>,
          }}
        />

        <TextField
          label="Number of Bathrooms"
          variant="outlined"
          fullWidth
          name="bathrooms"
          type="number"
          value={listing.bathrooms}
          onChange={handleChange}
          error= { buttonClicked && !listing.bathrooms }
          InputProps={{
            step: 0.5, // Allows for half bathrooms
          }}
          margin="normal"
          helperText={
            buttonClicked &&
            !listing.bathrooms &&
            'Please fill the number of bathrooms'
          }
        />

        <TextField
          label="amenities"
          variant="outlined"
          fullWidth
          name="amenities"
          value={listing.amenities}
          onChange={handleChange}
          margin="normal"
          helperText={
            buttonClicked &&
            !listing.amenities &&
            'Please fill the amenities'
          }
          error= { buttonClicked && !listing.amenities }
        />

        <Card>
          <CardContent>
            <Typography variant="h6">Add your Thumbnail</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload
              </Button>
            </label>
            {imagePreview
              ? (
                  <CardMedia
                    component="img"
                    sx={{ width: 'auto', maxHeight: 200, marginTop: 2 }}
                    image={imagePreview}
                    alt="Listing Thumbnail"
                  />
                )
              : (
                  <Typography color="error">
                    {!listing.thumbnail && buttonClicked && 'Please upload a thumbnail.'}
                  </Typography>
                )
            }
          </CardContent>
        </Card>

        <FormControl
          fullWidth
          margin="normal"
          error={!listing.propertyType && buttonClicked}
        >
          <InputLabel id="property-type-label">Property Type</InputLabel>
          <Select
            labelId="property-type-label"
            id="propertyType"
            name="propertyType"
            value={listing.propertyType}
            label="Property Type"
            onChange={handleChange}
          >
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
          </Select>
          {!listing.propertyType && buttonClicked && (
            <FormHelperText>Please select a property type</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="normal">
          <BedroomForm updateListingInfo={ addRoomCallback }/>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom>
            Number of Bedrooms: {bedrooms.length}
        </Typography>

        <Container maxWidth="sm">
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Listing
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              >
              Close
            </Button>
          </Box>
        </Container>
      </Container>
      <HintModal
        open={modalOpen}
        handleClose={handleCloseModal}
        hintMessage={hintMessage}
      />
    </BedroomContext.Provider>
  );
}

export default AddNew;
