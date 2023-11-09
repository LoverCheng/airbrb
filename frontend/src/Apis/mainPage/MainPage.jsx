import React, { useEffect } from 'react';
import PrimarySearchAppBar from './navigationComponents/navigationBar';

const MainPage = () => {
  // const [listings, setListings] = useState([]);
  useEffect(
    () => {
      // This will be executed once when the MainPage component is mounted
      // You can use this to fetch data from your backend API
      // For example, you can fetch the user's listings
      // fetch('/api/listings')
      //   .then((response) => response.json())
      //   .then((data) => console.log(data));
    },
    [] // This empty array ensures that the effect is only run once
  )
  return (
    <div>
      <PrimarySearchAppBar />
    </div>
  );
};

export default MainPage;
