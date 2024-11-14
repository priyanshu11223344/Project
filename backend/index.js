import express from 'express';
import axios from 'axios';
import cors from 'cors';
import Stripe from 'stripe';

import { parseString } from 'xml2js';
import connectToMongo from './db.js';

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import User from './models/User.js';
import Otp from './models/Otp.js';
import fetchuser from './middleware/fetchuser.js';
const app = express();
const JWT_SECRET=process.env.JWT_SECRET_KEY
// Allow requests from your frontend's origin
  const url='https://project-1-front.vercel.app';
 //const url='http://localhost:3000';
app.use(cors({
   origin: url, // Make sure this matches your frontend
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true // Add this if using cookies or sessions
}));

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin); // Log the incoming origin
  next();
});
app.use(express.json()); 

app.options('/send-soap-request', cors({
   origin: url, // Make sure this matches your frontend
}));

app.use(express.text({ type: 'application/xml' }));
// app.use("/api/auth", authRoutes);
// Variable to store the last SOAP response

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
          // console.log( "parseddata is:", parsedData);
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
app.post('/hotelinfo', async (req, res) => {
  const soapXML = req.body; // This will be the raw XML data sent in the request

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://reisenbooking.xml.goglobal.travel/xmlwebservice.asmx',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
      data: soapXML,
    });

    // Parse the XML response using xml2js
    parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).send('Error parsing XML response');
      }

      // Log the entire parsed result to see its structure
      console.log('Parsed XML Result:', JSON.stringify(result));

      const makeRequestResult = result['soap:Envelope']['soap:Body'][0]['MakeRequestResponse'][0]['MakeRequestResult'][0];

      // Log the value of makeRequestResult to check its format
      console.log('MakeRequestResult:', makeRequestResult);

      // Check if makeRequestResult is valid JSON
      try {
        // Attempt to parse makeRequestResult
        const parsedData = JSON.parse(makeRequestResult); // Try parsing it as JSON

        console.log("Parsed Data:", parsedData); // Log parsed data for debugging
        return res.send(parsedData); // Send the parsed JSON data back to the client
      } catch (jsonParseError) {
        console.error('Error parsing MakeRequestResult JSON:', jsonParseError);

        // Attempt to handle as XML if parsing as JSON fails
        // Assuming makeRequestResult is actually XML and needs to be parsed
        parseString(makeRequestResult, (xmlError, xmlResult) => {
          if (xmlError) {
            console.error('Error parsing MakeRequestResult XML:', xmlError);
            return res.status(500).send('Error parsing MakeRequestResult');
          }

          // Log the parsed XML result
          console.log("Parsed MakeRequestResult XML:", xmlResult);
          
          // Send the parsed XML result or handle as needed
          return res.send(xmlResult);
        });
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
  // console.log('Received amount:', amount);
  //   console.log('Received currency:', currency);

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
app.post('/create-checkout-session', async (req, res) => {
  const { amount, currency,name ,image} = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: name,
              images:[image]
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1, // Change as needed
        },
      ],
      mode: 'payment',
      success_url: `${url}/success`, // Redirect after successful payment
      cancel_url: `${url}/cancel`, // Redirect if payment is cancelled
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: 'Failed to create checkout session' });
  }
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD
  }
});
// ROUTE 1: create a user using postman : no login required 
// "/api/auth/newuser"
app.post("/newuser",[
    body("name","enter a valid name").isLength({min:3}),
    body("email","enter a valid email").isEmail(),
    body('password',"Password must be of 5 charactors").isLength({ min: 3 }),
],async(req, res) => {
       let success=false;
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({ success,errors: errors.array() });
         }
      // check whether user with same email exits
      try{
      let user=await User.findOne({email:req.body.email})
      if(user){
        return res.status(400).json({success,error:"user with this email alredy exists"})
      }
      // to generate a salt

      const salt=await bcrypt.genSalt(10);

      //password ecryption
      const seqp= await bcrypt.hash(req.body.password,salt)

      // create a new user
      user =await User.create({
        name: req.body.name,
        email:req.body.email,
        password:seqp ,
        verified:false, // set verified false initially
      })
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data, JWT_SECRET); 
     success=true;

      // requesting the user for otp verification 
     await sendotp({ _id: user._id, email: user.email }, res);

      res.json({success,userId:user._id,token:authtoken})
      //res.send(req.body);
    }
    catch(err){
      console.log(err.message);
      res.status(500).send("some error occured");
    }
    console.log("newuser done");
      
}) 

// send otp verification email
const sendotp = async ({ _id, email }, res) => {
  try {
    // Generate a 4 digit OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // OTP mail body generator
    const mailoptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter this otp <b>${otp}</b> in the application for verification of your account.<p>This code will expire in one hour. </p></p>`
    };

    // Hash the OTP
    const saltt = await bcrypt.genSalt(10);
    const hashotp = await bcrypt.hash(otp, saltt);

    // Create the user ID with the OTP
    let userotp = await Otp.create({
      userId: _id,
      otp: hashotp,
    });

    // Send mail
    transporter.sendMail(mailoptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
      } else {
        console.log(info.response);
        return res.status(200).json({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};



// verify the otp  at /verifyotp

app.post("/verifyotp",async(req,res)=>{
    try {
      let {userId,otp}=req.body;  // req the credentials
      if(!userId||!otp){
        throw Error("empty otp details are not allowed")
      }
      else{
        const verfiyotp= await Otp.find({userId,}); // it will find the user in the database my id
        if(verfiyotp.length<=0){
            throw Error("account record exist or its already verified, pls signup or login");
        }
        else{
            // use that the otp is not a expired otp
              const {expiresat} = verfiyotp[0];          //destructuring  and fetching from array
              const hashedotp= verfiyotp[0].otp;
              if(expiresat<Date.now){             // the otp has expires already
                  await Otp.deleteMany({userId}); //delete the generated otp
                  throw Error("Code has expired");
              }
              else{
                const validotp =await bcrypt.compare(otp,hashedotp);  // this will return a boolean value
                if(!validotp){
                  await User.deleteOne({ _id: userId });
                  throw Error("the otp is not valid, enter correct otp");
                }
                else{
                 await User.updateOne({_id:userId},{verified:true});      // the verified was false initally , if the otp is correct set it true.
                 await Otp.deleteMany({userId});
                 res.status(201).json("user verified successfully")
                }
              }
        }
      }

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Internal server error in otp verification", error: error.message });
    }
})

/// Route 3- login---

app.post("/login",[
  body("email","enter a valid email").isEmail(),  // check user throgh email and password
  body('password',"enter password").exists(),
],async(req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
       }
    const {email,password}=req.body;
    try{
      let user= await User.findOne({email})
      let success=false;
      
      
      if(!user){
        success=false;
        return res.status(400).send({error:"Please login with valid credentials"})
      }
      const passwordCompare= await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false;
        return res.json({success,error:"Please login with valid credentials"})
      }
      if (!user.verified) {
        return res.status(400).json({ success, error: "Please complete your verification" });
      }


      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success,token:authtoken})
      }
    catch(error){
      res.status(500).send("Internal server error")
    }
})


// // ROUTE : 3 fetch user details by POST: /api/auth/getuser

app.post("/getuser",fetchuser,async(req, res) => {
  try{
      const userId=req.user.id;
      const user=await User.findById(userId).select("-password");
      res.send(user);
  }
  catch(error){
    res.status(500).send("Internal server error")
  }
  })
     
 

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
connectToMongo();
