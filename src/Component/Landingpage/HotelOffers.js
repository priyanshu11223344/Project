import React from 'react';
import Cardcomponent from './Cardcomponent';
import Hotelcontext from '../../context/Hotelcontext';
import { useContext } from 'react';
import './HotelOffers.css';

const HotelOffers = () => {
  const context = useContext(Hotelcontext);
  const {  data } = context;
  console.log(data);
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
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
              remark={`Remark:${stripHtml(hotel.Offers[0]?.Remark)}`}
            />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HotelOffers;
