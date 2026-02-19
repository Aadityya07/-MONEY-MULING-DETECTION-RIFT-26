import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Network, Clock } from 'lucide-react';

export default function SummaryStats({ summary }) {
    if (!summary) return null;

    const cards = [
        {
            title: "Total Accounts Analyzed",
            value: summary.total_accounts_analyzed,
            icon: Users,
            colorClass: "text-accent-clean",
            borderClass: "border-accent-clean",
            bgClass: "bg-accent-clean/10"
        },
        {
            title: "Suspicious Accounts Flagged",
            value: summary.suspicious_accounts_flagged,
            icon: AlertTriangle,
            colorClass: "text-accent-danger",
            borderClass: "border-accent-danger",
            bgClass: "bg-accent-danger/10"
        },
        {
            title: "Fraud Rings Detected",
            value: summary.fraud_rings_detected,
            icon: Network,
            colorClass: "text-accent-warning",
            borderClass: "border-accent-warning",
            bgClass: "bg-accent-warning/10"
        },
        {
            title: "Processing Time",
            value: `${summary.processing_time_seconds}s`,
            icon: Clock,
            colorClass: summary.processing_time_seconds < 30 ? "text-accent-success" : "text-accent-danger",
            borderClass: summary.processing_time_seconds < 30 ? "border-accent-success" : "border-accent-danger",
            bgClass: summary.processing_time_seconds < 30 ? "bg-accent-success/10" : "bg-accent-danger/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border border-border bg-background-card/50 backdrop-blur-sm flex items-center gap-4 relative overflow-hidden group hover:${card.borderClass} transition-colors duration-300`}
                    >
                        {/* Cyber glow effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                        <div className={`p-4 rounded-lg ${card.bgClass} ${card.colorClass}`}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-text-secondary font-mono text-xs uppercase tracking-wider mb-1">
                                {card.title}
                            </p>
                            <p className={`text-3xl font-bold font-mono ${card.colorClass}`}>
                                {card.value}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}