import React, { useState } from "react";
import Hotelcontext from "./Hotelcontext";
import axios from "axios";
import { parseString } from "xml2js";  // Import the xml2js parser

const HotelProvider = (props) => {
  const [data, setData] = useState([]);
  const [data1,setdata1]=useState([]);
  const [error, setError] = useState('');
  const [check,setcheck]=useState('');
  const fetchData = async (check) => {  // Accept checkin (and checkout if needed) as parameters
 
    console.log(check);
    const soapXML = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
    <MakeRequest xmlns="http://www.goglobal.travel/">
    <requestType>11</requestType>
    <xmlRequest><![CDATA[
    <Root>
    <Header>
    <Agency>148535</Agency>
    <User>REISENBOOKINGXMLTEST</User>
    <Password>JHJDO58X0EV</Password>
    <Operation>HOTEL_SEARCH_REQUEST</Operation>
    <OperationType>Request</OperationType>
    </Header>
    <Main Version="2.3" ResponseFormat="JSON" IncludeGeo="false" Currency="USD">
    <SortOrder>1</SortOrder>
    <FilterPriceMin>0</FilterPriceMin>
    <FilterPriceMax>10000</FilterPriceMax>
    <MaximumWaitTime>15</MaximumWaitTime>
    <MaxResponses>500</MaxResponses>
    <FilterRoomBasises>
    <FilterRoomBasis>HB</FilterRoomBasis>
    <FilterRoomBasis>BB</FilterRoomBasis>
    </FilterRoomBasises>
    <Nationality>GB</Nationality>
    <CityCode>75</CityCode>
    <Hotels>
    <!-- <HotelId>226</HotelId> -->
    </Hotels>
    <ArrivalDate>${check}</ArrivalDate>
    <Nights>3</Nights>
    <Stars>5</Stars>
    <Rooms>
    <Room Adults="2" RoomCount="1" ChildCount="1">
        <ChildAge>5</ChildAge>
        </Room>
    <Room Adults="1" RoomCount="1" ChildCount="1">
    <ChildAge>9</ChildAge>
    
    </Room>
    </Rooms>
    </Main>
    </Root>
    ]]></xmlRequest>
    </MakeRequest>
    </soap12:Body>
    </soap12:Envelope>`;
    try {
       
      const response = await axios.post('http://localhost:8000/send-soap-request', soapXML, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
      console.log(response.data)

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
    <Hotelcontext.Provider value={{ fetchData, data, error,setcheck,check ,data1,setdata1}}>
      {props.children}
    </Hotelcontext.Provider>
  );
};

export default HotelProvider;
