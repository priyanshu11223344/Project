import React, { useState } from "react";
import Hotelcontext from "./Hotelcontext";
import axios from "axios";
import { parseString } from "xml2js";  // Import the xml2js parser

const HotelProvider = (props) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const fetchData = async (checkin) => {  // Accept checkin (and checkout if needed) as parameters
    console.log(checkin);
    try {
       
      const response = await axios.post('http://localhost:4000/',{checkin}, {
          // Send checkin date to the backend (you can add checkout as well)
      }, {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8'
        }
      });

      // Console log the XML response to ensure it's received correctly
      

      // Use xml2js to parse the XML response
      parseString(response.data, (err, result) => {
        if (err) {
          setError('Error parsing XML');
          console.error(err);
        } else {
          // Navigate through the XML structure to extract relevant data
          const makeRequestResult = result['soap:Envelope']['soap:Body'][0]['MakeRequestResponse'][0]['MakeRequestResult'][0];

          // If makeRequestResult is in JSON string format within XML, parse it
          try {
            const parsedData = JSON.parse(makeRequestResult);  // Ensure makeRequestResult is a JSON string
            console.log(parsedData);
            setData(parsedData.Hotels);  // Assuming parsedData contains a 'Hotels' key
          } catch (jsonParseError) {
            setError('Error parsing MakeRequestResult JSON');
            console.error(jsonParseError);
          }
        }
      });

    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    }
  };

  return (
    <Hotelcontext.Provider value={{ fetchData, data, error }}>
      {props.children}
    </Hotelcontext.Provider>
  );
};

export default HotelProvider;
