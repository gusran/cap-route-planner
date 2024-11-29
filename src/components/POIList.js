// src/components/POIList.js
/* global google */
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function POIList({ map, poiList, setPoiList, markers, setMarkers, updateRoute }) {
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        if (map && !autocomplete) {
            const input = document.getElementById('search-input');
            const autocompleteObj = new google.maps.places.Autocomplete(input);
            autocompleteObj.bindTo('bounds', map);
            setAutocomplete(autocompleteObj);
        }
    }, [map, autocomplete]);

    const addPOI = () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) {
            alert('Please select a valid place from the suggestions.');
            return;
        }
        const location = place.geometry.location;
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            label: (poiList.length + 1).toString(),
        });
        const newMarkers = [...markers, marker];
        const poi = {
            name: place.name,
            location: location,
            marker: marker,
        };
        const newPoiList = [...poiList, poi];

        // Update state
        setMarkers(newMarkers);
        setPoiList(newPoiList);

        adjustMapBounds(newMarkers);

        // Pass updated data to updateRoute
        updateRoute(newMarkers, newPoiList);
    };

    const adjustMapBounds = (markersToUse) => {
        const bounds = new google.maps.LatLngBounds();
        markersToUse.forEach((marker) => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedPOIs = Array.from(poiList);
        const [movedPOI] = reorderedPOIs.splice(result.source.index, 1);
        reorderedPOIs.splice(result.destination.index, 0, movedPOI);

        // Create new markers in the new order
        const newMarkers = reorderedPOIs.map((poi, index) => {
            const marker = new google.maps.Marker({
                position: poi.location,
                map: map,
                label: (index + 1).toString(),
            });
            return marker;
        });

        // Remove existing markers from the map
        markers.forEach((marker) => marker.setMap(null));

        // Update state
        setMarkers(newMarkers);
        setPoiList(reorderedPOIs);

        // Update the route with updated data
        updateRoute(newMarkers, reorderedPOIs);
    };

    return (
        <div id="poi-list">
            <div id="poi-input">
                <input id="search-input" type="text" placeholder="Search for POIs" />
                <button onClick={addPOI}>Add POI</button>
            </div>
            <h2>Points of Interest</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="poiList">
                    {(provided) => (
                        <ul id="poi-ul" {...provided.droppableProps} ref={provided.innerRef}>
                            {poiList.map((poi, index) => (
                                <Draggable key={index} draggableId={`poi-${index}`} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {poi.name}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default POIList;
