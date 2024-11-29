// src/utils/convertBlobToBase64.js

export const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
            reader.abort();
            reject(new Error("Problem parsing input blob."));
        };
        reader.onload = () => {
            const dataUrl = reader.result;
            // Extract base64 part from Data URL
            const base64 = dataUrl.split(",")[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
};
