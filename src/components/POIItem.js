// src/components/POIItem.js

import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField, Typography, Box } from '@mui/material';
import { Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { convertDecimalToDegMin } from '../utils/convertCoordinates';

function POIItem({ poi, index, movePOI, handleNameChange, removePOI, totalPOIs }) {
    const [name, setName] = useState(poi.name);

    const handleChange = (e) => {
        setName(e.target.value);
        handleNameChange(poi.id, e.target.value);
    };

    const poiLatFormatted = convertDecimalToDegMin(poi.location.lat(), 'lat');
    const poiLngFormatted = convertDecimalToDegMin(poi.location.lng(), 'lng');

    return (
        <ListItem divider>
            <ListItemText
                primary={
                    <Box display="flex" alignItems="center">
                        <TextField
                            value={name}
                            onChange={handleChange}
                            placeholder="Enter POI Name" // Placeholder instead of label
                            variant="standard" // Minimal styling
                            size="small"
                            fullWidth
                            InputProps={{
                                disableUnderline: true, // Remove underline for a cleaner look
                            }}
                            style={{ marginRight: '8px' }} // Spacing between name and coordinates
                        />
                        <Typography variant="body2" color="textSecondary">
                            ({poiLatFormatted} {poiLngFormatted})
                        </Typography>
                    </Box>
                }
            />
            <IconButton
                onClick={() => movePOI(index, -1)}
                disabled={index === 0}
                aria-label="move up"
            >
                <ArrowUpward />
            </IconButton>
            <IconButton
                onClick={() => movePOI(index, 1)}
                disabled={index === totalPOIs - 1}
                aria-label="move down"
            >
                <ArrowDownward />
            </IconButton>
            <IconButton onClick={() => removePOI(poi.id)} aria-label="delete">
                <Delete />
            </IconButton>
        </ListItem>
    );
}

export default POIItem;
