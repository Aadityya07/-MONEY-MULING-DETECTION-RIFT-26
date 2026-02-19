import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import LandingPage from './components/LandingPage';
import ProgressTracker from './components/ProgressTracker';
import SummaryStats from './components/SummaryStats';
import FraudRingTable from './components/FraudRingTable';
import SuspiciousTable from './components/SuspiciousTable';
import GraphVisualization from './components/GraphVisualization';

// Hook Imports
import { useAnalysis } from './hooks/useAnalysis';

export default function App() {
  const { appState, setFile, handleAnalyze, handleReset, analysisResult, error } = useAnalysis();

  // We need to track when the UI animation finishes separately from the API call
  const [animationComplete, setAnimationComplete] = useState(false);

  const startAnalysis = (file) => {
    setFile(file);
    setAnimationComplete(false);
    handleAnalyze(file);
  };

  // The condition to show results: Both API finished AND Animation finished
  const shouldShowResults = appState === 'results' && animationComplete;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">

        {/* STATE: UPLOAD (Now wrapped in the Tactical Landing Page) */}
        {appState === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full px-6"
          >
            <LandingPage
              onFileValid={(f) => setFile(f)}
              onAnalyze={startAnalysis}
            />
          </motion.div>
        )}

        {/* STATE: PROCESSING (or waiting for API to return) */}
        {(appState === 'processing' || (appState === 'results' && !animationComplete)) && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[80vh] px-6"
          >
            <ProgressTracker
              onCancel={handleReset}
              onAnimationComplete={() => setAnimationComplete(true)}
              isApiDone={appState === 'results'}
            />
          </motion.div>
        )}

        {/* STATE: RESULTS DASHBOARD */}
        {shouldShowResults && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto mt-6 px-6 pb-20"
          >
            {/* Header controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-border pb-4 mt-10">
              <h1 className="text-2xl font-bold text-text-primary font-mono uppercase tracking-widest flex items-center gap-3">
                <span className="w-3 h-3 bg-accent-clean rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
                Forensics Report Generated
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {/* Download Actions */}
                <DownloadButton suspiciousAccounts={analysisResult.suspicious_accounts} />

                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-text-secondary text-text-secondary hover:text-white hover:border-white transition-colors font-mono text-sm rounded"
                >
                  [ UPLOAD NEW DATASET ]
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <SummaryStats summary={analysisResult.summary} />

            {/* Empty State / Safe State */}
            {analysisResult.summary.suspicious_accounts_flagged === 0 && (
              <div className="p-8 text-center border border-accent-success bg-accent-success/10 rounded-xl mb-8">
                <h2 className="text-xl text-accent-success font-mono font-bold mb-2 uppercase">Dataset Verified Safe</h2>
                <p className="text-text-secondary font-mono">No money muling patterns detected in this transaction batch.</p>
              </div>
            )}

            {/* Cytoscape Graph Rendering */}
            {analysisResult.graph_data && (
              <GraphVisualization graphData={analysisResult.graph_data} />
            )}

            {/* Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <FraudRingTable rings={analysisResult.fraud_rings} />
              </div>
              <div className="flex flex-col">
                <SuspiciousTable accounts={analysisResult.suspicious_accounts} />
              </div>
            </div>

          </motion.div>
        )}

        {/* STATE: ERROR */}
        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
          >
            <div className="bg-background-card border border-accent-danger p-8 rounded-xl max-w-lg shadow-[0_0_30px_rgba(255,0,60,0.2)]">
              <h2 className="text-2xl font-bold text-accent-danger font-mono mb-4 uppercase">
                Critical System Failure
              </h2>
              <p className="text-text-primary mb-6 font-mono text-sm bg-background-primary p-4 border border-border rounded break-all">
                {error || "Unknown backend error occurred"}
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-accent-danger/20 text-accent-danger border border-accent-danger hover:bg-accent-danger hover:text-white transition-colors rounded font-mono uppercase tracking-wider"
              >
                Re-Initialize Upload
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}