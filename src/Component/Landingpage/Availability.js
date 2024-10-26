import React, { useContext,useEffect } from 'react'
import "./Availability.css"
import HotelOffers from './HotelOffers'
import Hotelcontext from '../../context/Hotelcontext'


const Availability = () => {
    const { fetchData } = useContext(Hotelcontext);

    useEffect(() => {
        const storedCheckin = localStorage.getItem('checkin');

        if (storedCheckin) {
            // Fetch data using the check-in date from localStorage
            fetchData(storedCheckin);
            
        }

    }, []);

    return (
        <div>
           <div className='container'>
               <div className='main-text'><h1>WELCOME TO OUR SERVICES</h1></div>
               <div className='card-main'>
                   <div className='welcome-text'>AVAILABLE HOTELS</div>
                   <div className='card'><HotelOffers/></div>
               </div>
           </div>
        </div>
    );
};


export default Availability
