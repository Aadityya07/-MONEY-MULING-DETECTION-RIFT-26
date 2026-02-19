import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 35000,
});

export const checkHealth = () => api.get('/health');

export const analyzeCSV = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const downloadReport = () => api.get('/download/report', { responseType: 'blob' });