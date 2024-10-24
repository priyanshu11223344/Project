import React from 'react';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Frontpage from './Component/Landingpage/Frontpage';
import Hotelstate from "./context/Hotelstate"
import Availability from './Component/Landingpage/Availability';
// import { Hotel } from '@mui/icons-material';
// import HotelOffers from './Component/Landingpage/HotelOffers';

function App() {
    return (
        <Hotelstate>
            <Router>
            <Routes>
            <Route path='/' element={<Frontpage />}/> 
            <Route path='/Availability' element={<Availability/>}/> 
            
            </Routes>
        </Router>
        </Hotelstate>
    );
}

export default App;
