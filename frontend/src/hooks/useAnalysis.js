import { useState } from 'react';
import { analyzeCSV } from '../services/api';

export const useAnalysis = () => {
    const [appState, setAppState] = useState('upload'); // 'upload' | 'processing' | 'results' | 'error'
    const [file, setFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (validFile) => {
        setAppState('processing');
        setError(null);
        try {
            const response = await analyzeCSV(validFile);
            setAnalysisResult(response.data);
            setAppState('results');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Unknown error occurred");
            setAppState('error');
        }
    };

    const handleReset = () => {
        setAppState('upload');
        setFile(null);
        setAnalysisResult(null);
        setError(null);
    };

    return {
        appState, file, setFile, analysisResult, error, handleAnalyze, handleReset
    };
};