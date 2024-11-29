// src/utils/overviewMap.js

import { getStaticMapUrl } from './staticMap';
import { calculateZoomLevel } from './zoomCalculator';

/**
 * Generates the URL for the overview static map that fits all POIs with appropriate margins.
 *
 * @param {Array} poiList - The list of POIs.
 * @param {string} apiKey - Your Google Maps API key.
 * @returns {string} - The generated static map URL.
 */
export const generateOverviewMapUrl = (poiList, apiKey) => {
    if (poiList.length === 0) return '';

    // Extract all latitudes and longitudes
    const latitudes = poiList.map(poi => poi.location.lat());
    const longitudes = poiList.map(poi => poi.location.lng());

    // Calculate min and max
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Calculate spans
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate degree spans with margin
    const marginFactor = 1.2; // Increased margin to ensure all POIs are visible
    const adjustedLatSpan = latSpan * marginFactor;
    const adjustedLngSpan = lngSpan * marginFactor;

    // Define map image size
    const mapWidthPx = 800; // Width in pixels
    const mapHeightPx = 600; // Height in pixels
    const paddingPx = 40; // Padding in pixels (e.g., 5% of 800px)

    // Calculate zoom level using the enhanced calculator
    const zoom = calculateZoomLevel(adjustedLatSpan, adjustedLngSpan, mapWidthPx, mapHeightPx, 2, paddingPx);

    // Prepare markers
    const markers = poiList.map((poi, index) => ({
        color: 'red',
        label: `${index + 1}`,
        lat: poi.location.lat(),
        lng: poi.location.lng(),
    }));

    // Prepare path
    const path = poiList.map(poi => `${poi.location.lat()},${poi.location.lng()}`).join('|');

    return getStaticMapUrl({
        centerLat: centerLat,
        centerLng: centerLng,
        zoom: zoom,
        size: `${mapWidthPx}x${mapHeightPx}`,
        scale: 2,
        format: 'png',
        mapType: 'satellite',
        markers: markers,
        path: path,
        apiKey: apiKey,
    });
};
