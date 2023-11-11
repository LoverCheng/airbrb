/**
 * @file_overview mobile menu component
 * @module MobileMenuComponent
 */
import React from 'react';
import { Menu, MenuItem, IconButton, Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import PropTypes from 'prop-types';
import { Context, useContext } from './navContext';

export default function MobileMenuComponent () {
  const { getters, setters } = useContext(Context);
  return (
        <Menu
          anchorEl={getters.mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id={getters.mobileMenuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={getters.isMobileMenuOpen}
          onClose={setters.handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
              <Badge badgeContent={4} color='error'>
                <MailIcon color='action' />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
            >
              <Badge badgeContent={17} color='error'>
                <NotificationsIcon color='action' />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={setters.handleProfileMenuOpen}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              color='inherit'
            >
              <AccountCircle color='action' />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
  );
}
