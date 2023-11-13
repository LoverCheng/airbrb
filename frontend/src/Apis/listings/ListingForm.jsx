import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar';
import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Typography,
  TextField,
  Button,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  FormControl,
  Box,
  Card,
  CardContent,
  CardMedia,
  FormHelperText,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import InputAdornment from '@mui/material/InputAdornment';
import BedroomForm from './components/bedroomComponent';

import { BedroomContext } from './bedroomContext';
import { fileToDataUrl } from '../../utils/fileToDataUrl';
import http from '../../utils/http';
import stripWhitespace from '../../utils/cleanData';
import HintModal from '../../utils/modals/hintModal';

const HiddenInput = styled.input`
  display: none;
`;

const ListingForm = () => {
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
  // error hint modal
  const [modalOpen, setModalOpen] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const navigate = useNavigate();
  // initialize the bedrooms as none
  // template:{ beds: '0', bedType: '' }
  const [bedrooms, setBedrooms] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const cardData = location.state;

  // useEffect to update the listing info when the cardData is not null
  // prevent infinite re-renders
  useEffect(() => {
    // if the pathname is not /listings/update, reset the form data
    if (location.pathname === '/listings/new') {
      // Reset the form data
      setListing({
        title: '',
        address: {
          street: '',
          city: '',
          state: '',
          postcode: '',
          country: '',
        },
        price: '',
        thumbnail: '',
        propertyType: '',
        bathrooms: '',
        bedrooms: [],
        amenities: '',
      });
      setImagePreview('');
      setCity('');
      setStreet('');
      setState('');
      setPostcode('');
      setCountry('');
      setBedrooms([]);
      setImagePreviews([]);
      setButtonClicked(false);
    }
    if (cardData) {
      console.log('start to update the listing info');
      setListing(prevListing => ({
        ...prevListing,
        title: cardData.title,
        price: cardData.price,
        thumbnail: cardData.thumbnail,
        propertyType: cardData.metadata.propertyType,
        bathrooms: cardData.metadata.bathrooms,
        amenities: cardData.metadata.amenities,
      }));

      setImagePreview(cardData.thumbnail);
      setCity(cardData.address.city);
      listing.address.city = cardData.address.city;
      setStreet(cardData.address.street);
      listing.address.street = cardData.address.street;
      setState(cardData.address.state);
      listing.address.state = cardData.address.state;
      setPostcode(cardData.address.postcode);
      listing.address.postcode = cardData.address.postcode;
      setCountry(cardData.address.country);
      listing.address.country = cardData.address.country;
      setBedrooms(cardData.metadata.bedrooms);
      setImagePreviews(cardData.metadata.images);
    }
  }, [location.pathname, cardData]); // Dependency array

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
    // navigate to /listings/hosted
    navigate('/listings/hosted');
  };
  const handleOpenModal = (message) => {
    setHintMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const cleanData = (data) => {
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
        images: imagePreviews,
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
      cleanedData.metadata.images,
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
      images: cleanedData.metadata.images,
    }));
    if (!isInvalid) {
      return cleanedData;
    }
  }

  // Function to send data to backend
  const handleSubmit = () => {
    // clean the data
    const cleanedData = cleanData(listing);
    if (!cleanedData) {
      console.log('Failed to add new listing');
      return;
    }
    http.post('listings/new', cleanedData).then((res) => {
      if (!res.error) {
        console.log('Successfully added new listing');
        navigate('/listings/hosted');
      } else {
        console.log(res);
        // remember to pass a string into handleOpenModal
        handleOpenModal(res.error);
        console.log('Failed to add new listing');
      }
    });
  };

  // Function to update data to backend
  const handleUpdate = () => {
    // clean the data
    console.log(listing);
    // console.log(cardData);
    console.log(cardData.address.city);
    const cleanedData = cleanData(listing);
    if (!cleanedData) {
      console.log(cleanedData);
      console.log('Failed to update listing');
      return;
    }
    http.put(`listings/${cardData.id}`, cleanedData).then((res) => {
      if (!res.error) {
        console.log('Successfully updated listing');
        navigate('/listings/hosted');
      } else {
        console.log(res);
        // remember to pass a string into handleOpenModal
        handleOpenModal(res.error);
        console.log('Failed to update listing');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileToDataUrl(file).then((dataUrl) => {
        setImagePreview(dataUrl);
        setListing({ ...listing, thumbnail: dataUrl });
      });
    }
  };

  const handleImagesChange = async (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const dataUrlArray = await Promise.all(
        filesArray.map(file => fileToDataUrl(file))
      );
      console.log(filesArray);
      setImagePreviews((prevImages) => [...prevImages, ...dataUrlArray]);
      event.target.value = '';
    }
  };

  const handleCloseContextMenu = () => {
    console.log('enter');
    setContextMenu(null);
  };

  const handleDeleteImage = () => {
    // remove the image from the imagePreviews array according to the index
    setImagePreviews((prev) => prev.filter((_, i) => i !== selectedImage));
    handleCloseContextMenu();
  };

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setSelectedImage(index);
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
          // emulate native context menu behavior more closely
        : null,
    );
  };

  const renderImagePreviews = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        overflowX: 'auto', // Allows for scrolling if many images
        mt: 2,
      }}
    >
      {imagePreviews.map((imagePreviewUrl, index) => (
        <Box key={index} onContextMenu={(e) => handleContextMenu(e, index)}>
          <CardMedia
            key={index}
            component="img"
            sx={{
              width: 160, // Set a fixed width for each image
              height: 90, // Set a fixed height for each image
              mr: 2, // Adds a margin to the right of each image
            }}
            image={imagePreviewUrl}
            alt={`Thumbnail ${index}`}
          />
          </Box>
      ))}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleDeleteImage}>Delete</MenuItem>
      </Menu>
    </Box>
  );

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
          label="Price per night"
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

        <Card sx={{ mb: '15px' }}>
          <CardContent>
            <Typography variant="h6">Add your Thumbnail</Typography>
            <HiddenInput
              accept="image/*"
              id="add-thumbnail-file"
              multiple
              type="file"
              onChange = {handleImageChange}
            />
            <label htmlFor="add-thumbnail-file">
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
                <Box sx={{ mt: '10px' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 160,
                      height: 90,
                      mr: 2
                    }}
                    image={imagePreview}
                    alt="Listing Thumbnail"
                  />
                </Box>
                )
              : (
                  <Typography color="error">
                    {!listing.thumbnail && buttonClicked && 'Please upload a thumbnail.'}
                  </Typography>
                )
            }
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">Add your Images</Typography>
            <HiddenInput
              accept="image/*"
              id="add-images-file"
              multiple
              type="file"
              onChange={handleImagesChange}
            />
            <label htmlFor="add-images-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload
              </Button>
            </label>
            {imagePreviews.length > 0 ? renderImagePreviews() : null}
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
            {
              cardData
                ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Update Listing
                  </Button>
                  )
                : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit Listing
                  </Button>
                  )
            }
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

export default ListingForm;
