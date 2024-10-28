import React, { useContext, useEffect, useState } from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import './HotelOffers.css';
import { Audio } from 'react-loader-spinner';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
const stripePromise = loadStripe('pk_test_51QErKCCKkgmSQ5qkmnBDZTbCaWm5YpMH3Jm53JxIcYg39EqXWDpOy6sAPIJlToG3yTzN53xlWrou2OpSEtiD9sgN00i1v6Ge2o');
const HotelOffers = () => {
    const context = useContext(Hotelcontext);
    const { fetchData, data } = context;
    // const [temp, setTemp] = useState([]);

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
    
        const stripe = await stripePromise;
    
        try {
            // Send the request to create a payment intent
            const response = await axios.post('https://project-1-back.vercel.app/create-payment-intent', {
                amount: Math.round(hotelDetails.Offers[0].TotalPrice * 100), // Amount in cents
                currency: hotelDetails.Offers[0].Currency || 'usd'
            });
    
            const { clientSecret } = response.data;
    
            // Use a Stripe test card token for testing purposes
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: 'pm_card_visa' // Stripe's predefined test token
            });
    
            if (result.error) {
                console.error(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment successful!');
                // Additional actions, like redirecting to a success page or storing booking details
            }
        } catch (error) {
            console.error('Error processing payment:', error);
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
