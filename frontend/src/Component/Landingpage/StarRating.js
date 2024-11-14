// StarRating.js
import React from 'react';
import './StarRating.css'; // Create this CSS file for styling

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= rating ? "star filled" : "star"}>
                {i <= rating ? '★' : '☆'}
            </span>
        );
    }
    return <div className='star-rating'>{stars}</div>;
};

export default StarRating;
