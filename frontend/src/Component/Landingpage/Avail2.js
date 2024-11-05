import React, { useState, useEffect, useContext } from 'react';
import logoimage from '../../images/logo withoutBG.png';
import "./Avail2.css";
import Hotelcontext from '../../context/Hotelcontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Login from '../Loginsignup/Loginsignup';
import 'bootstrap/dist/css/bootstrap.min.css';

const Avail2 = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Rename check to isLoggedIn for clarity
    const [sortOption, setSortOption] = useState(""); // State for sorting option

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

    const today = new Date().toISOString().split('T')[0];
    return (
        <div>
            <div className='avail2-navbar'>
                <div className='avail2-top-nav'>
                    <div className="avail2-logo">
                        <img src={logoimage} alt="Logo" height='60px' width='900px' />
                    </div>
                    <div className='avail2-right-side'>
                        <div>
                            {localStorage.getItem("token") ? (
                                <button className='avail2-custom-button' onClick={handleLogout}>LOGOUT</button>
                            ) : (
                                <button className="avail2-custom-button" onClick={toggleLoginModal}>Login or Create Account</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='avail2-search'>
                <div className="avail2-hero">
                    <div className="avail2-hero-content">
                        <form className="avail2-booking-form">
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
                <div className="avail2-sort-by">
                    <label htmlFor="sortOptions">Sort by:</label>
                    <select
                        id="sortOptions"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Sort By Dropdown */}


            <div className='avail2-hotel-search'></div>
            <div className='LoginSignup'>{showLogin && <Login closeModal={toggleLoginModal} />}</div>
        </div>
    );
};

export default Avail2;
