import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainPage from './Apis/mainPage/MainPage';
import { ModalWrapper } from './Apis/adminAuth/modals';
import AddNew from './Apis/listings/addNew';
import ListingsHosted from './Apis/listings/ListingsHosted';

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
        <Route path="/listings/new" element={<AddNew/>}/>
        <Route path="/listings/hosted" element={<ListingsHosted/>}/>
      </Routes>
    </Router>
  );
};

export default App;
