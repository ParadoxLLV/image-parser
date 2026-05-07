import axios from "axios";

export const convertableExtensions = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/tiff",
];

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

export const MAX_FILES_GUESTS = 5;
export const MAX_FILES_FREE = 10;
export const MAX_FILES_PLUS = 25;
export const MAX_FILES_PREMIUM = 50;
export const MAX_FILES_PRO = 100;
