// Loader.js
import React from 'react';
import './Loader.css';
import logo from "../../images/logo.png"; // Adjust the path if necessary

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logo} alt="ReisenBooking Logo" className="loader-logo" />
    </div>
  );
};

export default Loader;
