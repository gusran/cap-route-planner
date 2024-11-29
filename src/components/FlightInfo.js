// src/components/FlightInfo.js
import React from 'react';

function FlightInfo({ totalDistance, averageSpeed, setAverageSpeed }) {
    const handleSpeedChange = (e) => {
        setAverageSpeed(e.target.value);
    };

    const estimatedTime = totalDistance && averageSpeed
        ? ((totalDistance / averageSpeed) * 60).toFixed(2)
        : '0';

    return (
        <div id="flight-info">
            <h2>Flight Information</h2>
            <p>
                Total Distance: <span id="total-distance">{totalDistance.toFixed(2)}</span> km
            </p>
            <p>
                Estimated Flight Time: <span id="flight-time">{estimatedTime}</span> minutes
            </p>
            <label htmlFor="average-speed">Average Speed (km/h):</label>
            <input
                id="average-speed"
                type="number"
                value={averageSpeed}
                onChange={handleSpeedChange}
            />
        </div>
    );
}

export default FlightInfo;
