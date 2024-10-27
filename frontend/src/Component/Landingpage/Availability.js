import React, { useContext, useEffect, useState } from 'react';
import "./Availability.css";
import HotelOffers from './HotelOffers';
import Hotelcontext from '../../context/Hotelcontext';
import { Rings } from 'react-loader-spinner';

const Availability = () => {
    const { fetchData } = useContext(Hotelcontext);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch data with a 10-second delay
    const handleCheckAvailability =async () => {
        const storedCheckin = localStorage.getItem('checkin');
        if (storedCheckin) {
            setLoading(true); // Start loading
            setShowOffers(false); // Hide previous offers
            setError(''); // Clear any previous errors
             await fetchData(storedCheckin)
            .then(() => {
                setLoading(false); // Stop loading
                setShowOffers(true); // Show offers after fetching
            })
            .catch(err => {
                setLoading(false); // Stop loading on error
                setError(err.message || 'An error occurred'); // Set error message
            });
            
        }
    };

    useEffect(() => {
        handleCheckAvailability(); // Fetch data on component mount if needed
    }, []); // Empty dependency array to run on mount

    return (
        <div>
            <div className='container'>
                <div className='main-text'><h1>WELCOME TO OUR SERVICES</h1></div>
                <div className='card-main'>
                    <div className='welcome-text'>AVAILABLE HOTELS</div>
                    <div className='card'>
                        {loading && (
                            <div className="loader-container">
                                <Rings
                                    height="100"
                                    width="100"
                                    color="#4fa94d"
                                    radius="6"
                                    visible={true}
                                    ariaLabel="rings-loading"
                                />
                                <p>Loading offers...</p>
                            </div>
                        )}
                        {error && <div>{error}</div>} {/* Show error message if there's an error */}
                        {showOffers && !loading && !error && <HotelOffers />} {/* Show offers only if not loading and no error */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability;
