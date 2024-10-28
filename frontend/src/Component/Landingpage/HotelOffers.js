import React, { useContext, useEffect, useState } from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import './HotelOffers.css';
import { Audio } from 'react-loader-spinner';

const HotelOffers = () => {
    const context = useContext(Hotelcontext);
    const { fetchData, data } = context;
    const [temp,setTemp]=useState([]);
    // Helper functions
    const stripHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const truncateRemark = (remark, wordLimit = 20) => {
        const words = remark.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return remark;
    };

    const handleBookClick = (hotelDetails) => {
        console.log("Hotel details:", hotelDetails);
        setTemp(hotelDetails);
        console.log("temp is",temp); // Logs the details of the clicked hotel
    };

    return (
        <div>
            {data?.Hotels?.length > 0 ? (
                <div className="hotelmap">
                    {data.Hotels.map((hotel, index) => (
                        <Cardcomponent
                            key={index}
                            image={hotel.HotelImage}
                            title={hotel.HotelName}
                            description={`Location: ${hotel.Location || 'N/A'}`}
                            price={`Price: ${hotel.Offers?.[0]?.TotalPrice || 'N/A'} ${hotel.Offers?.[0]?.Currency || 'N/A'}`}
                            additionalData={`Category: ${hotel.Offers?.[0]?.Category || 'N/A'}, Rooms: ${hotel.Offers?.[0]?.Rooms?.join(', ') || 'N/A'}`}
                            Special={`Special: ${stripHtml(hotel.Offers?.[0]?.Special || "NONE")}`}
                            remark={`Remark: ${truncateRemark(stripHtml(hotel.Offers?.[0]?.Remark || ''))}`}
                            handleBookClick={handleBookClick} // Pass handleBookClick function
                            hotelDetails={hotel} // Pass entire hotel object for detailed logging
                        />
                    ))}
                </div>
            ) : (
                <div className="loader-container">
                    <Audio
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="audio-loading"
                        visible={true}
                    />
                    <p>Loading offers...</p>
                </div>
            )}
        </div>
    );
};

export default HotelOffers;
