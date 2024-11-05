import React, { useContext, useEffect, useState } from 'react';
import "./Availability.css";
import HotelOffers from './HotelOffers';
import Hotelcontext from '../../context/Hotelcontext';
import { Rings } from 'react-loader-spinner';
import Loader from '../Loader/Loader';
const Availability = () => {
    const { fetchData } = useContext(Hotelcontext);
    const [showOffers, setShowOffers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch data with a 10-second delay

    useEffect(() => {
        // Fetch data on component mount if needed
        const storedCheckin = localStorage.getItem('checkin');
        if (storedCheckin) {
            setLoading(true); // Start loading
            setShowOffers(false); // Hide previous offers
            setError(''); // Clear any previous errors
              fetchData(storedCheckin)
            .then(() => {
                setLoading(false); // Stop loading
                setShowOffers(true); // Show offers after fetching
            })
            .catch(err => {
                setLoading(false); // Stop loading on error
                setError(err.message || 'An error occurred'); // Set error message
            });
            
        }
    }, []); // Empty dependency array to run on mount

    return (
        <div className='main-c'>
            {loading && (
                            <div className="loader-container">
                                <Loader/>
                            </div>
                        )}
            <div className='container'>
                
                <div className='card-main'>
                    
                    <div className='card'>
                        
                      
                        {error && <div>{error}</div>} {/* Show error message if there's an error */}
                        {showOffers && !loading && !error &&<HotelOffers />} {/* Show offers only if not loading and no error */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability;
