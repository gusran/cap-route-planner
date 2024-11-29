// src/components/MapContainer.js

import React, { useState, useEffect, useRef } from 'react';
import POIList from './POIList';
import FlightInfo from './FlightInfo';
import LegDetails from './LegDetails';
import { Container, Grid, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import jsPDF from 'jspdf';
import { getStaticMapUrl } from '../utils/staticMap';
import { convertBlobToBase64 } from '../utils/convertBlobToBase64';

function MapContainer() {
    const [map, setMap] = useState(null);
    const [poiList, setPoiList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [averageSpeed, setAverageSpeed] = useState(100); // Default speed in knots
    const [legDetails, setLegDetails] = useState([]);
    const mapRef = useRef(null);
    const polylinesRef = useRef([]); // Use a ref for polylines
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // State for loading indicator
    const [pdfProgress, setPdfProgress] = useState(0); // Progress state

    // Replace 'REACT_APP_MY_MAP_KEY' with your actual env variable name
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Temporary console log for verification (remove after testing)
    console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY);

    useEffect(() => {
        if (window.google && mapRef.current && !map) {
            const google = window.google;
            const mapObj = new google.maps.Map(mapRef.current, {
                center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
                zoom: 4,
            });
            setMap(mapObj);
        }
    }, [map]);

    const updateRoute = (markersParam, poiListParam) => {
        const google = window.google;

        const poiListToUse = poiListParam || poiList;

        if (poiListToUse.length < 2) {
            // Not enough POIs to draw a route
            setTotalDistance(0);
            setLegDetails([]);

            // Clear existing polylines
            polylinesRef.current.forEach((polyline) => polyline.setMap(null));
            polylinesRef.current = [];

            return;
        }

        // Clear existing polylines
        polylinesRef.current.forEach((polyline) => polyline.setMap(null));
        polylinesRef.current = [];

        let distance = 0;
        const legs = [];
        const newPolylines = [];

        // Draw new route
        for (let i = 0; i < poiListToUse.length - 1; i++) {
            const origin = poiListToUse[i].location;
            const destination = poiListToUse[i + 1].location;

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

        // Update the polylines ref
        polylinesRef.current = newPolylines;

        // Update state
        setTotalDistance(distance);
        setLegDetails(legs);
    };

    const generatePDF = async () => {
        if (poiList.length === 0) {
            alert('No POIs to export.');
            return;
        }

        // Validate POIs
        for (const [index, poi] of poiList.entries()) {
            if (
                !poi.name ||
                !poi.location ||
                typeof poi.location.lat !== 'function' ||
                typeof poi.location.lng !== 'function'
            ) {
                alert(`Invalid POI detected at index ${index}: ${JSON.stringify(poi)}`);
                return;
            }
        }

        setIsGeneratingPDF(true);
        setPdfProgress(0);

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Add title
        doc.setFontSize(18);
        doc.text('Flight Plan', pageWidth / 2, 15, { align: 'center' });

        let yPosition = 25;
        const totalPOIs = poiList.length;

        for (const [index, poi] of poiList.entries()) {
            console.log(`Processing POI ${index + 1}: ${poi.name}`);

            // Add waypoint title
            doc.setFontSize(14);
            doc.text(`Waypoint ${index + 1}: ${poi.name}`, 10, yPosition);
            yPosition += 10;

            // Add leg details if applicable
            if (index < legDetails.length) {
                const leg = legDetails[index];
                doc.setFontSize(12);
                doc.text(`Distance to next waypoint: ${leg.distance} NM`, 10, yPosition);
                yPosition += 7;
                doc.text(`Heading to next waypoint: ${leg.heading}°`, 10, yPosition);
                yPosition += 10;
            }

            // Generate Static Map URL
            const markerLabel = index + 1;
            const staticMapUrl = getStaticMapUrl(poi, GOOGLE_MAPS_API_KEY, markerLabel);
            console.log(`Fetching Static Map for POI "${poi.name}": ${staticMapUrl}`);

            try {
                // Fetch the image as a blob
                const response = await fetch(staticMapUrl, { mode: 'cors' });
                console.log(`Response Status for POI "${poi.name}":`, response.status, response.statusText);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }

                const blob = await response.blob();
                console.log(`Blob Size for POI "${poi.name}":`, blob.size, 'bytes');

                // Convert blob to base64
                const base64Image = await convertBlobToBase64(blob);
                console.log(`Base64 Image Length for POI "${poi.name}":`, base64Image.length);

                // Validate base64 string
                if (!base64Image || base64Image.length < 100) { // Arbitrary length check
                    throw new Error('Received invalid base64 image data.');
                }

                // Add the image to the PDF
                doc.addImage(base64Image, 'PNG', 10, yPosition, 190, 100);
                console.log(`Added image for POI "${poi.name}" to PDF at position (${10}, ${yPosition})`);
                yPosition += 105;

                // Add attribution
                doc.setFontSize(8);
                doc.text('Map data © Google', 10, yPosition);
                yPosition += 10;

                // Update progress
                setPdfProgress(((index + 1) / totalPOIs) * 100);
                console.log(`Progress: ${((index + 1) / totalPOIs) * 100}%`);

                // Check if adding the next POI would exceed the page height
                if (yPosition + 120 > doc.internal.pageSize.getHeight()) {
                    doc.addPage();
                    console.log('Added new page to PDF');
                    yPosition = 15;
                }
            } catch (error) {
                console.error(`Error fetching static map image for "${poi.name}":`, error);
                alert(`Failed to fetch map image for "${poi.name}": ${error.message}`);
                setIsGeneratingPDF(false);
                setPdfProgress(0);
                return;
            }
        }

        // Save the PDF
        try {
            doc.save('flight_plan.pdf');
            console.log('PDF saved successfully');
        } catch (error) {
            console.error('Error saving PDF:', error);
            alert(`Failed to save PDF: ${error.message}`);
        }

        setIsGeneratingPDF(false);
        setPdfProgress(0);
    };


    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Civil Air Patrol Route Planner
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={generatePDF}
                        disabled={isGeneratingPDF || poiList.length === 0}
                        style={{ marginTop: '16px' }}
                    >
                        {isGeneratingPDF ? (
                            <>
                                <CircularProgress size={24} color="inherit" />
                                &nbsp; Generating PDF...
                            </>
                        ) : (
                            'Export Route to PDF'
                        )}
                    </Button>
                    {isGeneratingPDF && (
                        <LinearProgress
                            variant="determinate"
                            value={pdfProgress}
                            style={{ marginTop: '10px' }}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={8}>
                    <div id="map" ref={mapRef} style={{ height: '60vh', width: '100%' }}></div>
                    <LegDetails legDetails={legDetails} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default MapContainer;
