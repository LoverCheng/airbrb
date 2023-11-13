import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainPage from './Apis/mainPage/MainPage';
import { ModalWrapper } from './Apis/adminAuth/modals';
import ListingForm from './Apis/listings/ListingForm';
import ListingsHosted from './Apis/listings/ListingsHosted';
import ListingPush from './Apis/listings/ListingPush';
import ViewingPage from './Apis/viewing/ViewingPage';

const EmptyComponent = () => null;

// A component that renders the main layout and an outlet for modals
const LayoutWithModal = () => {
  return (
    <>
      <Outlet /> {/* This will render the MainPage by default */}
      <ModalWrapper />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWithModal />} >
          <Route index element={<MainPage />} />
          <Route path="login" element={<EmptyComponent/>}/>
          <Route path="signUp" element={<EmptyComponent/>}/>
        </Route>
        <Route path="/listings/new" element={<ListingForm/>}/>
        <Route path="/listings/hosted" element={<ListingsHosted/>}/>
        <Route path="/listings/update" element={<ListingForm/>}/>
        <Route path="/listings/push" element={<ListingPush/>}/>
        <Route path="/listings/viewing" element={<ViewingPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
