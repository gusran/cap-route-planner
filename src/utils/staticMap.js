// src/utils/staticMap.js

export const getStaticMapUrl = (params) => {
    const {
        centerLat,
        centerLng,
        zoom = 15,
        size = '600x400',
        scale = 2,
        format = 'png',
        mapType = 'satellite', // 'roadmap', 'satellite', 'terrain', 'hybrid'
        markers = [],
        path = '',
    } = params;

    let markersParam = markers.map(marker => {
        const { color = 'red', label, lat, lng } = marker;
        return `color:${color}|label:${label}|${lat},${lng}`;
    }).join('&markers=');

    // If path is provided, include it
    let pathParam = '';
    if (path) {
        pathParam = `&path=weight:3|color:blue|${path}`;
    }

    return `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=${size}&scale=${scale}&format=${format}&maptype=${mapType}&markers=${markersParam}${pathParam}&key=${params.apiKey}`;
};
