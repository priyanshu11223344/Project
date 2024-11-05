import React, { useState, useEffect, useContext } from 'react';
import './Frontpage.css';
import logoimage from '../../images/logo withoutBG.png';
import { useNavigate } from 'react-router-dom';
import Login from "../Loginsignup/Loginsignup";
import Sideslidebar from './sideslidebar';
import Hotelcontext from '../../context/Hotelcontext';

const Frontpage = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Rename check to isLoggedIn for clarity
    const navigate = useNavigate();
    const { fetchData } = useContext(Hotelcontext); 

    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return '';
    };

    // Check for token on component mount and when showLogin changes
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
    }, [showLogin]); // Re-check when showLogin changes to reflect login/logout

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

        localStorage.setItem('checkin', formattedCheckin);
        fetchData(formattedCheckin);
        navigate("/Availability");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Update the state immediately on logout
        alert("Logged out successfully");
    };

    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    return (
        <div className="booking-container">
            <div className='top-nav'>
                <div className="logo">
                    <img src={logoimage} alt="Logo" height='60px' width='900px' />
                </div>
                <div className='right-side'>
                    <div>
                        {localStorage.getItem("token") ? (
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
                            <input type="text" placeholder="Location" />
                        </div>
                        <div className="form-group">
                            <div>Check-in</div>
                            <input 
                                type="date" 
                                value={checkin} 
                                min={today} // Prevent past dates
                                onChange={(e) => setCheckin(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <div>Check-out</div>
                            <input 
                                type="date" 
                                value={checkout}
                                min={checkin || today} // Prevent past dates and enforce after check-in
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
