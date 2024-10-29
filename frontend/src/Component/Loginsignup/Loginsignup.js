import React, { useState } from "react";
import './Loginsignup.css';
import user_icon from '../Assets/person.png';
import user_pass from '../Assets/password.png';
import user_email from '../Assets/email.png';
import logo from "../../images/hd2.jpg";
import '@fortawesome/fontawesome-free/css/all.min.css';


function Login({ closeModal }) {
    const [isRightPanelActive, setRightPanelActive] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignUpClick = () => {
        setRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setRightPanelActive(false);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("All fields are required!");
            setSuccess("");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = existingUsers.find(user => user.email === email);

        if (userExists) {
            setError("User already exists!");
            setSuccess("");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const newUser = { name, email, password };
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        setSuccess("Signup successful! You can now log in.");
        setError("");
        setTimeout(() => {
            setName("");
            setEmail("");
            setPassword("");
        }, 2000);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required!");
            setSuccess("");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = existingUsers.find(user => user.email === email && user.password === password);

        if (user) {
            setSuccess("Login successful!");
            alert("Successful Login");
            setError("");
        } else {
            setError("Invalid email or password!");
            alert("Invalid Credentials");
            setSuccess("");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignup}>
                            <h1>Create Account</h1>
                            <div className="social-container">
                                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                            <span>or use your email for registration</span>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                {/* <div className="close-button" onClick={closeModal}>
                    &times;
                </div> */}
            </div>
        </div>
    );
}

export default Login;
