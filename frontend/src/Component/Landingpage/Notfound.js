import React from 'react';
import './Notfound.css';
import noResultsIcon from "../../images/6134065.png"; // Update with the actual path to your icon

const NoResults = () => {

    return (
        <div className="no-results-container">
            <div className="no-results-content">
                <img src={noResultsIcon} alt="No Results Icon" className="no-results-icon" />
                <h1>OOPS! No Hotels Found</h1>
                <p>We couldn't find any hotels for the selected dates. Please try searching with different dates or adjust your criteria.</p>
            </div>
        </div>
    );
};

export default NoResults;
