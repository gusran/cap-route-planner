// src/components/FlightInfo.js
import React from 'react';

function FlightInfo({ totalDistance, averageSpeed, setAverageSpeed }) {
    const handleSpeedChange = (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value > 0) {
            setAverageSpeed(value);
        } else {
            alert('Please enter a valid average speed in knots.');
        }
    };

    const estimatedTime =
        totalDistance && averageSpeed
            ? ((totalDistance / averageSpeed) * 60).toFixed(2)
            : '0';

    return (
        <div id="flight-info">
            <h2>Flight Information</h2>
            <p>
                Total Distance: <span id="total-distance">{totalDistance.toFixed(2)}</span> NM
            </p>
            <p>
                Estimated Flight Time: <span id="flight-time">{estimatedTime}</span> minutes
            </p>
            <label htmlFor="average-speed">Average Speed (kt):</label>
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
