// src/components/MapContainer.js
import React, { useState, useEffect, useRef } from 'react';
import POIList from './POIList';
import FlightInfo from './FlightInfo';

function MapContainer() {
    const [map, setMap] = useState(null);
    const [poiList, setPoiList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [averageSpeed, setAverageSpeed] = useState(180);
    const mapRef = useRef(null);

    useEffect(() => {
        const google = window.google;
        const mapObj = new google.maps.Map(mapRef.current, {
            center: { lat: 39.8283, lng: -98.5795 },
            zoom: 4,
        });
        setMap(mapObj);
    }, []);

    const updateRoute = (markersParam) => {
        const google = window.google;

        // Use the markers passed as parameter or from state
        const markersToUse = markersParam || markers;

        // Clear existing polylines (if you have them in state)
        // polylines.forEach((polyline) => polyline.setMap(null));
        // setPolylines([]);

        let distance = 0;

        // Draw new route
        for (let i = 0; i < markersToUse.length - 1; i++) {
            const origin = markersToUse[i].getPosition();
            const destination = markersToUse[i + 1].getPosition();

            // Calculate distance
            const legDistance =
                google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000; // in km
            distance += legDistance;

            // Draw polyline
            const polyline = new google.maps.Polyline({
                path: [origin, destination],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map,
            });
            // Optionally keep track of polylines
            // setPolylines((prevPolylines) => [...prevPolylines, polyline]);
        }
        setTotalDistance(distance);
    };

    return (
        <div>
            <div id="map" ref={mapRef} style={{ height: '60vh', width: '100%' }}></div>
            <div id="controls">
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
        </div>
    );
}

export default MapContainer;
