// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// export const api = axios.create({
//     baseURL: BASE_URL,
//     timeout: 35000,
// });

// export const checkHealth = () => api.get('/health');

// export const analyzeCSV = (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/analyze', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//     });
// };

// export const downloadReport = () => api.get('/download/report', { responseType: 'blob' });

import axios from 'axios';

// --- MOCK API FOR FRONTEND TESTING ---
// (We will swap this back to the real Axios calls once the Flask backend is done)

const MOCK_RESPONSE = {
    data: {
        suspicious_accounts: [
            { account_id: "ACC_MULE_01", suspicion_score: 95.5, detected_patterns: ["cycle_length_3", "high_velocity"], ring_id: "RING_ALPHA" },
            { account_id: "ACC_MULE_02", suspicion_score: 92.0, detected_patterns: ["cycle_length_3"], ring_id: "RING_ALPHA" },
            { account_id: "ACC_MULE_03", suspicion_score: 88.5, detected_patterns: ["cycle_length_3"], ring_id: "RING_ALPHA" },
            { account_id: "ACC_SMURF_99", suspicion_score: 75.0, detected_patterns: ["fan_in"], ring_id: "RING_BETA" }
        ],
        fraud_rings: [
            { ring_id: "RING_ALPHA", member_accounts: ["ACC_MULE_01", "ACC_MULE_02", "ACC_MULE_03"], pattern_type: "cycle", risk_score: 95.5 },
            { ring_id: "RING_BETA", member_accounts: ["ACC_SMURF_99", "ACC_TARGET_01", "ACC_TARGET_02"], pattern_type: "smurfing", risk_score: 75.0 }
        ],
        summary: {
            total_accounts_analyzed: 1042,
            suspicious_accounts_flagged: 4,
            fraud_rings_detected: 2,
            processing_time_seconds: 4.2
        },
        graph_data: {
            nodes: [
                // The Cycle Ring (Red, High Risk)
                { id: "ACC_MULE_01", label: "ACC_MULE_01", is_suspicious: true, is_whitelisted: false, suspicion_score: 95.5, ring_id: "RING_ALPHA", detected_patterns: ["cycle_length_3"], total_transactions: 45, total_sent: 500000, total_received: 500000 },
                { id: "ACC_MULE_02", label: "ACC_MULE_02", is_suspicious: true, is_whitelisted: false, suspicion_score: 92.0, ring_id: "RING_ALPHA", detected_patterns: ["cycle_length_3"], total_transactions: 12, total_sent: 490000, total_received: 495000 },
                { id: "ACC_MULE_03", label: "ACC_MULE_03", is_suspicious: true, is_whitelisted: false, suspicion_score: 88.5, ring_id: "RING_ALPHA", detected_patterns: ["cycle_length_3"], total_transactions: 8, total_sent: 480000, total_received: 485000 },

                // The Smurf Aggregator (Orange, Med Risk)
                { id: "ACC_SMURF_99", label: "ACC_SMURF_99", is_suspicious: true, is_whitelisted: false, suspicion_score: 75.0, ring_id: "RING_BETA", detected_patterns: ["fan_in"], total_transactions: 105, total_sent: 10000, total_received: 950000 },

                // A Legitimate Payroll Account (Grey Hexagon, Safe)
                { id: "CORP_PAYROLL", label: "CORP_PAYROLL", is_suspicious: false, is_whitelisted: true, suspicion_score: 5.0, ring_id: null, detected_patterns: [], total_transactions: 500, total_sent: 2500000, total_received: 0 },

                // Normal Clean Accounts (Blue, Safe)
                { id: "CLEAN_01", label: "CLEAN_01", is_suspicious: false, is_whitelisted: false, suspicion_score: 12.0, ring_id: null, detected_patterns: [], total_transactions: 4, total_sent: 1500, total_received: 2000 },
                { id: "CLEAN_02", label: "CLEAN_02", is_suspicious: false, is_whitelisted: false, suspicion_score: 8.0, ring_id: null, detected_patterns: [], total_transactions: 2, total_sent: 500, total_received: 0 }
            ],
            edges: [
                // Cycle Edges
                { id: "TX_1", source: "ACC_MULE_01", target: "ACC_MULE_02", amount: 150000, timestamp: "2024-02-19 10:00:00" },
                { id: "TX_2", source: "ACC_MULE_02", target: "ACC_MULE_03", amount: 148000, timestamp: "2024-02-19 10:05:00" },
                { id: "TX_3", source: "ACC_MULE_03", target: "ACC_MULE_01", amount: 145000, timestamp: "2024-02-19 10:15:00" },

                // Smurf Edges
                { id: "TX_4", source: "CLEAN_01", target: "ACC_SMURF_99", amount: 9500, timestamp: "2024-02-19 11:00:00" },
                { id: "TX_5", source: "CLEAN_02", target: "ACC_SMURF_99", amount: 9800, timestamp: "2024-02-19 11:05:00" },

                // Payroll Edge (to prove legitimate fan-out doesn't get flagged as a ring)
                { id: "TX_6", source: "CORP_PAYROLL", target: "CLEAN_01", amount: 5000, timestamp: "2024-02-01 09:00:00" },
                { id: "TX_7", source: "CORP_PAYROLL", target: "CLEAN_02", amount: 5000, timestamp: "2024-02-01 09:00:00" }
            ]
        }
    }
};

export const checkHealth = async () => {
    return { data: { status: 'ok' } };
};

export const analyzeCSV = async (file) => {
    console.log("MOCKING API CALL FOR FILE:", file.name);

    // Simulate server processing time (2.5 seconds)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_RESPONSE);
        }, 2500);
    });
};

export const downloadReport = async () => {
    // Return stringified JSON as a fake blob for the download button
    return { data: JSON.stringify(MOCK_RESPONSE.data, null, 2) };
};