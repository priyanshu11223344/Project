import React from 'react'
import Cardcomponent from './Cardcomponent'
import "../Landingpage/Availability.css"
import HotelOffers from './HotelOffers'

const Availability = () => {
    return (
        <div>
            <div className='card-main'>
                <div className='welcome-text'> {/* Changed the class name */}
                    WELCOME TO OUR SERVICES
                </div>
               <div className='card'> <HotelOffers/></div>
            </div>
        </div>
    )
}

export default Availability
