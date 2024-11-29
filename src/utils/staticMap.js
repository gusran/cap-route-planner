// src/utils/staticMap.js

// src/utils/staticMap.js

export const getStaticMapUrl = (poi, apiKey, label) => {
    const lat = poi.location.lat(); // Access latitude using the method
    const lng = poi.location.lng(); // Access longitude using the method
    const zoom = 15; // Adjust zoom level as needed
    const size = '600x400'; // Width x Height in pixels
    const scale = 2; // For higher resolution
    const format = 'png'; // Ensure format matches the expected image type
    const markers = `color:red|label:${label}|${lat},${lng}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}&format=${format}&markers=${encodeURIComponent(markers)}&key=${apiKey}`;
};

