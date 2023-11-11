/**
 * @file_overview Navbar component
 * @module Navbar
 */
import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper } from './searchStyles';
import { StyledInputBase } from './InputComponent';
import { Context, useContext } from './navContext';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
// import logo from file but not use fetch
import logo from '../../../assets/Airbnb_Logo_Bélo.svg';
import { useNavigate } from 'react-router-dom';

const StyledIconSymbol = styled.img`
  width: 100px;
  height: auto;
  display: ${({ theme }) => theme.breakpoints.up('sm') ? 'block' : 'none'};
  // changes the cursor to a pointer
  cursor: pointer;
`;

function SvgIconSymbol (props) {
  const theme = useTheme();

  return (
    <StyledIconSymbol
    {...props}
    theme={theme}
  />
  );
}

const Navbar = () => {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();

  const handleIconLogoClick = () => {
    navigate('/');
  };

  return (
    // remove shadow of nav bar
    <AppBar
      position='static'
      sx={{
        bgcolor: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0', // You can change the color and size as needed
      }}
    >
        <Toolbar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}
               onClick={handleIconLogoClick}
          >
            <SvgIconSymbol src={logo} alt="icon"/>
          </Box>
          <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={getters.menuId}
              aria-haspopup='true'
              onClick={setters.handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle color='action' />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='show more'
              aria-controls={getters.mobileMenuId}
              aria-haspopup='true'
              onClick={setters.handleMobileMenuOpen}
              color='inherit'
              // sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
  )
}

export default Navbar;
