import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Network, Zap, ChevronDown, Activity, Lock } from 'lucide-react';
import UploadSection from './UploadSection';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function LandingPage({ onFileValid, onAnalyze }) {
    const scrollToTerminal = () => {
        document.getElementById('upload-terminal').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full max-w-7xl mx-auto pb-20">

            {/* Navbar / Header */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center py-6 border-b border-border/50 mb-12"
            >
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-accent-clean" />
                    <span className="font-mono font-bold text-lg tracking-widest uppercase shadow-accent-clean text-text-primary">
                        Project: RIFT-26
                    </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs border border-accent-success/30 bg-accent-success/10 text-accent-success px-3 py-1.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-success"></span>
                    </span>
                    SYSTEM SECURE & ONLINE
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.div
                variants={containerVariants} initial="hidden" animate="show"
                className="text-center max-w-4xl mx-auto mb-24 mt-10"
            >
                <motion.div variants={itemVariants} className="inline-block mb-4">
                    <span className="font-mono text-accent-clean text-sm border border-accent-clean/30 bg-accent-clean/10 px-4 py-1 rounded-full uppercase tracking-widest">
                        Financial Crime Detection Track
                    </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-text-secondary">
                    Detect Invisible Multi-Hop<br />Money Muling Networks.
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg text-text-secondary font-mono mb-10 max-w-2xl mx-auto leading-relaxed">
                    Traditional database queries fail to expose layered illicit funds. This graph-based forensic engine maps complex transaction chronologies to instantly isolate highly sophisticated fraud rings.
                </motion.p>

                <motion.div variants={itemVariants} className="flex justify-center gap-6">
                    <button
                        onClick={scrollToTerminal}
                        className="px-8 py-4 bg-accent-clean text-background-primary font-bold font-mono tracking-widest rounded shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all flex items-center gap-2 uppercase"
                    >
                        Access Terminal <ChevronDown className="w-5 h-5" />
                    </button>
                </motion.div>
            </motion.div>

            {/* Detection Modules Grid */}
            <motion.div
                variants={containerVariants} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
            >
                {/* Module 1 */}
                <motion.div variants={itemVariants} className="bg-background-secondary/50 border border-border p-8 rounded-xl hover:border-accent-danger transition-colors group">
                    <div className="w-12 h-12 bg-accent-danger/10 border border-accent-danger text-accent-danger rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-mono text-text-primary mb-3 uppercase tracking-wide">Circular Routing</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Identifies money flowing in closed loops (A → B → C → A) to obscure origin points. Detects path lengths of 3 to 5 hops with strict chronological validation.
                    </p>
                </motion.div>

                {/* Module 2 */}
                <motion.div variants={itemVariants} className="bg-background-secondary/50 border border-border p-8 rounded-xl hover:border-accent-warning transition-colors group">
                    <div className="w-12 h-12 bg-accent-warning/10 border border-accent-warning text-accent-warning rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Network className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-mono text-text-primary mb-3 uppercase tracking-wide">Smurfing Dynamics</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Analyzes heavy Fan-in (10+ senders to 1 receiver) and Fan-out structures within strict 72-hour temporal windows, while shielding legitimate payroll and merchant accounts.
                    </p>
                </motion.div>

                {/* Module 3 */}
                <motion.div variants={itemVariants} className="bg-background-secondary/50 border border-border p-8 rounded-xl hover:border-accent-clean transition-colors group">
                    <div className="w-12 h-12 bg-accent-clean/10 border border-accent-clean text-accent-clean rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-mono text-text-primary mb-3 uppercase tracking-wide">Shell Networks</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        Maps long-chain topologies spanning 3+ intermediary hops where bridging accounts display artificially suppressed total transaction volumes (2-3 lifetime transactions).
                    </p>
                </motion.div>
            </motion.div>

            {/* Terminal Section (The Component we already built) */}
            <div id="upload-terminal" className="pt-10 scroll-mt-10 relative">
                <div className="absolute inset-0 bg-accent-clean/5 blur-3xl rounded-full pointer-events-none" />
                <UploadSection onFileValid={onFileValid} onAnalyze={onAnalyze} />
            </div>

        </div>
    );
}