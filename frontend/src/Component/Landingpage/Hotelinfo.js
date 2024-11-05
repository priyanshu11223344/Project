import React, { useState, useEffect, useContext } from 'react';
import logoimage from '../../images/logo withoutBG.png';
import './Hotelinfo.css';
import Hotelcontext from '../../context/Hotelcontext';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Login from '../Loginsignup/Loginsignup';
import { Modal, Button } from 'react-bootstrap';

const Hotelinfo = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]); // State to hold images
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { fetchData, infodata, info } = useContext(Hotelcontext);
    const [randomIndices, setRandomIndices] = useState([]);
    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);
    const [visible, setVisible] = useState(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    };

    useEffect(() => {
        const value = localStorage.getItem('hotelid');
        if (value) {
            setLoading(true);
            infodata(value)
                .then((data) => {
                    setLoading(false);
                    setShowOffers(true);
                    const fetchedImages = info.Root.Main[0].Pictures[0].Picture.map(picture => ({
                        url: picture._,
                        description: picture.$.Description,
                    }));
                    setImages(fetchedImages);
                    setRandomIndices(getRandomIndices(fetchedImages, 5)); // Initial random indices
                    setVisible(true); // Initially set images as visible
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err.message || 'An error occurred while fetching hotel information.');
                });
        }
    }, []);

    // Update random indices every 3 seconds with transition
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false); // Start by hiding images

            // After a short delay, update indices and make images visible again
            setTimeout(() => {
                setRandomIndices(getRandomIndices(images, 5));
                setVisible(true); // Show images with new indices
            }, 1000); // Delay to match CSS transition duration (1s)
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [images]);



    const handleCheckAvailability = async (e) => {
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
        try {
            setLoading(true);
            await fetchData(formattedCheckin);
            setLoading(false);
            navigate('/Availability');
        } catch (err) {
            setLoading(false);
            setError(err.message || 'An error occurred while checking availability.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('Logged out successfully');
    };
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const today = new Date().toISOString().split('T')[0];
    function getRandomIndices(array, count) {
        const indices = new Set();
        while (indices.size < count) {
            const randomIndex = Math.floor(Math.random() * Math.min(array.length, 20));
            indices.add(randomIndex);
        }
        return [...indices];
    }
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
                                    {isLoggedIn ? (
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
                                        <input type="text" placeholder="Location" />
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
                            <div className="container mt-4">
                        <div className="image-collage">
                            {randomIndices.map((index, i) => (
                                <div
                                    key={i}
                                    className={`image-item ${i === 0 ? 'large' : 'small'} ${visible ? 'visible' : ''}`}
                                >
                                    <img src={images[index].url} alt={`Image ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                                <Button variant="primary" onClick={handleShow} className="mt-3">See All</Button>

                                <Modal show={showModal} onHide={handleClose} dialogClassName="custom-modal-width" size="lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>All Images</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="modal-image-grid">
                                            {images.map((imageObj, index) => (
                                                <div key={index} className="image-container">
                                                    <img src={imageObj.url} alt={`Image ${index + 1}`} className="modal-image" />
                                                    <p className="image-description">{imageObj.description}</p> {/* Make sure description is accessed correctly */}
                                                </div>
                                            ))}
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                                    </Modal.Footer>
                                </Modal>




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
