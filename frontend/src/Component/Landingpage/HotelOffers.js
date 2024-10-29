import React, { useContext } from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import './HotelOffers.css';
import { Audio } from 'react-loader-spinner';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
// const stripePromise = loadStripe('');
const HotelOffers = () => {
    const context = useContext(Hotelcontext);
    const {  data } = context;
    // const [temp, setTemp] = useState([]);
    const url_back='https://project-1-back.vercel.app';
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

    const handleBookClick = async (hotelDetails) => {
        console.log("Hotel details:", hotelDetails);
        
        try {
            // Call backend to create checkout session
            const response = await axios.post(`${url_back}/create-checkout-session`, {
                amount: hotelDetails.Offers[0].TotalPrice * 100, // Amount in cents
                currency: hotelDetails.Offers[0].Currency || 'usd',
                name:hotelDetails.HotelName,
                image:hotelDetails.HotelImage
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
    
    

    // Log temp state whenever it updates
    // useEffect(() => {
    //     console.log("Updated temp:", temp);
    // }, [temp]);

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
                            handleBookClick={() => handleBookClick(hotel)} // Pass hotel details to handleBookClick
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
