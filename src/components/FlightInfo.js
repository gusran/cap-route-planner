// src/components/FlightInfo.js

import React from 'react';
import { Typography, TextField } from '@mui/material';

function FlightInfo({ totalDistance, averageSpeed, setAverageSpeed }) {
    const flightTime = totalDistance / averageSpeed;

    return (
        <div>
            <Typography variant="body1">
                Total Distance: {totalDistance.toFixed(2)} NM
            </Typography>
            <TextField
                label="Average Speed (knots)"
                type="number"
                value={averageSpeed}
                onChange={(e) => setAverageSpeed(Number(e.target.value))}
                variant="outlined"
                margin="normal"
                fullWidth
            />
            <Typography variant="body1">
                Estimated Flight Time: {flightTime.toFixed(2)} hours
            </Typography>
        </div>
    );
}

export default FlightInfo;
