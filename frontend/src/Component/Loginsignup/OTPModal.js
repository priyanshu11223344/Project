import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './OTPModal.css'
function OTPVerify() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const handleVerify = async (e) => {
        e.preventDefault();
        const requestBody = { userId, otp };
        console.log('Sending request:', requestBody); 
        const response = await fetch("http://localhost:8000/verifyotp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            navigate("/");
            localStorage.removeItem('userId');
            alert("OTP verified successfully Now you can log in");
        } else {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="otp-main">
            <div className="otp-verify-container">
            <h2>Verify OTP</h2>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerify}>Verify OTP</button>
        </div>
        </div>
    );
}

export default OTPVerify;
