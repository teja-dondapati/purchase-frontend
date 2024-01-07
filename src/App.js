// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LaptopList from './components/LaptopList';
import Checkout from './components/Checkout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={<LaptopList />} />
      </Routes>
    </Router>
  );
};

export default App;
