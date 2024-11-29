// src/utils/staticMap.js

export const getStaticMapUrl = (poi, apiKey) => {
    const { lat, lng } = poi.location;
    const center = `${lat},${lng}`;
    const zoom = 17; // Adjust zoom level as needed
    const size = '500x300'; // Image size in pixels
    const maptype = 'satellite';
    const marker = `color:red|label:P|${center}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${marker}&key=${apiKey}`;
};
