/**
 * This component is used to render the menu component
 * @module MenuComponent
 */
import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Context, useContext } from './navigationComponents/navContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MenuComponent () {
  const navigate = useNavigate();
  // This hook returns the current location object.
  const location = useLocation();

  // Check if the token exists in localStorage
  const token = localStorage.getItem('token');

  const openLoginModal = () => {
    // When opening the modal, we can pass the current location in the state
    // to render the modal over this page
    navigate('/login', { state: { background: location, modalType: 'login' } });
  };

  const openSignUpModal = () => {
    navigate('/signUp', { state: { background: location, modalType: 'register' } });
  }

  const handleLoginClick = () => {
    setters.handleMenuClose();
    openLoginModal();
  };

  const handleSignUpClick = () => {
    setters.handleMenuClose();
    openSignUpModal();
  }

  const handleLogoutClick = () => {
    setters.handleMenuClose();
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to home or any other page if needed
    navigate('/');
  };

  const handleAddClick = () => {
    setters.handleMenuClose();
    // openAddModal();
    navigate('/listings/new');
  }

  const handleHostedClick = () => {
    setters.handleMenuClose();
    // openAddModal();
    navigate('/listings/hosted');
  }

  const getMenuItems = () => {
    if (token) {
      // we need to give key to each MenuItem
      // With keys, React can track which items have changed, been added, or been removed
      return [<MenuItem key="listingNew" onClick={handleAddClick}>Airbnb your place</MenuItem>,
              <MenuItem key="listingHosted" onClick={handleHostedClick}>Listings Hosted</MenuItem>,
               <MenuItem key="logout" onClick={handleLogoutClick}>Log out</MenuItem>];
    } else {
      return [
        <MenuItem key="signup" onClick={handleSignUpClick}>Sign up</MenuItem>,
        <MenuItem key="login" onClick={handleLoginClick}>Log in</MenuItem>
      ];
    }
  };

  const { getters, setters } = useContext(Context);
  return (
    <Menu
      anchorEl={getters.anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={getters.menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={getters.isMenuOpen}
      onClose={setters.handleMenuClose}
      PaperProps={{
        style: {
          width: '200px', // Set the width here
          borderRadius: '16px', // Set the border radius here
        },
      }}
    >
      {getMenuItems()}
    </Menu>
  );
}
