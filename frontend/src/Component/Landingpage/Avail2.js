import React, { useState, useEffect, useContext } from 'react';
import logoimage from '../../images/logo withoutBG.png';
import "./Avail2.css";
import Hotelcontext from '../../context/Hotelcontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Login from '../Loginsignup/Loginsignup';
import 'bootstrap/dist/css/bootstrap.min.css';
import HotelOffers from './HotelOffers';
import cityData from './cityData';
const Avail2 = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Rename check to isLoggedIn for clarity
    const [sortOption, setSortOption] = useState(""); // State for sorting option
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [filteredCities, setFilteredCities] = useState([]);
    const navigate = useNavigate();
    const { fetchData } = useContext(Hotelcontext);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return '';
    };
    useEffect(() => {
        // Fetch data on component mount if needed
        const storedCheckin = localStorage.getItem('checkin');
        console.log(storedCheckin)
        const id = localStorage.getItem('location');
        console.log("id", id)
        if (storedCheckin) {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
            setLoading(true); // Start loading
            setShowOffers(false); // Hide previous offers
            setError(''); // Clear any previous errors
            fetchData(storedCheckin, id, sortOption)
                .then((data) => {
                    console.log("i got data", data);
                    setLoading(false); // Stop loading
                    setShowOffers(true); // Show offers after fetching
                })
                .catch(err => {
                    setLoading(false); // Stop loading on error
                    setError(err.message || 'An error occurred'); // Set error message
                });

        }
    }, [sortOption]);
    useEffect(() => {
        const token = localStorage.getItem("token"); // Set isLoggedIn to true if token exists
    }, [showLogin]);
    // Check for token on component mount and when showLogin changes
    // Re-check when showLogin changes to reflect login/logout 

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
        localStorage.setItem('location', selectedCityId);
        fetchData(formattedCheckin, selectedCityId);
        navigate("/avail2");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Update the state immediately on logout
        alert("Logged out successfully");
    };
    const handleSortChange = (e) => {
        const selectedValue = e.target.value;

        // Set the state based on the selected sort option
        if (selectedValue === "lowToHigh") {
            setSortOption('1'); // Set to 1 for Low to High
        } else if (selectedValue === "highToLow") {
            setSortOption('2'); // Set to 2 for High to Low
        } else {
            setSortOption(""); // Reset if no selection
        }
    };

    const today = new Date().toISOString().split('T')[0];
    return (
        <div>
            {loading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <div>
                    <div className='avail2-navbar'>
                        <div className='avail2-top-nav'>
                            <div className="avail2-logo">
                                <img src={logoimage} alt="Logo" height='60px' width='900px' />
                            </div>
                            <div className='avail2-right-side'>
                                <div>
                                    {localStorage.getItem('token') ? (
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
            <label htmlFor="sortOptions"><b>Sort by:</b></label>
            <select
                id="sortOptions"
                value={sortOption === 1 ? "lowToHigh" : sortOption === 2 ? "highToLow" : ""}
                onChange={handleSortChange}
            >
                <option value="">Select</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
            </select>
        </div>

                    </div>

                    <div className='avail2-hotel-search'>
                        {/* Render hotel offers or error here */}
                        {error && <p className="error">{error}
                            <h1>Please Reload Again</h1></p>}
                        {showOffers && !loading && !error && <HotelOffers />}
                    </div>
                    <div className='LoginSignup'>{showLogin && <Login closeModal={toggleLoginModal} />}</div>
                </div>
            )}
        </div>
    );
};

export default Avail2;
