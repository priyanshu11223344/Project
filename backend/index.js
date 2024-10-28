import express from 'express';
import axios from 'axios';
import cors from 'cors';
import Stripe from 'stripe';

import { parseString } from 'xml2js';

const app = express();

// Allow requests from your frontend's origin
app.use(cors({
   origin: 'https://project-1-front.vercel.app', // Make sure this matches your frontend
    // origin: 'https://localhost:3000',
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true // Add this if using cookies or sessions
}));

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin); // Log the incoming origin
  next();
});

app.options('/send-soap-request', cors({
   origin: 'https://project-1-front.vercel.app', // Make sure this matches your frontend
  // origin: 'https://localhost:3000',
}));

app.use(express.text({ type: 'application/xml' }));

// Variable to store the last SOAP response
let lastSoapResponse = null;

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
      data: soapXML
    });
    parseString(response.data, (err, result) => {
      if (err) {
        // setError('Error parsing XML');
        console.error(err);
      } else {
        // Navigate through the XML structure to extract relevant data
        const makeRequestResult = result['soap:Envelope']['soap:Body'][0]['MakeRequestResponse'][0]['MakeRequestResult'][0];

        // If makeRequestResult is in JSON string format within XML, parse it
        try {
          const parsedData = JSON.parse(makeRequestResult);  // Ensure makeRequestResult is a JSON string
          console.log( "parseddata is:", parsedData);
          res.send(parsedData)
          // setData(parsedData.Hotels);  // Assuming parsedData contains a 'Hotels' key
        } catch (jsonParseError) {
          // setError('Error parsing MakeRequestResult JSON');
          console.error(jsonParseError);
        }
      }
    });
   
  } catch (error) {
    console.error('Error sending SOAP request:', error);
    res.status(500).send('Error sending SOAP request');
  }
});
const stripe = new Stripe('sk_test_51QErKCCKkgmSQ5qkuPT5UicR3aDB2U6eUopL6ubweMnLHjdqbc6veQgCbyvmYZYwHsogim3MjH5faydhy6NChLmF00ZrWEJT66');
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  console.log('Received amount:', amount);
    console.log('Received currency:', currency);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency || 'usd',
    });

  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Error creating payment intent');
  }
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
