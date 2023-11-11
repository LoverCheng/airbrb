/**
 * @file_overview Search bar component for the navigation bar.
 * @module Search,SearchIconWrapper
 */
import { styled } from '@mui/material/styles';

export const Search = styled('div')(({ theme }) => ({
  // any child elements with position: absolute to be positioned relative to this div
  // border: '1px solid rgba(0, 0, 0, 0.23)', // Example border, change as needed
  position: 'relative',
  borderRadius: '20px',
  // border: '1px solid rgba(0, 0, 0, 0.23)',
  boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  // & means the element itself
  '&:hover': {
    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    boxShadow: '0px 4px 8px -1px rgba(0,0,0,0.2), 0px 8px 12px 0px rgba(0,0,0,0.32), 0px 3px 20px 0px rgba(0,0,0,0.24)',
    // Add this line for shadow
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  /** Applies the styles inside this block
   *  only for screen sizes 'sm' (small) and above.
  **/
  [theme.breakpoints.up('sm')]: {
    /**
     * the default spacing unit is 8px
     * theme.spacing(3), it calculates the value as 8 * 3
     */
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  /**
   * top and bottom => 0
   * left and right => 2 * 8px = 16px
   */
  padding: theme.spacing(0, 2),
  // height: '10%',
  top: '10%',
  right: '1%', // Adjust position to be on the right
  position: 'absolute',
  /**
   * the div will not respond to or trigger any
   * mouse events like click, hover, etc.
   * Events will be "passed through" to elements underneath.
   */
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Create a circular shape
  borderRadius: '50%',
  // transform: 'translateY(-50%)', // Adjust vertically to center the icon
  // Set the circle's size
  width: theme.spacing(0), // Adjust the size of the circle here
  height: theme.spacing(4), // Adjust the size of the circle here
  backgroundColor: 'rgba(255,56,92)', // Example background color, change as needed
  color: theme.palette.getContrastText(theme.palette.error.main), // Ensure the icon color contrasts with the background
}));
