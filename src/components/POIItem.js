// src/components/POIItem.js

import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField } from '@mui/material';
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
                    <TextField
                        value={name}
                        onChange={handleChange}
                        placeholder="Enter POI Name" // Use placeholder instead of label
                        variant="standard" // Use 'standard' variant for minimal styling
                        size="small"
                        fullWidth
                        InputProps={{
                            disableUnderline: true, // Remove underline for a cleaner look
                        }}
                    />
                }
                secondary={`Coordinates: ${poiLatFormatted} ${poiLngFormatted}`}
                style={{ paddingLeft: 0 }} // Remove left padding if a frame was implemented via padding
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
