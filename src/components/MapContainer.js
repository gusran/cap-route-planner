// src/components/MapContainer.js

import React, { useState, useEffect, useRef } from 'react';
import POIList from './POIList';
import FlightInfo from './FlightInfo';
import LegDetails from './LegDetails';

function MapContainer() {
    const [map, setMap] = useState(null);
    const [poiList, setPoiList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [averageSpeed, setAverageSpeed] = useState(100); // Default speed in knots
    const [legDetails, setLegDetails] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        const google = window.google;
        const mapObj = new google.maps.Map(mapRef.current, {
            center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
            zoom: 4,
        });
        setMap(mapObj);
    }, []);

    const updateRoute = (markersParam, poiListParam) => {
        const google = window.google;

        const markersToUse = markersParam || markers;
        const poiListToUse = poiListParam || poiList;

        if (markersToUse.length < 2) {
            // Not enough markers to draw a route
            setTotalDistance(0);
            setLegDetails([]);
            return;
        }

        // Clear existing polylines
        polylines.forEach((polyline) => polyline.setMap(null));
        setPolylines([]);

        let distance = 0;
        const legs = [];
        const newPolylines = [];

        // Draw new route
        for (let i = 0; i < markersToUse.length - 1; i++) {
            const origin = markersToUse[i].getPosition();
            const destination = markersToUse[i + 1].getPosition();

            // Calculate distance in meters
            const legDistanceMeters = google.maps.geometry.spherical.computeDistanceBetween(
                origin,
                destination
            );

            // Convert distance to nautical miles
            const legDistanceNM = legDistanceMeters / 1852;

            // Calculate heading
            const heading = google.maps.geometry.spherical.computeHeading(origin, destination);

            distance += legDistanceNM;

            // Save leg details
            legs.push({
                from: poiListToUse[i].name,
                to: poiListToUse[i + 1].name,
                distance: legDistanceNM.toFixed(2),
                heading: ((heading + 360) % 360).toFixed(0),
            });

            // Draw polyline
            const polyline = new google.maps.Polyline({
                path: [origin, destination],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map,
            });
            newPolylines.push(polyline);
        }
        setPolylines(newPolylines);
        setTotalDistance(distance);
        setLegDetails(legs);
    };

    return (
        <div>
            <h1>Civil Air Patrol Route Planner</h1>
            <div id="main-content" style={{ display: 'flex', flexDirection: 'row' }}>
                <div id="left-panel" style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    <POIList
                        map={map}
                        poiList={poiList}
                        setPoiList={setPoiList}
                        markers={markers}
                        setMarkers={setMarkers}
                        updateRoute={updateRoute}
                    />
                    <FlightInfo
                        totalDistance={totalDistance}
                        averageSpeed={averageSpeed}
                        setAverageSpeed={setAverageSpeed}
                    />
                </div>
                <div id="map-and-details" style={{ flex: 2, padding: '10px' }}>
                    <div id="map" ref={mapRef} style={{ height: '60vh', width: '100%' }}></div>
                    <LegDetails legDetails={legDetails} />
                </div>
            </div>
        </div>
    );
}

export default MapContainer;
