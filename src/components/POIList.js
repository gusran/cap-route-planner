// src/components/POIList.js

/* global google */
import React, { useState, useEffect, useRef } from 'react';
import POIItem from './POIItem';
import { TextField, Button, Typography, List } from '@mui/material';

function POIList({ map, poiList, setPoiList, markers, setMarkers, updateRoute }) {
    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef(null);

    // Initialize Google Maps Autocomplete
    useEffect(() => {
        if (map && !autocomplete && inputRef.current) {
            const autocompleteObj = new google.maps.places.Autocomplete(inputRef.current);
            autocompleteObj.bindTo('bounds', map);
            setAutocomplete(autocompleteObj);
        }
    }, [map, autocomplete]);

    const addPOI = () => {
        if (!autocomplete) {
            alert('Autocomplete is not initialized yet. Please try again.');
            return;
        }

        const place = autocomplete.getPlace();

        if (!place || !place.geometry) {
            alert('Please select a valid place from the suggestions.');
            return;
        }

        const location = place.geometry.location;

        // Create a new POI
        const poi = {
            id: place.place_id || `${location.lat()}_${location.lng()}`, // Unique ID
            name: place.name,
            location: location,
        };

        // Create a new marker
        const marker = createMarker(poi, poiList.length);

        const newMarkers = [...markers, marker];
        const newPoiList = [...poiList, poi];

        // Update state
        setMarkers(newMarkers);
        setPoiList(newPoiList);

        adjustMapBounds(newMarkers);

        // Clear the input field
        inputRef.current.value = '';

        // Update the route with updated data
        updateRoute(newMarkers, newPoiList);
    };

    const adjustMapBounds = (markersToUse) => {
        const bounds = new google.maps.LatLngBounds();
        markersToUse.forEach((marker) => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    };

    const movePOI = (index, direction) => {
        const newIndex = index + direction;

        // Ensure new index is within bounds
        if (newIndex < 0 || newIndex >= poiList.length) {
            return;
        }

        // Copy the poiList array
        const newPoiList = [...poiList];

        // Swap POIs in newPoiList
        [newPoiList[index], newPoiList[newIndex]] = [newPoiList[newIndex], newPoiList[index]];

        // Remove existing markers from the map
        markers.forEach((marker) => marker.setMap(null));

        // Recreate markers in the new order with updated labels
        const updatedMarkers = newPoiList.map((poi, idx) => createMarker(poi, idx));

        // Update state
        setPoiList(newPoiList);
        setMarkers(updatedMarkers);

        // Update the route with updated data
        updateRoute(updatedMarkers, newPoiList);
    };

    // Function to create a marker with drag functionality
    const createMarker = (poi, index) => {
        const marker = new google.maps.Marker({
            position: poi.location,
            map: map,
            label: (index + 1).toString(),
            draggable: true,
        });

        // Add dragend event listener
        marker.addListener('dragend', () => {
            const newPosition = marker.getPosition();

            // Update the POI's location using functional state update
            setPoiList((prevPoiList) => {
                const updatedPoiList = prevPoiList.map((p) => {
                    if (p.id === poi.id) {
                        return { ...p, location: newPosition };
                    }
                    return p;
                });

                // Update the route with the updated POI list
                updateRoute(undefined, updatedPoiList);

                return updatedPoiList;
            });
        });

        return marker;
    };


    // Function to handle name change
    const handleNameChange = (id, newName) => {
        const updatedPoiList = poiList.map((poi) => {
            if (poi.id === id) {
                return { ...poi, name: newName };
            }
            return poi;
        });
        setPoiList(updatedPoiList);

        // Update the route to reflect the name change in leg details
        updateRoute(markers, updatedPoiList);
    };

    // Function to remove a POI
    const removePOI = (poiId) => {
        // Find the index of the POI to remove
        const indexToRemove = poiList.findIndex((poi) => poi.id === poiId);
        if (indexToRemove === -1) return;

        // Remove the marker from the map
        markers[indexToRemove].setMap(null);

        // Create new arrays excluding the removed POI and marker
        const newPoiList = poiList.filter((poi) => poi.id !== poiId);
        const newMarkers = markers.filter((_, index) => index !== indexToRemove);

        // Re-label the remaining markers and update their dragend event listeners
        newMarkers.forEach((marker, index) => {
            marker.setLabel((index + 1).toString());

            // Remove existing dragend listener to prevent duplicates
            google.maps.event.clearListeners(marker, 'dragend');

            // Add updated dragend event listener
            marker.addListener('dragend', () => {
                const newPosition = marker.getPosition();

                // Update the POI's location in poiList
                const updatedPoiList = newPoiList.map((p) => {
                    if (p.id === newPoiList[index].id) {
                        return { ...p, location: newPosition };
                    }
                    return p;
                });
                setPoiList(updatedPoiList);

                // Update the route
                updateRoute(newMarkers, updatedPoiList);
            });
        });

        // Update state
        setPoiList(newPoiList);
        setMarkers(newMarkers);

        // Update the route
        updateRoute(newMarkers, newPoiList);
    };

    return (
        <div id="poi-list">
            <div id="poi-input" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <TextField
                    id="search-input"
                    label="Search for POIs"
                    variant="outlined"
                    fullWidth
                    inputRef={inputRef}
                />
                <Button variant="contained" color="primary" onClick={addPOI}>
                    Add POI
                </Button>
            </div>
            <Typography variant="h5" gutterBottom>
                Points of Interest
            </Typography>
            <List>
                {poiList.map((poi, index) => (
                    <POIItem
                        key={poi.id}
                        poi={poi}
                        index={index}
                        movePOI={movePOI}
                        handleNameChange={handleNameChange}
                        removePOI={removePOI}
                        totalPOIs={poiList.length}
                    />
                ))}
            </List>
        </div>
    );
}

export default POIList;
