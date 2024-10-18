import React from 'react'
import Cardcomponent from './Cardcomponent'
import "../Landingpage/Availability.css"

const Availability = () => {
    return (
        <div>
            <div className='card-main'>
                <div className='welcome-text'> {/* Changed the class name */}
                    WELCOME TO OUR SERVICES
                </div>
                <div className='card-main-below-text'>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                    <Cardcomponent className="card"></Cardcomponent>
                </div>
            </div>
        </div>
    )
}

export default Availability
