import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function NodeDetailPanel({ node, onClose, onRingClick }) {
    if (!node) return null;

    const isSuspicious = node.is_suspicious;
    const isWhitelisted = node.is_whitelisted;
    const score = node.suspicion_score || 0;

    const getRiskLevel = () => {
        if (score >= 70) return { label: 'HIGH RISK', color: 'text-accent-danger', bg: 'bg-accent-danger' };
        if (score >= 40) return { label: 'MEDIUM RISK', color: 'text-accent-warning', bg: 'bg-accent-warning' };
        return { label: 'LOW RISK', color: 'text-accent-success', bg: 'bg-accent-success' };
    };

    const risk = getRiskLevel();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-0 right-0 w-[300px] h-full bg-background-card/95 backdrop-blur-md border-l border-border shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 flex flex-col font-mono"
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-background-secondary">
                    <h2 className="text-lg font-bold text-text-primary break-all pr-2">
                        {node.id}
                    </h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-accent-clean transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">

                    {/* Risk Score Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-text-secondary uppercase">Risk Score</span>
                            <span className={`text-2xl font-bold ${risk.color}`}>{score.toFixed(1)}</span>
                        </div>
                        <div className="h-2 w-full bg-background-primary rounded-full overflow-hidden border border-border">
                            <div className={`h-full ${risk.bg}`} style={{ width: `${Math.max(score, 2)}%` }} />
                        </div>
                        <div className={`mt-2 inline-block px-2 py-1 border rounded text-[10px] font-bold ${risk.color} border-current`}>
                            {risk.label}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                            <span className="flex items-center gap-2 text-xs text-text-secondary"><Activity className="w-4 h-4" /> Transactions</span>
                            <span className="text-sm font-bold">{node.total_transactions}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                            <span className="flex items-center gap-2 text-xs text-text-secondary"><ArrowUpRight className="w-4 h-4 text-accent-warning" /> Sent</span>
                            <span className="text-sm font-bold">₹{node.total_sent?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                            <span className="flex items-center gap-2 text-xs text-text-secondary"><ArrowDownRight className="w-4 h-4 text-accent-clean" /> Received</span>
                            <span className="text-sm font-bold">₹{node.total_received?.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Rings & Patterns */}
                    {node.ring_id && (
                        <div>
                            <span className="text-xs text-text-secondary uppercase block mb-1">Associated Ring</span>
                            <button
                                onClick={() => onRingClick(node.ring_id)}
                                className="text-sm text-accent-warning hover:text-accent-clean underline cursor-pointer"
                            >
                                {node.ring_id}
                            </button>
                        </div>
                    )}

                    {node.detected_patterns?.length > 0 && (
                        <div>
                            <span className="text-xs text-text-secondary uppercase block mb-2">Detected Patterns</span>
                            <div className="flex flex-wrap gap-2">
                                {node.detected_patterns.map(p => (
                                    <span key={p} className="px-2 py-1 text-[10px] border border-accent-danger/50 text-accent-danger rounded bg-accent-danger/10 uppercase">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="p-4 border-t border-border bg-[#050b14]">
                    {isSuspicious ? (
                        <div className="flex gap-3 items-start text-accent-danger">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-[10px] leading-tight uppercase">⚠️ Flagged for investigation. Requires human review before action.</p>
                        </div>
                    ) : isWhitelisted ? (
                        <div className="flex gap-3 items-start text-accent-success">
                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-[10px] leading-tight uppercase">✅ Verified legitimate account (merchant/payroll pattern).</p>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-start text-accent-clean">
                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-[10px] leading-tight uppercase">Standard account. No suspicious activity detected.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}