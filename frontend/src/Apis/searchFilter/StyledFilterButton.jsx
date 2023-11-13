import { styled } from '@mui/system';
import Button from '@mui/material/Button';

const StyledFilterButton = styled(Button)({
  position: 'absolute',
  top: '10%',
  right: '0.5%',
  color: 'black',
  borderColor: 'lightgray',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'white', // Change this to your desired hover color
    borderColor: 'lightgray', // Change this to your desired hover color
    color: 'black', // Text color on hover
  },
  // Custom radio-like styles (optional)
  borderRadius: '15%', // Makes the button round like a radio button
  padding: '10px 10px', // Adjust padding as needed
});

export default StyledFilterButton;
