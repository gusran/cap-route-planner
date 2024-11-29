// src/components/POIItem.js

import React, { useState } from 'react';
import {
    ListItem,
    ListItemText,
    IconButton,
    TextField,
} from '@mui/material';
import {
    ArrowUpward,
    ArrowDownward,
    Delete
} from '@mui/icons-material';

function POIItem({ poi, index, movePOI, handleNameChange, removePOI, totalPOIs }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(poi.name);

    const saveName = () => {
        if (editedName.trim() === '') {
            alert('POI name cannot be empty.');
            setEditedName(poi.name);
        } else {
            handleNameChange(poi.id, editedName.trim());
        }
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditedName(poi.name);
        setIsEditing(false);
    };

    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton
                        edge="end"
                        aria-label="move up"
                        onClick={() => movePOI(index, -1)}
                        disabled={index === 0}
                    >
                        <ArrowUpward />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="move down"
                        onClick={() => movePOI(index, 1)}
                        disabled={index === totalPOIs - 1}
                    >
                        <ArrowDownward />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => removePOI(poi.id)}>
                        <Delete />
                    </IconButton>
                </>
            }
        >
            {isEditing ? (
                <TextField
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName();
                        else if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                    variant="standard"
                />
            ) : (
                <ListItemText
                    primary={poi.name}
                    onClick={() => setIsEditing(true)}
                    style={{ cursor: 'pointer' }}
                />
            )}
        </ListItem>
    );
}

export default POIItem;
