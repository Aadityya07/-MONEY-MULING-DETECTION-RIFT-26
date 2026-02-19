import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock, TerminalSquare, XSquare } from 'lucide-react';

const STEPS = [
    { id: 1, label: "Parsing CSV transactions", duration: 1500 },
    { id: 2, label: "Building transaction graph", duration: 1000 },
    { id: 3, label: "Pre-filtering legitimate accounts", duration: 800 },
    { id: 4, label: "Detecting fraud cycles", duration: 3000 },
    { id: 5, label: "Analyzing smurfing patterns", duration: 2500 },
    { id: 6, label: "Identifying shell networks", duration: 2000 },
    { id: 7, label: "Calculating risk scores", duration: 500 }
];

export default function ProgressTracker({ onCancel, onAnimationComplete, isApiDone }) {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [elapsed, setElapsed] = useState("0.0");

    // Handle the simulated progression
    useEffect(() => {
        if (activeStepIndex < STEPS.length) {
            const timer = setTimeout(() => {
                setActiveStepIndex(prev => prev + 1);
            }, STEPS[activeStepIndex].duration);
            return () => clearTimeout(timer);
        } else if (activeStepIndex === STEPS.length) {
            // Animation is done. Tell the parent we are ready for results!
            onAnimationComplete();
        }
    }, [activeStepIndex, onAnimationComplete]);

    // Handle the high-precision elapsed timer
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto mt-12 p-6 bg-background-card/80 backdrop-blur-md border border-border rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">

            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-3 text-accent-clean">
                    <TerminalSquare className="w-6 h-6" />
                    <h2 className="text-xl font-mono font-bold tracking-widest uppercase shadow-accent-clean">
                        Executing Forensics Pipeline
                    </h2>
                </div>
                <div className="text-text-secondary font-mono text-sm bg-background-primary px-3 py-1 rounded border border-border">
                    Target: max 10,000 tx
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-4 font-mono">
                {STEPS.map((step, index) => {
                    const isComplete = index < activeStepIndex;
                    const isActive = index === activeStepIndex;
                    const isPending = index > activeStepIndex;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-lg border-l-4 transition-all duration-300 ${isActive
                                    ? 'border-accent-clean bg-accent-clean/10 shadow-[inset_4px_0_0_#00f0ff]'
                                    : isComplete
                                        ? 'border-accent-success bg-background-primary/50 text-accent-success'
                                        : 'border-transparent text-text-secondary opacity-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {isComplete && <CheckCircle2 className="w-5 h-5 text-accent-success" />}
                                {isActive && <Loader2 className="w-5 h-5 text-accent-clean animate-spin" />}
                                {isPending && <Clock className="w-5 h-5" />}

                                <span className={`text-sm tracking-wide ${isActive ? 'text-accent-clean font-bold' : ''}`}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Step timing readout */}
                            {isComplete && (
                                <span className="text-xs text-accent-success/70">
                                    +{(step.duration / 1000).toFixed(1)}s
                                </span>
                            )}
                        </motion.div>
                    );
                })}

                {/* Finalizing State (Waiting for Backend) */}
                {activeStepIndex === STEPS.length && !isApiDone && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-center py-4 text-accent-warning font-mono text-sm animate-pulse"
                    >
                        Awaiting server synchronization...
                    </motion.div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-text-secondary hover:text-accent-danger transition-colors font-mono text-sm"
                >
                    <XSquare className="w-4 h-4" /> ABORT OPERATION
                </button>

                <div className="font-mono text-lg font-bold text-accent-clean flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="w-16 text-right">T+{elapsed}s</span>
                </div>
            </div>
        </div>
    );
}