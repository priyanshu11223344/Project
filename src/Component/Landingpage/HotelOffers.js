import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {parseString} from 'xml2js'
import Cardcomponent from './Cardcomponent'
const HotelOffers = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:4000/', {
          headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8'
          }
        });

        

        // Parse the XML response to JSON
        parseString(response.data, (err, result) => {
          if (err) {
            setError('Error parsing XML');
            console.error(err);
          } else {
            console.log(result);
            const makeRequestResult = result['soap:Envelope']['soap:Body'][0]['MakeRequestResponse'][0]['MakeRequestResult'][0];
            const parsedData = JSON.parse(makeRequestResult); // Parse the JSON string
            console.log(parsedData)
            setData(parsedData.Hotels); // Set the hotels array
          }
        });
      }
       catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Available Hotels</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map((hotel, index) => (
            <Cardcomponent
              key={index}
              title={hotel.HotelName}
              description={`Location: ${hotel.Location}, Price: ${hotel.Offers[0]?.TotalPrice || 'N/A'} ${hotel.Offers[0]?.Currency || 'N/A'}`}
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
