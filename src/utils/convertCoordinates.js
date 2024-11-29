// src/utils/convertCoordinates.js

/**
 * Converts decimal degrees to degrees and minutes with hemisphere indicators.
 *
 * @param {number} decimalDegree - The decimal degree value.
 * @param {string} type - The type of coordinate ('lat' or 'lng').
 * @returns {string} - The formatted coordinate string (e.g., 'N59°52\'').
 */
export const convertDecimalToDegMin = (decimalDegree, type) => {
    const absolute = Math.abs(decimalDegree);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);

    let hemisphere = '';
    if (type === 'lat') {
        hemisphere = decimalDegree >= 0 ? 'N' : 'S';
    } else if (type === 'lng') {
        hemisphere = decimalDegree >= 0 ? 'E' : 'W';
    } else {
        throw new Error("Invalid coordinate type. Use 'lat' or 'lng'.");
    }

    return `${hemisphere}${degrees.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'`;
};
