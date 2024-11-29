// src/components/POIList.js
/* global google */
import React, { useState, useEffect, useRef } from 'react';

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

        // Create a new marker
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            label: (poiList.length + 1).toString(),
        });

        const poi = {
            id: place.place_id || `${location.lat()}_${location.lng()}`, // Unique ID
            name: place.name,
            location: location,
            marker: marker,
        };

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

        // Copy the poiList and markers arrays
        const newPoiList = [...poiList];
        const newMarkers = [...markers];

        // Swap POIs in newPoiList
        [newPoiList[index], newPoiList[newIndex]] = [newPoiList[newIndex], newPoiList[index]];

        // Remove existing markers from the map
        markers.forEach((marker) => marker.setMap(null));

        // Recreate markers in the new order with updated labels
        const updatedMarkers = newPoiList.map((poi, idx) => {
            const marker = new google.maps.Marker({
                position: poi.location,
                map: map,
                label: (idx + 1).toString(),
            });
            return marker;
        });

        // Update state
        setPoiList(newPoiList);
        setMarkers(updatedMarkers);

        // Update the route with updated data
        updateRoute(updatedMarkers, newPoiList);
    };

    return (
        <div id="poi-list">
            <div id="poi-input">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search for POIs"
                    ref={inputRef}
                    onFocus={() => {
                        if (autocomplete) {
                            autocomplete.setTypes(['geocode', 'establishment']);
                        }
                    }}
                />
                <button onClick={addPOI}>Add POI</button>
            </div>
            <h2>Points of Interest</h2>
            <ul>
                {poiList.map((poi, index) => (
                    <li key={poi.id}>
                        {poi.name}
                        <button onClick={() => movePOI(index, -1)} disabled={index === 0}>
                            ↑
                        </button>
                        <button onClick={() => movePOI(index, 1)} disabled={index === poiList.length - 1}>
                            ↓
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default POIList;
