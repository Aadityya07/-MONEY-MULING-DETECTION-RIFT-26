import React from 'react';
import { motion } from 'framer-motion';

export default function FraudRingTable({ rings }) {
    if (!rings || rings.length === 0) return null;

    const getPatternColor = (pattern) => {
        if (pattern.includes('cycle')) return 'bg-accent-danger/20 text-accent-danger border-accent-danger';
        if (pattern.includes('smurf')) return 'bg-accent-warning/20 text-accent-warning border-accent-warning';
        return 'bg-accent-neutral/20 text-accent-neutral border-accent-neutral';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-background-card border border-border rounded-xl overflow-hidden mb-8 shadow-lg"
        >
            <div className="p-4 border-b border-border bg-background-secondary flex justify-between items-center">
                <h3 className="text-lg font-mono font-bold text-accent-clean uppercase tracking-widest">
                    Detected Fraud Rings
                </h3>
                <span className="text-xs font-mono text-text-secondary">[{rings.length} RINGS IDENTIFIED]</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-[#050b14] text-text-secondary border-b border-border uppercase text-xs">
                        <tr>
                            <th className="p-4">Ring ID</th>
                            <th className="p-4">Pattern Type</th>
                            <th className="p-4 text-center">Members</th>
                            <th className="p-4 text-center">Risk Score</th>
                            <th className="p-4">Member IDs</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rings.map((ring) => (
                            <tr key={ring.ring_id} className="hover:bg-accent-clean/5 transition-colors cursor-pointer group">
                                <td className="p-4 font-bold text-text-primary group-hover:text-accent-clean">
                                    {ring.ring_id}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 border rounded text-xs uppercase ${getPatternColor(ring.pattern_type)}`}>
                                        {ring.pattern_type}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-text-primary">{ring.member_accounts.length}</td>
                                <td className="p-4 text-center">
                                    <span className={`font-bold ${ring.risk_score >= 80 ? 'text-accent-danger' : 'text-accent-warning'}`}>
                                        {ring.risk_score.toFixed(1)}
                                    </span>
                                </td>
                                <td className="p-4 text-text-secondary truncate max-w-xs" title={ring.member_accounts.join(', ')}>
                                    {ring.member_accounts.slice(0, 3).join(', ')}
                                    {ring.member_accounts.length > 3 && ` ... (+${ring.member_accounts.length - 3} more)`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}