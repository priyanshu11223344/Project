import React, { useState, useEffect, useContext } from 'react';
import logoimage from '../../images/logo withoutBG.png';
import './Hotelinfo.css';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Hotelcontext from '../../context/Hotelcontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Login from '../Loginsignup/Loginsignup';
import { Modal, Button } from 'react-bootstrap';
import StarRating from './StarRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RoomCard from './RoomCard';
import cityData from "./cityData.js";  // Import city data from the JS file
import {
    faBell,
    faParking,
    faWifi,
    faShieldAlt,
    faGlassMartiniAlt,
    faDumbbell,
    faSpa,
    faSwimmingPool,
    faLock,
    faBowlFood,
    faCar,
    faWifi3,
    faChair,
    faTheaterMasks,
    faBicycle,
    faChargingStation,
    faWheelchair,
    faMapSigns,
    faConciergeBell,
    faCoffee,
    faTv,
    faGolfBallTee,
    faHeartPulse,
    faTableTennisPaddleBall,
    faCocktail
} from '@fortawesome/free-solid-svg-icons';

const Hotelinfo = () => {
    const [adults, setAdults] = useState(1);
    //const url_back='https://project-1-back.vercel.app';
    const url_back = 'http://localhost:8000';
    const stripHtmlnew = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;

        let text = div.innerText || div.textContent || '';

        // Replace <br> tags with new lines
        text = text.replace(/<br\s*\/?>/gi, '\n');

        // Convert <ul> and <li> into bullet points
        const ulElements = div.querySelectorAll('ul');
        ulElements.forEach(ul => {
            const listItems = ul.querySelectorAll('li');
            let bulletPoints = '';

            listItems.forEach(li => {
                bulletPoints += `• ${li.textContent.trim()}\n`;  // Add bullet point and new line
            });

            // Replace the <ul> with the bullet point list
            text = text.replace(ul.outerHTML, bulletPoints.trim());
        });

        return text;
    };

    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [selectedRoomRemark, setSelectedRoomRemark] = useState(null)
    const handleShowRoomDetailModal = (remark) => {
        setSelectedRoomRemark(remark); // Set the remark for the selected room
        setShowRoomDetailModal(true);  // Open the room details modal
    };
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [filteredCities, setFilteredCities] = useState([]);
    const handleCloseRoomDetailModal = () => setShowRoomDetailModal(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]); // State to hold images
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const {  infodata} = useContext(Hotelcontext);
    const [fetchedData, setFetchedData] = useState(false); // State to track if data has been fetched
    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    };
    const [data, setdata] = useState([]);
    const [cardData, setcardData] = useState({});
    const [Hoteldesc, sethoteldesc] = useState("");
    const [Hname, setname] = useState('');
    const [fdata, setfdata] = useState("");

    const iconMap = {
        "24-hour front desk": faBell,
        "Parking": faParking,
        "Free Wifi": faWifi,
        "Safety protocols": faShieldAlt,
        "Bar(s)": faGlassMartiniAlt,
        "Gym": faDumbbell,
        "Spa": faSpa,
        "Pool": faSwimmingPool,
        "Hotel Safe": faLock,
        "Restaurant(s)": faBowlFood,
        "Internet access": faWifi,
        "Car Park": faCar,
        "WLAN access": faWifi3,
        "Room Service": faConciergeBell,
        "TV Room": faTv,
        "Café": faCoffee,
        "Lifts": faMapSigns,
        "Conference Room": faTheaterMasks,
        "Laundry Service": faHeartPulse,
        "Medical Assistance": faHeartPulse,
        "Bicycle Hire": faBicycle,
        "Cycling/Mountain Biking": faBicycle,
        "Golf": faGolfBallTee,
        "Billiards/Snooker": faTableTennisPaddleBall,
        "Air conditioning": faChargingStation,
        "Wheelchair accessible": faWheelchair,
        "Entertainment": faCocktail,
        "Pub(s)": faGlassMartiniAlt,
        "High Chairs": faChair,
        "Non-smoking Area": faChair,
        "Garage": faCar,
        "Restaurant(s) with non-smoking area": faChair
    };


    useEffect(() => {
        const value = localStorage.getItem('hotelid');
        const required = JSON.parse(localStorage.getItem('hoteldata'));
        const hotelName = required.HotelName;
        console.log("name is", hotelName)
        console.log('hotelid:', value);
        console.log("i am in hotelinfo", required);
        // const token = localStorage.getItem("token");
        setcardData(required);
        if (value && !fetchedData) {
            setLoading(true);
            setShowOffers(false);

            infodata(value)
                .then((data) => {
                    setLoading(false);
                    setShowOffers(true);
                    setdata(data);
                    setname(data.Root.Main[0].HotelName);
                    const cleanedDescription = stripHtmlnew(data.Root.Main[0].Description);
                    setfdata(cleanedDescription);
                    sethoteldesc(cardData.HotelFacilities);
                    const fetchedImages = data.Root.Main[0].Pictures[0].Picture.map(picture => ({
                        url: picture._,
                        description: picture.$.Description,
                    }));
                    setImages(fetchedImages);
                    setFetchedData(true);
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err.message || 'An error occurred while fetching hotel information.');
                });
        }
    }, [fetchedData]);
    useEffect(() => {
        const token = localStorage.getItem("token"); // Set isLoggedIn to true if token exists
    }, [showLogin]);

    console.log("hotel fac is", Hoteldesc)

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
        localStorage.setItem('location', selectedCityId);
        navigate("/avail2");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logged out successfully');
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
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const today = new Date().toISOString().split('T')[0];
    const handleBookClick = async (price, curr, name, image) => {
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token is found, show the login modal
            alert("Please Login First!")
            toggleLoginModal();
            return;
        }
        console.log("Hotel details:", price, curr, name, image);

        try {
            // Call backend to create checkout session
            const response = await axios.post(`${url_back}/create-checkout-session`, {
                amount: price * 100, // Amount in cents
                currency: curr || 'usd',
                name: name,
                image: image
            });

            const sessionId = response.data.id; // Ensure `sessionId` is correctly extracted

            if (!sessionId) {
                throw new Error("No session ID returned from backend.");
            }

            const stripe = await loadStripe('pk_test_51QErKCCKkgmSQ5qkmnBDZTbCaWm5YpMH3Jm53JxIcYg39EqXWDpOy6sAPIJlToG3yTzN53xlWrou2OpSEtiD9sgN00i1v6Ge2o');

            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error("Error redirecting to Stripe Checkout:", error);
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    return (
        <div>
            {loading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <div>
                    <div className="hotelinfo-navbar">
                        <div className="hotelinfo-top-nav">
                            <div className="hotelinfo-logo">
                                <img src={logoimage} alt="Logo" height="60px" width="900px" />
                            </div>
                            <div className="hotelinfo-right-side">
                                <div>
                                    {localStorage.getItem("token") ? (
                                        <button className="hotelinfo-custom-button" onClick={handleLogout}>
                                            LOGOUT
                                        </button>
                                    ) : (
                                        <button className="hotelinfo-custom-button" onClick={toggleLoginModal}>
                                            Login or Create Account
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hotelinfo-search">
                        <div className="hotelinfo-hero">
                            <div className="hotelinfo-hero-content">
                                <form className="hotelinfo-booking-form">
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
                                    <button
                                        className="check-availability-button"
                                        onClick={handleCheckAvailability}
                                    >
                                        Check Availability
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {showOffers && (
                        <div className="hotelinfo-hotel-search">
                            <div className="container mt-4">
                                <div className="image-grid">
                                    <div className="image-large">
                                        <img src={images[0].url} alt="Large Image" />
                                    </div>
                                    <div className="image-small-container">
                                        {images.slice(1, 5).map((image, index) => (
                                            <div key={index} className="image-small">
                                                <img src={image.url} alt={`Small Image ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='btn-modal'>
                                    <Button variant="primary" onClick={handleShow} className="modal-button">See All</Button>
                                    <div className='Hotelname'>{Hname}</div> {/* This stays below the button */}

                                    <Modal show={showModal} onHide={handleClose} dialogClassName="custom-modal-width" size="lg">
                                        <Modal.Header closeButton>
                                            <Modal.Title>All Images</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="modal-image-grid">
                                                {images.map((imageObj, index) => (
                                                    <div key={index} className="image-container">
                                                        <img src={imageObj.url} alt="" className="modal-image" />
                                                        <p className="image-description">{imageObj.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                                <StarRating rating={data.Root.Main[0].Category} /> {/* Pass the numerical rating here */}

                                <div className="Hoteldesc">
                                    <h3>HOTEL FACILITIES</h3>
                                    <div className="facility-grid">
                                        <div className="row">
                                            {/* Split facilities into two arrays for balanced display */}
                                            <div className="col-6">
                                                <ul>
                                                    {cardData.HotelFacilities.slice(0, 4).map((facility, index) => (
                                                        <li key={index}>
                                                            <FontAwesomeIcon icon={iconMap[facility] || faShieldAlt} />
                                                            {facility.replace(/<br\s*\/?>/gi, ' ')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="col-6">
                                                <ul>
                                                    {cardData.HotelFacilities.slice(4, 9).map((facility, index) => (
                                                        <li key={index}>
                                                            <FontAwesomeIcon icon={iconMap[facility] || faShieldAlt} />
                                                            {facility.replace(/<br\s*\/?>/gi, ' ')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h3>CHOOSE YOUR ROOM</h3>
                                <div className="room-cards-container">


                                    {cardData.Offers?.map((offer, index) => {
                                        // Filter images with "room" in their description
                                        const roomImages = images.filter(image => image.description.includes("Room"));
                                        const randomIndex = Math.floor(Math.random() * roomImages.length);
                                        return (
                                            <RoomCard
                                                key={index}
                                                images={roomImages}  // Pass the filtered images to RoomCard
                                                roomType={offer.Rooms.join(', ')}
                                                price={offer.TotalPrice}
                                                currency={offer.Currency}
                                                remark={offer.Remark ? offer.Remark.replace(/<br\s*\/?>/gi, ' ') : ''}
                                                special={offer.Special ? offer.Special.replace(/<br\s*\/?>/gi, ' ') : "None"}
                                                cancellationDeadline={offer.CxlDeadLine}
                                                roomFacilities={cardData.RoomFacilities.slice(0, 7)}
                                                onShowRemark={() => handleShowRoomDetailModal(offer.Remark ? offer.Remark.replace(/<br\s*\/?>/gi, ' ') : '')}
                                                handleBookClick={() => handleBookClick(offer.TotalPrice, offer.Currency, cardData.HotelName, roomImages[0]?.url)}
                                                initialIndex={randomIndex}
                                            />
                                        );
                                    })}



                                    <Modal show={showRoomDetailModal} onHide={handleCloseRoomDetailModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Room Details</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>{selectedRoomRemark}</p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCloseRoomDetailModal}>Close</Button>
                                        </Modal.Footer>
                                    </Modal>


                                </div>
                            </div>
                            <div className='f-desc'>
                                <h2>DESCRIPTION</h2>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{fdata}</p> {/* This will preserve new lines */}
                            </div>


                        </div>
                    )}
                </div>

            )}
            <div className='LoginSignup'>{showLogin && <Login closeModal={toggleLoginModal} />}</div>
        </div>
    );
};

export default Hotelinfo;
