import React, { useState } from "react";
import './Loginsignup.css';
import { useNavigate } from "react-router-dom";
import OTPModal from './OTPModal';  // Import OTPModal component

function Login({ closeModal }) {
    const [isRightPanelActive, setRightPanelActive] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showOTPModal, setShowOTPModal] = useState(false);  // State to control OTP modal
    const navigate = useNavigate();
    const [cred, setCred] = useState({ name: "", email: "", password: "" });
    const [logcred, setLogCred] = useState({ logemail: "", logpass: "" });
    const url_back='https://project-1-back.vercel.app';
    //const url_back='http://localhost:8000'
    const handleSignUpClick = () => {
        setRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setRightPanelActive(false);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { name, email, password } = cred;
        const response = await fetch(`${url_back}/newuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log(json);

        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            localStorage.setItem("userId", json.userId);
            setShowOTPModal(true);  // Open OTP modal
        } else {
            alert("Invalid credentials");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { logemail, logpass } = logcred;
        const response = await fetch(`${url_back}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: logemail, password: logpass })
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
            localStorage.setItem("token", data.authtoken);
            localStorage.setItem("email", logemail);
            closeModal();
            alert("Logged in");
        } else {
            alert("Invalid credentials");
        }
    };

    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
    };

    const onChange2 = (e) => {
        setLogCred({ ...logcred, [e.target.name]: e.target.value });
    };

    // Function to handle OTP verification result (either success or failure)
    const handleOTPVerification = (isVerified) => {
        if (isVerified) {
            alert("OTP Verified Successfully!");
        } else {
            alert("OTP Verification Failed!");
        }
        setShowOTPModal(false);  // Close OTP modal after verification
    };

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget && !showOTPModal) {
                closeModal();
            }
        }} style={{ pointerEvents: showOTPModal ? "none" : "auto" }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignIn}>
                            <h1>Create Account</h1>
                            <span>or use your email for registration</span>
                            <input
                                name="name"
                                type="text"
                                placeholder="Name"
                                onChange={onChange}
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={onChange}
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={onChange}
                            />
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleLogin}>
                            <h1>Login</h1>
                            <div className="social-container">
                                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                            <span>or use your account</span>
                            <input
                                type="email"
                                name="logemail"
                                placeholder="Email"
                                onChange={onChange2}
                            />
                            <input
                                type="password"
                                name="logpass"
                                placeholder="Password"
                                onChange={onChange2}
                            />
                            <a href="#">Forgot your password?</a>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            <button type="submit">Login</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button className="ghost" onClick={handleSignInClick}>Login</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start your journey with us</p>
                                <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showOTPModal && <OTPModal onOTPVerified={handleOTPVerification} />}
        </div>
    );
}

export default Login;
