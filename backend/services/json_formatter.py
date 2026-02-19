import time

def format_response(scores, rings, node_patterns, node_ring_map, start_time, total_accounts):
    suspicious_accounts = []

    for acc, score in scores.items():
        # Only include nodes that are actually suspicious (score >= 50)
        if score >= 50:
            suspicious_accounts.append({
                "account_id": str(acc),
                "suspicion_score": float(min(100.0, round(score, 2))),
                "detected_patterns": node_patterns.get(acc, []),
                "ring_id": node_ring_map.get(acc, "UNKNOWN")
            })

    suspicious_accounts.sort(
        key=lambda x: x["suspicion_score"],
        reverse=True
    )

    summary = {
        "total_accounts_analyzed": total_accounts,
        "suspicious_accounts_flagged": len(suspicious_accounts),
        "fraud_rings_detected": len(rings),
        "processing_time_seconds": round(time.time() - start_time, 2)
    }

    return {
        "suspicious_accounts": suspicious_accounts,
        "fraud_rings": rings,
        "summary": summary
    }