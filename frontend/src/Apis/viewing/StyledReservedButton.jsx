import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledRedButton = styled(Button)({
  color: 'white', // Text color
  borderColor: 'rgb(210, 55, 85)', // Border color
  backgroundColor: 'rgb(210, 55, 85)', // Background color
  '&:hover': {
    backgroundColor: 'rgb(210, 55, 85)', // Remains transparent on hover
    borderColor: 'rgb(210, 55, 85)', // Border color remains the same on hover
    boxShadow: 'none', // No shadow on hover
  },
  '&:active': {
    backgroundColor: 'rgb(210, 55, 85)', // Remains transparent when clicked
    borderColor: 'rgb(210, 55, 85)', // Border color remains the same when clicked
  },
  '&.Mui-disabled': {
    color: 'rgb(210, 55, 85)', // Text color remains the same when disabled
    borderColor: 'rgb(210, 55, 85)', // Border color remains the same when disabled
  },
  textTransform: 'none', // Prevents uppercase transformation
});

export default StyledRedButton;
