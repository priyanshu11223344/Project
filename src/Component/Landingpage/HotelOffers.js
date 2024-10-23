import React, { useEffect, useState } from 'react';
import Cardcomponent from './Cardcomponent'
import Hotelcontext from '../../context/Hotelcontext';
import { useContext } from 'react';
import "./HotelOffers.css"
const HotelOffers = () => {
  const context=useContext(Hotelcontext);
  const{fetchData,data}=context;
  // const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchData()
  }, []);
  return (
    <div >
     
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      {data.length > 0 ? (
        <div  className='hotelmap'>
          {data.map((hotel, index) => (
            <Cardcomponent
              key={index}
              title={hotel.HotelName}
              description={`Location: ${hotel.Location}`}
              price={`Price: ${hotel.Offers[0]?.TotalPrice || 'N/A'} ${hotel.Offers[0]?.Currency || 'N/A'}`}
              additionalData={`Category: ${hotel.Offers[0]?.Category}, Rooms: ${hotel.Offers[0]?.Rooms.join(', ')}`}
            />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default HotelOffers
