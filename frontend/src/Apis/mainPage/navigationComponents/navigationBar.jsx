import React from 'react';
import Box from '@mui/material/Box';
import MenuComponent from '../ContextMenuComponent';
import MobileMenuComponent from './mobileMenuComponent';
import Navbar from './NavbarMiddle';
import { initialValue, Context } from './navContext';

export default function PrimarySearchAppBar () {
  const [anchorEl, setAnchorEl] = React.useState(initialValue.anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(initialValue.mobileMoreAnchorEl);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const getters = {
    menuId,
    mobileMenuId,
    anchorEl,
    mobileMoreAnchorEl,
    isMenuOpen,
    isMobileMenuOpen,
  };

  const setters = {
    handleProfileMenuOpen,
    handleMobileMenuClose,
    handleMenuClose,
    handleMobileMenuOpen,
  };

  return (
    <Context.Provider value={{ getters, setters }}>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />

        <MobileMenuComponent/>

        <MenuComponent
          menuId={menuId}
          anchorEl={anchorEl}
          isMenuOpen={isMenuOpen}
          handleMenuClose={handleMenuClose} />
      </Box>
    </Context.Provider>
  );
}
