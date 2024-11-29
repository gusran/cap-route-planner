// src/utils/cache.js

import { convertBlobToBase64 } from './convertBlobToBase64';

const imageCache = {};

/**
 * Fetches an image from the given URL and caches it as a base64 string.
 *
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise<string>} - A promise that resolves to the base64 string.
 */
export const fetchImage = async (url) => {
    if (imageCache[url]) {
        return imageCache[url];
    }
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    const base64 = await convertBlobToBase64(blob);
    imageCache[url] = base64;
    return base64;
};
