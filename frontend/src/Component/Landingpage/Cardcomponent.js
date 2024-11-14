import React from 'react';
import "./Cardcomponent.css"
const Cardcomponent = (props) => {
  return (
    <div className="comp-card">
      <div className="card-image">
        <img src={props.image} alt="Resort" />
      </div>
      <div className="card-content">
        <h2 className="card-title">{props.title}</h2>
        <p className="card-location"><b>Location:</b>{props.description}</p>
        <div className="card-features">
          <span className="refundable"><b>Special:</b>{props.Special}</span>
        </div>
        <div className="card-rating">
          <span><b>Category:</b>{props.additionalData}{"\u2B50"}</span>
        </div>
        <div className="card-rating">
          <span><b>Rooms:</b>{props.roomData}</span>
        </div>
        <div className="card-price">
          <span className="discounted-price">{props.price}</span>
          {/* <button className='btn btn-primary' onClick={props.handleBookClick}>BOOK</button> */}
          <button className='btn btn-primary'onClick={props.handleinfoclick} >EXPLORE</button>
        </div>
      </div>
    </div>
  );
};

export default Cardcomponent;
