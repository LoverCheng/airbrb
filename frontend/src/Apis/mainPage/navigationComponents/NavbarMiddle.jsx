/**
 * @file_overview Navbar component
 * @module Navbar
 */
import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper } from './searchStyles';
import { StyledInputBase } from './StyledInput';
import { Context, useContext } from './navContext';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

// import logo from file but not use fetch
import logo from '../../../assets/Airbnb_Logo_Bélo.svg';
// import smallLogo from '../../../assets/Airbnb_Logo_Small.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import searchContext from '../../searchFilter/searchContext';

const StyledIconSymbol = styled.img`
  width: 100px;
  height: auto;
  display: ${({ theme }) => theme.breakpoints.up('sm') ? 'block' : 'none'};
  // changes the cursor to a pointer
  cursor: pointer;
`;

const useStyle = makeStyles({
  input: {
    width: '90%',
  }
});

function SvgIconSymbol (props) {
  const theme = useTheme();
  return (
    <StyledIconSymbol
    {...props}
    theme={theme}
  />
  );
}

const StyledSmallIcon = styled.img`
  height: auto;
  display: block;
  cursor: pointer;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: 100px; // Width for screens larger than 'sm'
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 50px; // Smaller width for screens smaller than 'sm'
  }
`;

function SvgSmallIcon ({ size, ...props }) {
  const theme = useTheme();
  return <StyledSmallIcon {...props} theme={theme} size={size} />;
}

const NavbarMiddle = () => {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyle();
  let searchGetters, searchSetters;
  if (location.pathname === '/') {
    ({ searchGetters, searchSetters } = useContext(searchContext));
  }
  const token = localStorage.getItem('token');
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
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Box sx={{
            display: { xs: 'none', md: 'block' }
          }}
               onClick={handleIconLogoClick}
          >
            <SvgIconSymbol src={logo} alt="icon"/>
          </Box>

          <Box sx={{
            display: {
              xs: 'block',
              md: 'none',
            }
          }}
               onClick={handleIconLogoClick}
          >
            <SvgSmallIcon src={logo} alt="icon" size="20px" />
          </Box>

          {/*
            disappear the search bar feature if the location is not the main page
          */}
          {
            location.pathname === '/' &&
            <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'center' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon sx={{
                    '&:hover': {
                      cursor: 'pointer' // Cursor when hovering
                    }
                  }}
                  onClick= {
                    location.pathname === '/'
                      ? searchSetters.handleSearchClick
                      : undefined
                  }/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder='Any title | Any city'
                  inputProps={{ 'aria-label': 'search' }}
                  // make the input field full width
                  className={classes.input}
                  value={ location.pathname !== '/'
                    ? searchGetters
                    : searchGetters.basicSearchValue
                  }
                  onChange={(event) => {
                    location.pathname === '/' &&
                    searchSetters.setBasicSearchValue(event.target.value);
                  }}
                />
              </Search>
            </Box>
          }

          <Box sx={{ display: 'flex' }}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={getters.menuId}
              aria-haspopup='true'
              onClick={setters.handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle sx={{
                color: token ? 'black' : 'gray'
              }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
  )
}

export default NavbarMiddle;
