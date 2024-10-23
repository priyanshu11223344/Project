import React from 'react'
import "./Availability.css"
import HotelOffers from './HotelOffers'

const Availability = () => {
    return (
        <div>
           <div className='container'>
           <div className='main-text'><h1>WELCOME TO OUR SERVICES</h1></div>
            <div className='card-main'>
            
                <div className='welcome-text'> {/* Changed the class name */}
                    AVAILABLE HOTELS
                </div>
               <div className='card'> <HotelOffers/></div>
            </div>
           </div>
        </div>
    )
}

export default Availability
