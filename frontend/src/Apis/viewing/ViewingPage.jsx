import React from 'react'

import { useLocation } from 'react-router-dom';
import { Box } from '@mui/system';

import PrimarySearchAppBar from '../mainPage/navigationComponents/navigationBar'
import WelcomeTitle from '../../utils/globalComponents/welcomeTitleComponent'
import SingleCardComponent from '../../utils/globalComponents/singleCardComponent'

const ViewingPage = () => {
  const ratingValue = 1;
  const location = useLocation();
  const cardData = location.state;
  const info = '';
  console.log(cardData);
  return (
    <>
      <PrimarySearchAppBar />
      <Box sx={{ padding: '2% 5%' }}>
        <WelcomeTitle extraInfo={ info }/>
        <SingleCardComponent
          cardData={cardData}
          ratingValue={ratingValue}
          useDateRange={cardData.useDateRange}
        />
      </Box>
    </>
  )
}

export default ViewingPage;
