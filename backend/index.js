import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true // Add this if using cookies or sessions
}));

app.options('/send-soap-request', cors({
  origin: 'https://localhost:3000',
}));




app.use(express.text({ type: 'application/xml' }));


// GET route
app.get('/', (req, res) => {
  res.send("hello bhai");
});


// POST route
app.post('/send-soap-request', async (req, res) => {
  const soapXML = req.body; // This will be the raw XML data sent in the request

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
      data: soapXML,
      timeout: 15000, // Set a 15-second timeout
    });

    console.log('SOAP Response:', response.data);
    res.send(response.data);
  } catch (error) {
    console.error('Error sending SOAP request:', error);
    res.status(500).send('Error sending SOAP request');
  }
});




const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
