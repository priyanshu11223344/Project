import React, { useState, useEffect } from 'react';
import './Frontpage.css';
import logoimage from '../../images/logo withoutBG.png';
import { useNavigate } from 'react-router-dom';
import Login from "../Loginsignup/Loginsignup";
import cityData from "./cityData.js";  // Import city data from the JS file

const Frontpage = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [filteredCities, setFilteredCities] = useState([]);
    const navigate = useNavigate();

    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [showLogin]);

    const handleCheckAvailability = (e) => {
        e.preventDefault();

        const formattedCheckin = formatDate(checkin);
        const formattedCheckout = formatDate(checkout);

        if (!formattedCheckin || !formattedCheckout) {
            alert('Please enter valid check-in and check-out dates');
            return;
        }

        if (formattedCheckin === formattedCheckout) {
            alert('Check-out date must be different from check-in date');
            return;
        }

        if (!selectedCityId) {
            alert('Please select a valid location');
            return;
        }

        localStorage.setItem('checkin', formattedCheckin);
        localStorage.setItem('location',selectedCityId);
        navigate("/avail2");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        alert("Logged out successfully");
    };

    const handleSearchChange = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setSelectedCity(searchQuery);

        const filtered = cityData.filter(city =>
            city.City.toLowerCase().includes(searchQuery) ||
            city.Country.toLowerCase().includes(searchQuery)
        );
        setFilteredCities(filtered);
    };

    const handleCitySelect = (cityId, cityName) => {
        setSelectedCity(cityName);
        setSelectedCityId(cityId);
        setFilteredCities([]);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="booking-container">
            <div className='top-nav'>
                <div className="logo">
                    <img src={logoimage} alt="Logo" height='60px' width='900px' />
                </div>
                <div className='right-side'>
                    <div>
                        {isLoggedIn ? (
                            <button className='custom-button' onClick={handleLogout}>LOGOUT</button>
                        ) : (
                            <button className="custom-button" onClick={toggleLoginModal}>Login or Create Account</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="hero">
                <div className="hero-content">
                    <h3>Welcome to ReisenBooking</h3>
                    <h1>Find Best Places To Stay</h1>
                    <form className="booking-form">
                        <div className="form-group">
                        <div>Location</div>
    <div className="search-container" style={{ position: 'relative' }}>
        <input
            type="text"
            value={selectedCity}
            onChange={handleSearchChange}
            placeholder="Search by city or country"
        />
        {filteredCities.length > 0 && (
            <ul className="search-suggestions">
                {filteredCities.map((city) => (
                    <li
                        key={city.CityId}
                        onClick={() => handleCitySelect(city.CityId, `${city.City}, ${city.Country}`)}
                    >
                        {city.City}, {city.Country}
                    </li>
                ))}
            </ul>
        )}
    </div>
                        </div>
                        <div className="form-group">
                            <div>Check-in</div>
                            <input
                                type="date"
                                value={checkin}
                                min={today}
                                onChange={(e) => setCheckin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div>Check-out</div>
                            <input
                                type="date"
                                value={checkout}
                                min={checkin || today}
                                onChange={(e) => setCheckout(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Adults</label>
                            <div className="quantity-buttons">
                                <button type="button" onClick={decrementAdults}>-</button>
                                <span>{adults}</span>
                                <button type="button" onClick={incrementAdults}>+</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Children</label>
                            <div className="quantity-buttons">
                                <button type="button" onClick={decrementChildren}>-</button>
                                <span>{children}</span>
                                <button type="button" onClick={incrementChildren}>+</button>
                            </div>
                        </div>
                        <button className="check-availability-button" onClick={handleCheckAvailability}>
                            Check Availability
                        </button>
                    </form>
                </div>
            </div>
            <div className='LoginSignup'>{showLogin && <Login closeModal={toggleLoginModal} />}</div>
        </div>
    );
};

export default Frontpage;
