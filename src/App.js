import React from 'react';
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Frontpage from './Component/Landingpage/Frontpage';

import Availability from './Component/Landingpage/Availability';
import { Hotel } from '@mui/icons-material';
import HotelOffers from './Component/Landingpage/HotelOffers';

function App() {
    return (
        <Router>
            <Routes>
            <Route path='/' element={<Frontpage />}/> 
            <Route path='/Availibility' element={<Availability/>}/> 
            
            </Routes>
        </Router>
    );
}

export default App;
