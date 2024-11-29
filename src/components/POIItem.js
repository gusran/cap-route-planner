// src/components/POIItem.js
import React, { useState } from 'react';

function POIItem({ poi, index, movePOI, handleNameChange, totalPOIs }) {
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

    return (
        <li>
            {isEditing ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            saveName();
                        } else if (e.key === 'Escape') {
                            setIsEditing(false);
                            setEditedName(poi.name);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <span
                    onDoubleClick={() => setIsEditing(true)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    title="Double-click to edit name"
                >
          {poi.name}
        </span>
            )}
            <button onClick={() => movePOI(index, -1)} disabled={index === 0}>
                ↑
            </button>
            <button onClick={() => movePOI(index, 1)} disabled={index === totalPOIs - 1}>
                ↓
            </button>
        </li>
    );
}

export default POIItem;
