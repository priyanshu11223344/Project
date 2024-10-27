import React, { useContext } from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import './HotelOffers.css';
import { Audio } from 'react-loader-spinner';

const HotelOffers = () => {
    const context = useContext(Hotelcontext);
    const { fetchData, data } = context;

    console.log(data);

    const stripHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Function to truncate remark to 50 words
    const truncateRemark = (remark, wordLimit = 20) => {
        const words = remark.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...'; // Truncate and add ellipsis
        }
        return remark; // Return the full remark if it's within the limit
    };

    return (
        <div>
            {data.length > 0 ? (
                <div className='hotelmap'>
                    {data.map((hotel, index) => (
                        <Cardcomponent
                            key={index}
                            image={hotel.HotelImage}
                            title={hotel.HotelName}
                            description={`Location: ${hotel.Location}`}
                            price={`Price: ${hotel.Offers[0]?.TotalPrice || 'N/A'} ${hotel.Offers[0]?.Currency || 'N/A'}`}
                            additionalData={`Category: ${hotel.Offers[0]?.Category}, Rooms: ${hotel.Offers[0]?.Rooms.join(', ')}`}
                            Special={`Special: ${stripHtml(hotel.Offers[0]?.Special)}`}
                            remark={`Remark: ${truncateRemark(stripHtml(hotel.Offers[0]?.Remark))}`} // Use the truncate function here
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
                    <p>Loading offers...</p> {/* Optional loading text */}
                </div>
            )}
        </div>
    );
};

export default HotelOffers;
