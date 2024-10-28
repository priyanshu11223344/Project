import React from 'react'
import './Success.css';
const Success = () => {
    console.log("Success component rendered"); 
  return (
    <div>
       <div className="success-container">
            <div className="success-content">
                <h1 className="success-title">Payment Successful!</h1>
                <p className="success-message">
                    Thank you for your booking! We’re excited to have you with us.
                </p>
                <button className="back-button" onClick={() => window.location.href = '/Availability'}>
                    Back to Home
                </button>
            </div>
        </div>
    </div>
  )
}

export default Success
