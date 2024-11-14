import React, { useContext } from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import './HotelOffers.css';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NoResults from './Notfound';
import "./HotelOffers.css"
// const stripePromise = loadStripe('');
const HotelOffers = () => {
    const context = useContext(Hotelcontext);
    const navigate = useNavigate();
    const { dataold, infodata } = context;
    // const [temp, setTemp] = useState([]);
    const url_back='https://project-1-back.vercel.app';
    //const url_back = 'http://localhost:8000';
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
                name: hotelDetails.HotelName,
                image: hotelDetails.HotelImage
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
    const handleinfoclick = async (hotelDetails) => {
        const val = hotelDetails.HotelCode;
        console.log("hotel offer is", hotelDetails);
        console.log(val);
        const hoteldata = hotelDetails;
        console.log("details of hotel below is", hoteldata)
        localStorage.setItem('hotelid', val);
        localStorage.setItem('hoteldata', JSON.stringify(hotelDetails)); // Use JSON.stringify here

        try {
            await infodata(val); // Wait for the infodata promise to resolve
            navigate("/hotelinfo"); // Proceed to navigate only after the data is fetched
        } catch (error) {
            console.error("Failed to fetch hotel info:", error);
            // Optionally show an error message to the user
        }
    };

    return (
        <div>
            {dataold?.Hotels?.length > 0 ? (
                <div >
                    {dataold.Hotels.map((hotel, index) => (
                        <Cardcomponent
                            key={index}
                            image={hotel.HotelImage}
                            title={hotel.HotelName}
                            description={` ${hotel.Location || 'NONE'}`}
                            price={`Price: ${hotel.Offers?.[0]?.TotalPrice || 'NONE'} ${hotel.Offers?.[0]?.Currency || 'NONE'}`}
                            additionalData={` ${hotel.Offers?.[0]?.Category || 'NONE'} `}
                            roomData={` ${hotel.Offers?.[0]?.Rooms?.join(', ') || 'NONE'}`}
                            Special={`${stripHtml(hotel.Offers?.[0]?.Special || "NONE")}`}
                            remark={`Remark: ${truncateRemark(stripHtml(hotel.Offers?.[0]?.Remark || ''))}`}
                            handleBookClick={() => handleBookClick(hotel)} // Pass hotel details to handleBookClick
                            handleinfoclick={() => handleinfoclick(hotel)}
                        />
                    ))}
                </div>
            ) : (
                <div className="loader-container">
                    <NoResults/>
                </div>
            )}
        </div>
    );
};

export default HotelOffers;
