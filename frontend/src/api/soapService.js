// export const fetchSOAPResponse = async () => {
//     try {
//       const response = await fetch('https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'text/xml', // Ensure the request is in SOAP format
//         },
//         body: `<?xml version="1.0" encoding="utf-8"?>
//           <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
//             <soap:Body>
//               <MakeRequest xmlns="http://www.goglobal.travel/">
//                 <requestType>11</requestType>
//                 <xmlRequest><![CDATA[
//                   <Root>
//                     <Header>
//                       <Agency>148535</Agency>
//                       <User>REISENBOOKINGXMLTEST</User>
//                       <Password>JHJDO58X0EV</Password>
//                       <Operation>HOTEL_SEARCH_REQUEST</Operation>
//                       <OperationType>Request</OperationType>
//                     </Header>
//                     <Main Version="2.0" ResponseFormat="JSON" IncludeGeo="false" Currency="USD">
//                       <SortOrder>1</SortOrder>
//                       <FilterPriceMin>0</FilterPriceMin>
//                       <FilterPriceMax>10000</FilterPriceMax>
//                       <MaximumWaitTime>20</MaximumWaitTime>
//                       <MaxResponses>500</MaxResponses>
//                       <FilterRoomBasises>
//                         <FilterRoomBasis>HB</FilterRoomBasis>
//                         <FilterRoomBasis>BB</FilterRoomBasis>
//                       </FilterRoomBasises>
//                       <Nationality>GB</Nationality>
//                       <CityCode>75</CityCode>
//                       <Hotels>
//                         <!-- <HotelId>225</HotelId> -->
//                       </Hotels>
//                       <ArrivalDate>2025-01-01</ArrivalDate>
//                       <Nights>3</Nights>
//                       <Stars>5</Stars>
//                       <Rooms>
//                         <Room Adults="2" RoomCount="1"/>
//                         <Room Adults="1" RoomCount="1">
//                           <ChildAge>9</ChildAge>
//                           <ChildAge>5</ChildAge>
//                         </Room>
//                       </Rooms>
//                     </Main>
//                   </Root>
//                 ]]></xmlRequest>
//               </MakeRequest>
//             </soap:Body>
//           </soap:Envelope>`,
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const textResponse = await response.text(); // Get the SOAP response as text
//       return textResponse;
//     } catch (error) {
//       console.error('Error fetching SOAP response:', error);
//     }
//   };
  