import React, { createContext } from 'react';

export const initialValue = {
  anchorEl: null,
  mobileMoreAnchorEl: null,
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
