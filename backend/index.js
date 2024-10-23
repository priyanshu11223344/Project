import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from this origin
}));
app.use(express.text({ type: 'application/xml' }));


// GET route
app.get('/', (req, res) => {
  res.send("hello");
});

// POST route
app.post('/send-soap-request', async (req, res) => {
  const soapXML = req.body; // This will be the raw XML data sent in the request
  // console.log(soapXML);
  try {
    // Send the SOAP request using Axios
    const response = await axios({
      method: 'POST',
      url: 'https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx', // SOAP endpoint
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
      data: soapXML // Send the XML body received from the client
    });

    // Log the response from the external SOAP API
    console.log('SOAP Response:', response.data);

    // Send the response back to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error sending SOAP request:', error.message);
    res.status(500).send('Error sending SOAP request');
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
