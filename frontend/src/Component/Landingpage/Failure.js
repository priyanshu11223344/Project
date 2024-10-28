import React from 'react'
import './Failure.css'
const Failure = () => {
    const handleRetry = () => {
        // Logic to retry the payment or redirect to the appropriate page
        window.location.href = '/'; // Redirecting to the home page as an example
    };

    return (
        <div className="failure-page">
            <div className="failure-content">
                <h1 className="failure-title">Payment Failed</h1>
                <p className="failure-message">
                    Oops! Something went wrong during your payment process. Please try again.
                </p>
                <button className="retry-button" onClick={handleRetry}>
                    Retry Payment
                </button>
            </div>
        </div>
    );
}

export default Failure
