import React from 'react';
import { useState } from 'react';
import { Card, Button, Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faTv, faShower, faCoffee, faUtensils, faBed, faThermometerHalf, faLock, faWind, faRadio, faPhone, faCableCar, faBathtub, faFire } from '@fortawesome/free-solid-svg-icons';
import "./RoomCard.css";

const RoomCard = ({ images, roomType, price, currency, remark, special, cancellationDeadline, roomFacilities, onShowRemark, handleBookClick,initialIndex }) => {
    // Map facilities to corresponding icons
     const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };
    const facilityIcons = {
        'Internet access': faWifi,
        'TV': faTv,
        'Shower': faShower,
        'Coffee Maker': faCoffee,
        'Room Service': faUtensils,
        'Double Bed': faBed,
        'Air conditioning (centrally regulated)': faThermometerHalf,
        'Safe': faLock,
        'Bathroom': faBathtub,
        'Hairdryer': faWind,
        'Radio': faRadio,
        'Stereo': faRadio,
        'Direct dial telephone': faPhone,
        'Satellite/cable TV': faCableCar,
        "Central Heating": faFire
    };

    // Split roomFacilities into two halves for display
    const halfLength = Math.ceil(roomFacilities.length / 2);
    const firstHalf = roomFacilities.slice(0, halfLength);
    const secondHalf = roomFacilities.slice(halfLength);

    return (
        <Card className="room-card">
            {/* Image Carousel Section */}
            <Carousel
    activeIndex={currentImageIndex} // Set the active image based on the initial index
    onSelect={handleImageChange} // Update current image index when user navigates
    interval={null} // Disable auto-sliding
>
                {images.map((image, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            src={image.url}
                            alt={`Room Image ${index}`}
                            style={{ height: '300px', objectFit: 'cover' }} // Set height to maintain consistency
                        />
                    </Carousel.Item>
                ))}
            </Carousel>

            <Card.Body>
                <Card.Title>{roomType}</Card.Title>

                {/* Room Facilities Section */}
                <div className="room-facilities">
                    <h5>Room Facilities</h5>
                    <div className="row">
                        {/* First half of the facilities */}
                        <div className="col-6">
                            <ul>
                                {firstHalf.map((facility, index) => (
                                    <li key={index}>
                                        <FontAwesomeIcon icon={facilityIcons[facility] || faUtensils} /> {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Second half of the facilities */}
                        <div className="col-6">
                            <ul>
                                {secondHalf.map((facility, index) => (
                                    <li key={index}>
                                        <FontAwesomeIcon icon={facilityIcons[facility] || faUtensils} /> {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <Card.Text>
                    <span 
                        className="view-details" 
                        onClick={onShowRemark}
                    >
                        View Details
                    </span><br/>
                    <hr />
                    <strong>Price:</strong> {price} {currency} <br />
                    <strong>Special:</strong> {special} <br />
                    <strong>Cancellation Deadline:</strong> {cancellationDeadline}
                </Card.Text>
                
                <Button variant="primary" onClick={handleBookClick}>Reserve</Button>
            </Card.Body>
        </Card>
    );
};

export default RoomCard;
