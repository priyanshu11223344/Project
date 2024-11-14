import React, { useState } from "react";
import Hotelcontext from "./Hotelcontext";
import axios from "axios";  // Import the xml2js parser

const HotelProvider = (props) => {
  const [dataold, setData] = useState([]);
  const [error, setError] = useState('');
  const [check, setCheck] = useState('');
  const[info,setinfo]=useState([]);
  //const url_back='https://project-1-back.vercel.app';
 const url_back='http://localhost:8000';
 const fetchData = async (check,id,scode) => {
  console.log("id in cotext is",id);
  return new Promise(async (resolve, reject) => {
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
                <Main Version="2.3" ResponseFormat="JSON" IncludeGeo="false" Currency="USD" HotelFacilities="True" RoomFacilities="True">
                  <SortOrder>${scode}</SortOrder>
                  <FilterPriceMin>0</FilterPriceMin>
                  <FilterPriceMax>10000</FilterPriceMax>
                  <MaximumWaitTime>15</MaximumWaitTime>
                  <MaxResponses>500</MaxResponses>
                  <FilterRoomBasises>
                    <FilterRoomBasis>HB</FilterRoomBasis>
                    <FilterRoomBasis>BB</FilterRoomBasis>
                  </FilterRoomBasises>
                  <Nationality>GB</Nationality>
                  <CityCode>${id}</CityCode>
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
          headers: { 'Content-Type': 'application/xml' },
          timeout: 16000, // Set a timeout of 16 seconds
        });
        console.log("Data fetched successfully:", response.data);
        setData(response.data);
        success = true;
        resolve(response.data); // Resolve the promise with the fetched data
        break; // Exit the loop on success
      } catch (err) {
        retries -= 1;
        console.error("Retrying...", retries, err);
      }
    }

    // Only set error if all retries are exhausted without success
    if (!success) {
      setError("Error fetching data after multiple attempts");
      reject(new Error("Failed to fetch data after multiple attempts"));
    }
  });
};




  //get route
  const infodata = async (code) => {
    return new Promise(async (resolve, reject) => {
        const soapXML = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
            <soap12:Body>
                <MakeRequest xmlns="http://www.goglobal.travel/">
                    <requestType>6</requestType>
                    <xmlRequest><![CDATA[
                        <Root>
                            <Header>
                                <Agency>148535</Agency>
                                <User>REISENBOOKINGXMLTEST</User>
                                <Password>JHJDO58X0EV</Password>
                                <Operation>HOTEL_INFO_REQUEST</Operation>
                                <OperationType>Request</OperationType>
                            </Header>
                            <Main Version="2.2">
                                <InfoHotelId>${code}</InfoHotelId>
                                <InfoLanguage>en</InfoLanguage>
                            </Main>
                        </Root>
                    ]]></xmlRequest>
                </MakeRequest>
            </soap12:Body>
        </soap12:Envelope>`;

        let iretries = 2;
        let isuccess = false;

        while (iretries > 0 && !isuccess) {
            try {
                const response = await axios.post(`${url_back}/hotelinfo`, soapXML, {
                    headers: { 'Content-Type': 'application/xml' },
                    timeout: 10000,  // Set a timeout of 10 seconds
                });
                console.log("info-data fetched", response.data);
                setinfo(response.data);
                isuccess = true;  // Set success flag if request completes
                resolve(response.data);  // Resolve the promise with the fetched data
            } catch (err) {
                iretries -= 1;
                console.error("Retrying...", iretries, err);
                if (iretries === 0) {
                    setError("Error fetching data after multiple attempts at info");
                    reject(new Error("Failed to fetch info data")); // Reject the promise
                }
            }
        }
    });
};

  
  
  
  return (
    <Hotelcontext.Provider value={{ fetchData, dataold, error, setCheck, check,info,setinfo,infodata }}>
      {props.children}
    </Hotelcontext.Provider>
  );
};

export default HotelProvider;
