// src/components/MapContainer.js

import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Grid,
    Button,
    CircularProgress,
    LinearProgress,
    TextField,
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import POIList from './POIList';
import FlightInfo from './FlightInfo';
import LegDetails from './LegDetails';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin
import { generateOverviewMapUrl } from '../utils/overviewMap'; // Import the overview map generator
import { getStaticMapUrl } from '../utils/staticMap';
import { convertDecimalToDegMin } from '../utils/convertCoordinates'; // Import the conversion function
import { fetchImage } from '../utils/cache'; // Import the fetchImage function

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MapContainer() {
    // State variables
    const [map, setMap] = useState(null);
    const [poiList, setPoiList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [averageSpeed, setAverageSpeed] = useState(100); // Default speed in knots
    const [legDetails, setLegDetails] = useState([]);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); // State for loading indicator
    const [pdfProgress, setPdfProgress] = useState(0); // Progress state
    const [routeName, setRouteName] = useState('Route 1'); // State for route name
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for success notification

    const mapRef = useRef(null);
    const polylinesRef = useRef([]); // Use a ref for polylines

    // Replace 'REACT_APP_GOOGLE_MAPS_API_KEY' with your actual env variable name
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
            console.log('Map initialized');
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
            const origin = new google.maps.LatLng(
                poiListToUse[i].location.lat(),
                poiListToUse[i].location.lng()
            );
            const destination = new google.maps.LatLng(
                poiListToUse[i + 1].location.lat(),
                poiListToUse[i + 1].location.lng()
            );

            // Check if origin and destination are the same
            if (
                poiListToUse[i].location.lat() === poiListToUse[i + 1].location.lat() &&
                poiListToUse[i].location.lng() === poiListToUse[i + 1].location.lng()
            ) {
                console.warn(
                    `POI ${i + 1} and POI ${i + 2} are the same location. Skipping polyline.`
                );
                legs.push({
                    from: poiListToUse[i].name,
                    to: poiListToUse[i + 1].name,
                    distance: 0,
                    heading: 0,
                });
                continue; // Skip drawing the polyline
            }

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
            console.log(
                `Polyline drawn from "${poiListToUse[i].name}" to "${poiListToUse[i + 1].name}"`
            );
        }

        // Update the polylines ref
        polylinesRef.current = newPolylines;

        // Update state
        setTotalDistance(distance);
        setLegDetails(legs);
        console.log(`Total Distance Calculated: ${distance.toFixed(2)} NM`);
    };

    const generatePDF = async () => {
        if (poiList.length === 0) {
            alert('No POIs to export.');
            return;
        }

        // Optional: Limit the number of POIs
        const MAX_POIS_PER_PDF = 50; // Adjust as needed
        if (poiList.length > MAX_POIS_PER_PDF) {
            alert(`Cannot export more than ${MAX_POIS_PER_PDF} POIs to a single PDF.`);
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

        // Add route name as title
        doc.setFontSize(18);
        doc.text(routeName, pageWidth / 2, 15, { align: 'center' });

        let yPosition = 25;
        const totalPOIs = poiList.length;

        // 1. Add Overview of the Complete Route
        console.log('Generating overview map...');
        const overviewMapUrl = generateOverviewMapUrl(poiList, GOOGLE_MAPS_API_KEY);
        if (overviewMapUrl) {
            try {
                const overviewBase64 = await fetchImage(overviewMapUrl);
                doc.addImage(overviewBase64, 'PNG', 10, yPosition, 190, 100);
                console.log('Added overview map to PDF');
                yPosition += 105;
            } catch (error) {
                console.error('Error fetching overview map:', error);
                alert(`Failed to fetch overview map: ${error.message}`);
                setIsGeneratingPDF(false);
                setPdfProgress(0);
                return;
            }
        }

        // 2. Add List of Legs as a Table
        if (legDetails.length > 0) {
            doc.setFontSize(16);
            doc.text('List of Legs', 10, yPosition);
            yPosition += 10;

            // Prepare table columns and rows
            const head = [['Leg Number', 'From', 'To', 'Distance (NM)', 'Heading (°)']];
            const body = legDetails.map((leg, index) => [
                `Leg ${index + 1}`,
                leg.from,
                leg.to,
                leg.distance === '0.00' ? '0' : leg.distance, // Handle zero distance
                leg.heading === '0' ? 'N/A' : leg.heading, // Handle zero heading
            ]);

            // Add table using autoTable
            doc.autoTable({
                head: head,
                body: body,
                startY: yPosition,
                styles: { fontSize: 12 },
                headStyles: { fillColor: [22, 160, 133] },
                theme: 'striped',
                margin: { horizontal: 10 },
            });

            // Update yPosition to after the table
            yPosition = doc.autoTable.previous.finalY + 10;
        }

        // 3. Add Detailed POIs with Satellite Maps
        for (const [index, poi] of poiList.entries()) {
            console.log(`Processing POI ${index + 1}: ${poi.name}`);

            // Add waypoint title with coordinates inline
            const poiLatFormatted = convertDecimalToDegMin(poi.location.lat(), 'lat');
            const poiLngFormatted = convertDecimalToDegMin(poi.location.lng(), 'lng');
            doc.setFontSize(14);
            doc.text(
                `Waypoint ${index + 1}: ${poi.name} (${poiLatFormatted} ${poiLngFormatted})`,
                10,
                yPosition
            );
            yPosition += 10;

            // Generate Static Map URL for Satellite Map
            const markerLabel = index + 1;
            const satelliteMapUrl = getStaticMapUrl({
                centerLat: poi.location.lat(),
                centerLng: poi.location.lng(),
                zoom: 15,
                size: '600x400',
                scale: 2,
                format: 'png',
                mapType: 'satellite',
                markers: [
                    {
                        color: 'red',
                        label: `${markerLabel}`,
                        lat: poi.location.lat(),
                        lng: poi.location.lng(),
                    },
                ],
                apiKey: GOOGLE_MAPS_API_KEY,
            });

            console.log(`Fetching Satellite Map for POI "${poi.name}": ${satelliteMapUrl}`);

            try {
                const satelliteBase64 = await fetchImage(satelliteMapUrl);
                doc.addImage(satelliteBase64, 'PNG', 10, yPosition, 190, 100);
                console.log(`Added satellite map for POI "${poi.name}" to PDF`);
                yPosition += 105;
            } catch (error) {
                console.error(`Error fetching satellite map image for "${poi.name}":`, error);
                alert(`Failed to fetch satellite map image for "${poi.name}": ${error.message}`);
                setIsGeneratingPDF(false);
                setPdfProgress(0);
                return;
            }

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
        }

        // Save the PDF
        try {
            doc.save('flight_plan.pdf');
            console.log('PDF saved successfully');
            setOpenSnackbar(true); // Open the snackbar on success
        } catch (error) {
            console.error('Error saving PDF:', error);
            alert(`Failed to save PDF: ${error.message}`);
        }

        setIsGeneratingPDF(false);
        setPdfProgress(0);
    };

    return (
        <>
            <Container sx={{ mt: 4 }}> {/* Added top margin */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        {/* Route Name Input */}
                        <TextField
                            label="Route Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                            sx={{ mb: 2 }} // Adds bottom margin for spacing
                        />
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
                            sx={{ mt: 2 }} // Replaced inline style with sx prop
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
                                sx={{ mt: 1 }} // Replaced inline style with sx prop
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <div id="map" ref={mapRef} style={{ height: '60vh', width: '100%' }}></div>
                        <LegDetails legDetails={legDetails} />
                    </Grid>
                </Grid>
            </Container>

            {/* Success Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    PDF generated successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default MapContainer;
