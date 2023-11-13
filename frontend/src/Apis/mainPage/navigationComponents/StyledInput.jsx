/**
 * @file_overview Input component for the search bar
 * @module StyledInputBase
 */
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // paddingRight: `calc(1em + ${theme.spacing(4)})`, // Add padding on the right
    transition: theme.transitions.create('width'),
    width: '100%',
    // [theme.breakpoints.down('md')]: {
    //   width: '70%'
    // },
  },
}));
