// src/App.js

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MapContainer from './components/MapContainer';

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
    return (
        <ThemeProvider theme={theme}>
            <MapContainer />
        </ThemeProvider>
    );
}

export default App;
