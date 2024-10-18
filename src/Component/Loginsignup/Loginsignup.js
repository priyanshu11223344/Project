import React from "react";
import { useState } from "react";
import './Loginsignup.css';
import user_icon from '../Assets/person.png';
import user_pass from '../Assets/password.png';
import user_email from '../Assets/email.png';
import logo from "../../images/hd2.jpg"

function Login({ closeModal }) {
    const [action, setAction] = useState("Login");

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="login-container">
                    <div className="login-image">
                        <img src={logo} alt="Login" />
                    </div>

                    <div className="login-form">
                        <div className="header">
                            <h2>{action === "signup" ? "Sign Up" : "Login"}</h2>
                            <div className="underline"></div>
                        </div>

                        <div className="inputs">
                            {action === "Login" ? null : (
                                <div className="input">
                                    <img src={user_icon} alt="User Icon" />
                                    <input type="text" placeholder="Name" />
                                </div>
                            )}
                            <div className="input">
                                <img src={user_email} alt="Email Icon" />
                                <input type="email" placeholder="Email" />
                            </div>
                            <div className="input">
                                <img src={user_pass} alt="Password Icon" />
                                <input type="password" placeholder="Password" />
                            </div>
                        </div>

                        {action === "signup" ? null : (
                            <div className="forget">
                                Forgot password? <span>Click here!</span>
                            </div>
                        )}

                        <div className="submit-container">
                            <div
                                className={action === "signup" ? "submit active" : "submit"}
                                onClick={() => setAction("signup")}
                            >
                                Sign Up
                            </div>
                            <div
                                className={action === "Login" ? "submit active" : "submit"}
                                onClick={() => setAction("Login")}
                            >
                                Login
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="close-button" onClick={closeModal}>
                            &times;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
