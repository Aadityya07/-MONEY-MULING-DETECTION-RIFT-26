import React from 'react';
import { motion } from 'framer-motion';

export default function SuspiciousTable({ accounts }) {
    if (!accounts || accounts.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-background-card border border-border rounded-xl overflow-hidden shadow-lg"
        >
            <div className="p-4 border-b border-border bg-background-secondary">
                <h3 className="text-lg font-mono font-bold text-accent-danger uppercase tracking-widest">
                    Suspicious Accounts Ledger
                </h3>
            </div>
            <div className="max-h-96 overflow-y-auto relative">
                <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-[#050b14] text-text-secondary border-b border-border uppercase text-xs sticky top-0 z-10 shadow-md">
                        <tr>
                            <th className="p-4">Account ID</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Detected Patterns</th>
                            <th className="p-4">Ring ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {accounts.map((acc, idx) => (
                            <tr key={`${acc.account_id}-${idx}`} className="hover:bg-accent-danger/5 transition-colors">
                                <td className="p-4 font-bold text-text-primary">{acc.account_id}</td>
                                <td className="p-4">
                                    <span className={`font-bold ${acc.suspicion_score >= 80 ? 'text-accent-danger' : 'text-accent-warning'}`}>
                                        {acc.suspicion_score.toFixed(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {acc.detected_patterns.map(pattern => (
                                            <span key={pattern} className="px-2 py-0.5 text-[10px] border border-border text-text-secondary rounded uppercase">
                                                {pattern}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-text-secondary">{acc.ring_id || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}