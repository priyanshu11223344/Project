// RoomFacilities.js
import React from 'react';
import RoomCard from './RoomCard';
import './RoomFacilities.css';

const RoomFacilities = ({ data, images }) => { // Accept images as a prop
    const roomFacilitiesData = data.Root.Main[0].RoomFacilities[0];

    const parseRoomFacilities = (rawData) => {
        const roomTypes = rawData.split('<b>Room Type: ').slice(1);
        return roomTypes.map(room => {
            const parts = room.split('<BR />');
            const roomType = parts[0].replace('</b>', '').trim(); // Remove </b> from room type
            const facilities = parts.slice(1).filter(facility => facility.trim() !== '');
            return { roomType, facilities };
        });
    };

    const rooms = parseRoomFacilities(roomFacilitiesData);

    // Function to get a random image
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex]?.url; // Ensure the image exists
    };

    return (
        <div>
            <h1>CHOOSE YOUR ROOM</h1>
            <div className="room-facilities-grid">
            
            {rooms.map((room, index) => (
                <RoomCard 
                    key={index} 
                    roomType={room.roomType} 
                    facilities={room.facilities} 
                    imageUrl={images[index]?.url || ''} // Pass the image URL here, adjust according to your data structure
                />
            ))}
        </div>
        </div>
    );
};

export default RoomFacilities;
