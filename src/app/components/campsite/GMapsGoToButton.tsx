import React from 'react';

type MapButtonProps = {
    latitude: number;
    longitude: number;
    label: string;
}

const MapButton: React.FC<MapButtonProps> = ({ latitude, longitude, label }) => {
    const handleClick = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank'); // Open in a new tab
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
            {label}
        </button>
    );
};

export default MapButton;

