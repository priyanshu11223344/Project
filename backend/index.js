import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: ['https://project-1-frontend-indol.vercel.app']
}));



app.use(express.text({ type: 'application/xml' }));


// GET route
app.get('/', (req, res) => {
  res.send("hello bhai");
});


// POST route
app.post('/send-soap-request', async (req, res) => {
  const soapXML = req.body; // This will be the raw XML data sent in the request
  // console.log(soapXML);
  try {
    // Send the SOAP request using Axios
    const response = await axios({
      method: 'POST',
      url: 'https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
      data: soapXML,
    // Set a 15-second timeout (adjust as needed)
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
