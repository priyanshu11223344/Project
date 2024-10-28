import React from 'react';

const Cardcomponent = (props) => {
  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>
        <img src={props.image} className="card-img-top" height="250px" width="100px"/>
        <div className="card-body">
          <h4 className="card-title">{props.title}</h4>
          <h5 className="card-title">{props.description}</h5>
          <h5 className="card-title">{props.price}</h5>
          <p className="card-text">{props.additionalData}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{props.Special}</li>
          <li className="list-group-item">{props.remark}</li>
          <button
            className="btn btn-primary"
            onClick={() => props.handleBookClick(props.hotelDetails)} // Pass hotel details on click
          >
            BOOK
          </button>
        </ul>
        <div className="card-body">
          <a href="#" className="card-link">Card link</a>
          <a href="#" className="card-link">Another link</a>
        </div>
      </div>
    </div>
  );
};

export default Cardcomponent;
