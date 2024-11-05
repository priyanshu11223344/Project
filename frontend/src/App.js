import React from 'react';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Frontpage from './Component/Landingpage/Frontpage';
import Hotelstate from "./context/Hotelstate"
import Availability from './Component/Landingpage/Availability';
// import { Hotel } from '@mui/icons-material';
// import HotelOffers from './Component/Landingpage/HotelOffers';
import Failure from './Component/Landingpage/Failure';
import Success from './Component/Landingpage/Success';
import OTPModal from './Component/Loginsignup/OTPModal';
import Login from './Component/Loginsignup/Loginsignup';
import Avail2 from './Component/Landingpage/Avail2';
import Hotelinfo from './Component/Landingpage/Hotelinfo';
function App() {
    return (
        <Hotelstate>
            <Router>
            <Routes>
            <Route path='/' element={<Frontpage />}/> 
            <Route path="/verify-otp" element={<OTPModal/>} />
            <Route path='/Login' element={<Login></Login>}></Route>
            <Route path='/Availability' element={<Availability/>}/> 
            <Route path='/success' element={<Success/>}/>
            <Route path='/cancel' element={<Failure/>}/>
            <Route path="/avail2" element={<Avail2></Avail2>}></Route>
            <Route path="/hotelinfo" element={<Hotelinfo/>}></Route>
            </Routes>
        </Router>
        </Hotelstate>
    );
}

export default App;
