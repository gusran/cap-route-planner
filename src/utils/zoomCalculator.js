// src/utils/zoomCalculator.js

/**
 * Calculates the optimal zoom level for a Static Map to fit the given latitude and longitude spans.
 *
 * @param {number} degreeSpanLat - The latitude degree span.
 * @param {number} degreeSpanLng - The longitude degree span.
 * @param {number} mapWidthPx - The width of the map in pixels.
 * @param {number} mapHeightPx - The height of the map in pixels.
 * @param {number} scale - The scale factor (1 or 2).
 * @param {number} paddingPx - The padding in pixels to apply on all sides.
 * @returns {number} - The calculated zoom level.
 */
export const calculateZoomLevel = (degreeSpanLat, degreeSpanLng, mapWidthPx, mapHeightPx, scale = 2, paddingPx = 20) => {
    // Constants for map dimensions
    const WORLD_DIM = { height: 256, width: 256 };

    // Convert degree span to radians for latitude
    const latRad = (lat) => {
        return (lat * Math.PI) / 180;
    };

    // Calculate the pixel span for latitude and longitude
    const latFraction = (latRad(degreeSpanLat) - latRad(0)) / Math.PI;
    const lngFraction = degreeSpanLng / 360;

    // Calculate the zoom levels based on map dimensions and degree spans
    const zoomLat = Math.floor(Math.log2((mapHeightPx - 2 * paddingPx) / (WORLD_DIM.height * latFraction)) + 0.5);
    const zoomLng = Math.floor(Math.log2((mapWidthPx - 2 * paddingPx) / (WORLD_DIM.width * lngFraction)) + 0.5);

    // Choose the smaller zoom level to ensure both dimensions fit
    const zoom = Math.min(zoomLat, zoomLng);

    // Clamp the zoom level within Google Maps' allowed range
    return Math.max(Math.min(zoom, 21), 0);
};
