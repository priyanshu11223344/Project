import React, { useState, useEffect, useContext } from 'react';
import './Frontpage.css';
import logoimage from '../../images/logo withoutBG.png'; 
import { useNavigate } from 'react-router-dom';
import Login from "../Loginsignup/Loginsignup";
import Sideslidebar from './sideslidebar';
import Hotelcontext from '../../context/Hotelcontext';

const Frontpage = () => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(1);
    const [checkin, setCheckin] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const history = useNavigate(); 
    const { fetchData } = useContext(Hotelcontext); 

    const incrementAdults = () => setAdults(adults + 1);
    const decrementAdults = () => adults > 1 && setAdults(adults - 1);
    const incrementChildren = () => setChildren(children + 1);
    const decrementChildren = () => children > 1 && setChildren(children - 1);
    const toggleLoginModal = () => setShowLogin(!showLogin);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return '';
    };
   
    const handleCheckAvailability = (e) => {
        e.preventDefault();
    
        // Check if user is logged in
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const isLoggedIn = existingUsers.length > 0; // Adjust this condition based on your login logic

        if (!isLoggedIn) {
            alert('Please log in to check availability.');
            toggleLoginModal();
            return;
        }

        const formattedCheckin = formatDate(checkin);
    
        if (formattedCheckin) {
            localStorage.setItem('checkin', formattedCheckin);
            fetchData(formattedCheckin);
            history("/Availability");
        } else {
            alert('Please enter valid check-in and check-out dates');
        }
    };
    const remove=()=>{
        localStorage.removeItem("users");
    }

    return (
        <div className="booking-container">
            <div className='top-nav'>
                
                <div className="logo">
                    <img src={logoimage} alt="Logo" height='60px' width='900px' />
                </div>
                <div className='right-side'>
                <button className='btn btn-primary' onClick={remove}>LOGOUT</button> 
                    <div className="menu-icon" onClick={toggleLoginModal}>
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div>
                        <Sideslidebar/>  
                    </div>
                </div>
            </div>
            <div className="hero">
                <div className="hero-content">
                    <h3>Welcome to ReisenBooking</h3>
                    <h1>Find Best Places To Stay</h1>
                    <form className="booking-form">
                        <div className="form-group">
                            <div>Location</div>
                            <input type="text" placeholder="Location" />
                        </div>
                        <div className="form-group">
                            <div>Check-in</div>
                            <input 
                                type="date" 
                                value={checkin} 
                                onChange={(e) => setCheckin(e.target.value)} 
                                required 
                                pattern="\d{4}-\d{2}-\d{2}"
                            />
                        </div>
                        <div className="form-group">
                            <div>Check-out</div>
                            <input 
                                type="date" 
                                required 
                                pattern="\d{4}-\d{2}-\d{2}"
                            />
                        </div>
                        <div className="form-group">
                            <label>Adults</label>
                            <div className="quantity-buttons">
                                <button type="button" onClick={decrementAdults}>-</button>
                                <span>{adults}</span>
                                <button type="button" onClick={incrementAdults}>+</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Children</label>
                            <div className="quantity-buttons">
                                <button type="button" onClick={decrementChildren}>-</button>
                                <span>{children}</span>
                                <button type="button" onClick={incrementChildren}>+</button>
                            </div>
                        </div>
                        <button className="check-availability-button" onClick={handleCheckAvailability}>
                            Check Availability
                        </button>
                    </form>
                </div>
            </div>
            {showLogin && <Login closeModal={toggleLoginModal} />}
        </div>
    );
};

export default Frontpage;
