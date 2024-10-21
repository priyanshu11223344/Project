import express from 'express';
import axios from 'axios'
import { parseString } from 'xml2js';
import cors from 'cors';
const app = express();
app.use(cors());

// Or to specify a specific origin
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from this origin
}));

app.get('/', (req, res) => {
  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
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
            <Main Version="2.0" ResponseFormat="JSON" IncludeGeo="false" Currency="USD">
              <SortOrder>1</SortOrder>
              <FilterPriceMin>0</FilterPriceMin>
              <FilterPriceMax>10000</FilterPriceMax>
              <MaximumWaitTime>20</MaximumWaitTime>
              <MaxResponses>500</MaxResponses>
              <Nationality>GB</Nationality>
              <CityCode>77</CityCode>
              <ArrivalDate>2024-10-26</ArrivalDate>
              <Nights>3</Nights>
              <Stars>5</Stars>
              <Rooms>
                <Room Adults="2" RoomCount="1" />
                <Room Adults="1" RoomCount="1">
                  <ChildAge>9</ChildAge>
                  <ChildAge>5</ChildAge>
                </Room>
              </Rooms>
            </Main>
          </Root>
        ]]></xmlRequest>
      </MakeRequest>
    </soap12:Body>
  </soap12:Envelope>`;

  axios.post('https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx', soapRequest, {
    headers: {
      'Content-Type': 'application/soap+xml; charset=utf-8'
    }
  })
  .then(response => {
    const xmlData = response.data;
    console.log(xmlData);
    console.log("?????????????????????????????????????????????????????????????????????????????????????????????????????????????")
    parseString(xmlData, function(err, result) {
      if (err) {
        return res.status(500).send('Error parsing XML');
      }
      const jsonData = JSON.stringify(result, null, 2); // Pretty print JSON
      res.send(`<pre>${jsonData}</pre>`); // Serve the JSON in a formatted manner in the browser
    });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error fetching SOAP data');
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
