import React, { useState } from "react";
import './Loginsignup.css';
import user_icon from '../Assets/person.png';
import user_pass from '../Assets/password.png';
import user_email from '../Assets/email.png';
import logo from "../../images/hd2.jpg";

function Login({ closeModal }) {
    const [action, setAction] = useState("Login");
    const [name, setName] = useState(""); // For signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // For error messages
    const [success, setSuccess] = useState(""); // For success messages

    const handleSignup = () => {
        // Validate fields
        if (!name || !email || !password) {
            setError("All fields are required!");
            setSuccess("");
            return;
        }

        // Save user data to localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = existingUsers.find(user => user.email === email);

        if (userExists) {
            setError("User already exists!");
            setSuccess("");
            return;
        }

        const newUser = { name, email, password };
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        setSuccess("Signup successful! You can now log in.");
        setError("");
        setName(""); // Reset form fields
        setEmail("");
        setPassword("");
    };

    const handleLogin = () => {
        // Validate fields
        if (!email || !password) {
            setError("Email and password are required!");
            setSuccess("");
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = existingUsers.find(user => user.email === email && user.password === password);

        if (user) {
            setSuccess("Login successful!");
            alert("successful.........");
            setError("");
            // Here you can redirect to another page or perform other actions after successful login
        } else {
            setError("Invalid email or password!");
            alert("failure..............");
            setSuccess("");
        }
    };

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
                            {action === "signup" && (
                                <div className="input">
                                    <img src={user_icon} alt="User Icon" />
                                    <input 
                                        type="text" 
                                        placeholder="Name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                </div>
                            )}
                            <div className="input">
                                <img src={user_email} alt="Email Icon" />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            <div className="input">
                                <img src={user_pass} alt="Password Icon" />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <div className="submit-container">
                            {action === "signup" ? (
                                <div className="submit" onClick={handleSignup}>
                                    SUBMIT
                                </div>
                            ) : (
                                <div className="submit" onClick={handleLogin}>
                                    SUBMIT
                                </div>
                            )}
                        </div>

                        <div className="toggle-action">
                            {action === "signup" ? (
                                <div
                                    className="submit active"
                                    onClick={() => setAction("Login")}
                                >
                                     Login
                                </div>
                            ) : (
                                <div
                                    className="submit active"
                                    onClick={() => setAction("signup")}
                                >
                                    Sign Up
                                </div>
                            )}
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
