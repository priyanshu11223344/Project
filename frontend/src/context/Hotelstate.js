import React, { useState } from "react";
import Hotelcontext from "./Hotelcontext";
import axios from "axios";
import { parseString } from "xml2js";  // Import the xml2js parser

const HotelProvider = (props) => {
  const [data, setData] = useState([]);
  const [data1,setData1]=useState([]);
  const [error, setError] = useState('');
  const [check, setCheck] = useState('');
  const url_back='https://project-1-back.vercel.app';
// const url_back='http://localhost:8000';
  const fetchData = async (check) => {
    // console.log(check);
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
                <MaximumWaitTime>5</MaximumWaitTime>
                <MaxResponses>100</MaxResponses>
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

    let retries = 2;
  let success = false;

  while (retries > 0 && !success) {
    try {
       const response = await axios.post(`${url_back}/send-soap-request`, soapXML, {
        // const response = await axios.post('http://localhost:8000/send-soap-request', soapXML, {
        headers: { 'Content-Type': 'application/xml' },
        timeout: 10000,  // Set a timeout of 10 seconds
      });
      // console.log("data fetched", response.data);
      setData(response.data);
      success = true;  // Set success flag if request completes
    } catch (err) {
      retries -= 1;
      console.error("Retrying...", retries, err);
      if (retries === 0) setError("Error fetching data after multiple attempts");
    }
  }
  };
  //get route
  
  
  
  return (
    <Hotelcontext.Provider value={{ fetchData, data, error, setCheck, check, }}>
      {props.children}
    </Hotelcontext.Provider>
  );
};

export default HotelProvider;
