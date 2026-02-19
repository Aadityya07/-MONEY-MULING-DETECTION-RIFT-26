import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileTerminal, ShieldAlert, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import Papa from 'papaparse';

export default function UploadSection({ onFileValid, onAnalyze }) {
    const [dragActive, setDragActive] = useState(false);
    const [localFile, setLocalFile] = useState(null);
    const [validations, setValidations] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const runValidationLogs = async (file) => {
        setIsScanning(true);
        setValidations([]);
        let logs = [];
        const addLog = (msg, status) => {
            logs = [...logs, { msg, status }];
            setValidations(logs);
        };

        // 1. Extension Check
        if (!file.name.endsWith('.csv')) {
            addLog("FILE EXTENSION MISMATCH: .csv required.", "error");
            setIsScanning(false);
            return;
        }
        addLog("FILE TYPE: Verified (.csv)", "success");
        await new Promise(r => setTimeout(r, 400)); // Cinematic delay

        // 2. Size Check (50MB)
        if (file.size > 50 * 1024 * 1024) {
            addLog("PAYLOAD TOO LARGE: Exceeds 50MB limit.", "error");
            setIsScanning(false);
            return;
        }
        addLog(`PAYLOAD SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB`, "success");
        await new Promise(r => setTimeout(r, 400));

        // 3. Parsing & Schema Check
        Papa.parse(file, {
            header: true,
            preview: 5,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields || [];
                const required = ['transaction_id', 'sender_id', 'receiver_id', 'amount', 'timestamp'];
                const missing = required.filter(h => !headers.includes(h));

                if (missing.length > 0) {
                    addLog(`SCHEMA ERROR: Missing columns [${missing.join(', ')}]`, "error");
                    setIsScanning(false);
                    return;
                }

                addLog("SCHEMA VALIDATION: All target columns present", "success");
                setIsValid(true);
                setIsScanning(false);
                onFileValid(file);
            }
        });
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setLocalFile(droppedFile);
            runValidationLogs(droppedFile);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setLocalFile(selectedFile);
            runValidationLogs(selectedFile);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-12">
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center justify-center p-3 bg-accent-clean/10 text-accent-clean rounded-full mb-4 border border-accent-clean/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    <ShieldAlert className="w-8 h-8" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-2 shadow-accent-clean">
                    Financial Forensics Engine
                </h1>
                <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">
                    Secure Data Ingestion Terminal // RIFT 2026
                </p>
            </div>

            {/* Cyber Dropzone */}
            <motion.div
                className={`relative overflow-hidden border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 backdrop-blur-sm ${dragActive ? 'border-accent-clean bg-accent-clean/5 shadow-[0_0_30px_rgba(0,240,255,0.15)]' : 'border-border bg-background-card/50 hover:border-text-secondary'
                    }`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
                {isScanning && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-accent-clean shadow-[0_0_10px_#00f0ff]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                )}

                <input type="file" accept=".csv" onChange={handleChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    <UploadCloud className={`w-12 h-12 ${dragActive ? 'text-accent-clean' : 'text-text-secondary'}`} />
                    <div>
                        <p className="text-lg font-medium text-text-primary">
                            Initialize Data Link (Drag & Drop)
                        </p>
                        <p className="text-sm font-mono text-text-secondary mt-1">
                            or click to browse local filesystem
                        </p>
                    </div>
                </label>
            </motion.div>

            {/* Terminal Readout */}
            <AnimatePresence>
                {localFile && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-6 bg-[#050b14] border border-border rounded-lg overflow-hidden font-mono text-xs"
                    >
                        <div className="bg-background-secondary px-4 py-2 border-b border-border flex items-center gap-2">
                            <FileTerminal className="w-4 h-4 text-text-secondary" />
                            <span className="text-text-secondary uppercase tracking-wider">Validation Output</span>
                        </div>
                        <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                            <div className="text-text-secondary">{'>'} Target identified: {localFile.name}</div>
                            {validations.map((log, i) => (
                                <motion.div
                                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-start gap-2 ${log.status === 'error' ? 'text-accent-danger' : 'text-accent-success'}`}
                                >
                                    {log.status === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                                    <span>{log.msg}</span>
                                </motion.div>
                            ))}
                            {isScanning && (
                                <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }} className="text-accent-clean">
                                    {'>'} Running heuristics...
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Execute Button */}
            <AnimatePresence>
                {isValid && !isScanning && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <button
                            onClick={() => onAnalyze(localFile)}
                            className="w-full relative group overflow-hidden rounded-lg bg-accent-clean/10 border border-accent-clean text-accent-clean font-bold font-mono tracking-widest py-4 transition-all hover:bg-accent-clean hover:text-background-primary shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            EXECUTE FORENSIC ANALYSIS
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}