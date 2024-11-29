// src/App.js

import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MapContainer from './components/MapContainer';
import { LoadScript } from '@react-google-maps/api';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize your primary color
        },
        secondary: {
            main: '#dc004e', // Customize your secondary color
        },
    },
});

function App() {
    const [googleMapsError, setGoogleMapsError] = useState(false);

    const libraries = ['places', 'geometry'];

    return (
        <ThemeProvider theme={theme}>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                libraries={libraries}
                onError={() => setGoogleMapsError(true)}
            >
                {googleMapsError && (
                    <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
                        Failed to load Google Maps. Please check your API key and internet connection.
                    </div>
                )}
                {!googleMapsError && <MapContainer />}
            </LoadScript>
        </ThemeProvider>
    );
}

export default App;