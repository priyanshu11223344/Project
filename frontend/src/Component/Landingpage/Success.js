import React from 'react'
import './Success.css';
import { FaCheckCircle } from 'react-icons/fa';
const Success = () => {
  return (
    <div>
       <div className="success-container">
            <div className="success-content">
                <FaCheckCircle className="success-icon" />
                <h1 className="success-title">Payment Successful!</h1>
                <p className="success-message">
                    Thank you for your booking! We’re excited to have you with us.
                </p>
                <button className="back-button" onClick={() => window.location.href = '/'}>
                    Back to Home
                </button>
            </div>
        </div>
    </div>
  )
}

export default Success
