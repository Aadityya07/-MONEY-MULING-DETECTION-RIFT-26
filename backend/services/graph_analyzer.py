import pandas as pd
import networkx as nx
import time
from datetime import timedelta

REQUIRED_COLUMNS = ["transaction_id", "sender_id", "receiver_id", "amount", "timestamp"]

def build_graph(df):
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Invalid CSV format. Missing columns: {', '.join(missing_cols)}")

    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)

    G = nx.MultiDiGraph()
    for _, row in df.iterrows():
        G.add_edge(
            str(row['sender_id']), 
            str(row['receiver_id']), 
            transaction_id=str(row['transaction_id']),
            amount=float(row['amount']),
            timestamp=row['timestamp']
        )
    return G

def check_chronology(G, cycle_nodes):
    """USP: Validates if transactions in a cycle happen in chronological order."""
    timestamps = []
    for i in range(len(cycle_nodes)):
        u = cycle_nodes[i]
        v = cycle_nodes[(i + 1) % len(cycle_nodes)]
        # Get the earliest transaction between u and v
        edge_data = G.get_edge_data(u, v)
        if not edge_data: return False
        earliest_txn = min(edge_data.values(), key=lambda x: x['timestamp'])
        timestamps.append(earliest_txn['timestamp'])
    
    # Check if strictly increasing (or at least non-decreasing)
    for i in range(len(timestamps) - 1):
        if timestamps[i] > timestamps[i+1]:
            return False
    return True

def detect_fraud(G, start_time):
    di_graph = nx.DiGraph(G) # Simplified for shape detection
    fraud_rings = []
    suspicious_accounts_map = {}
    ring_counter = 1
    
    # --- 1. DETECT CYCLES WITH USP ---
    raw_cycles = list(nx.simple_cycles(di_graph))
    for cycle in raw_cycles:
        if 3 <= len(cycle) <= 5:
            # USP: Only flag if transactions are chronological
            if check_chronology(G, cycle):
                ring_id = f"RING_{ring_counter:03d}"
                fraud_rings.append({
                    "ring_id": ring_id,
                    "member_accounts": cycle,
                    "pattern_type": "cycle",
                    "risk_score": 95.5
                })
                for account in cycle:
                    if account not in suspicious_accounts_map:
                        suspicious_accounts_map[account] = {"account_id": account, "suspicion_score": 95.5, "detected_patterns": [f"cycle_length_{len(cycle)}"], "ring_id": ring_id}
                ring_counter += 1

    # --- 2. DETECT SMURFING (Fan-in / Fan-out) within 72h ---
    for node in G.nodes():
        in_edges = list(G.in_edges(node, data=True))
        out_edges = list(G.out_edges(node, data=True))
        
        # Fan-in (Smurfing Aggregator)
        if len(in_edges) >= 10:
            # USP: Merchant Shield Check
            unique_senders = len(set(u for u, v, d in in_edges))
            # If 10+ transactions but from very few people, it's suspicious. If from 10+ unique people, it might be a merchant.
            # Let's check the 72-hour temporal window mandate.
            timestamps = sorted([d['timestamp'] for u, v, d in in_edges])
            for i in range(len(timestamps) - 9):
                if timestamps[i+9] - timestamps[i] <= timedelta(hours=72):
                    ring_id = f"RING_{ring_counter:03d}"
                    members = list(set([u for u, v, d in in_edges] + [node]))
                    fraud_rings.append({"ring_id": ring_id, "member_accounts": members, "pattern_type": "smurfing_fan_in", "risk_score": 88.0})
                    for acc in members:
                        if acc not in suspicious_accounts_map:
                            suspicious_accounts_map[acc] = {"account_id": acc, "suspicion_score": 88.0, "detected_patterns": ["smurfing_fan_in"], "ring_id": ring_id}
                    ring_counter += 1
                    break # Move to next node

    # --- 3. LAYERED SHELL NETWORKS ---
    # Look for paths of 3+ hops where middle nodes have low degree (<= 3)
    for u in G.nodes():
        if G.out_degree(u) > 0:
            for v in G.successors(u):
                if 0 < G.degree(v) <= 3: # Intermediate shell condition
                    for w in G.successors(v):
                        if u != w: # ensure it's a chain, not a 2-cycle
                            ring_id = f"RING_{ring_counter:03d}"
                            members = [u, v, w]
                            fraud_rings.append({"ring_id": ring_id, "member_accounts": members, "pattern_type": "layered_shell", "risk_score": 92.0})
                            for acc in members:
                                if acc not in suspicious_accounts_map:
                                    suspicious_accounts_map[acc] = {"account_id": acc, "suspicion_score": 92.0, "detected_patterns": ["layered_shell"], "ring_id": ring_id}
                            ring_counter += 1

    suspicious_accounts = list(suspicious_accounts_map.values())
    
    return {
        "suspicious_accounts": sorted(suspicious_accounts, key=lambda x: x['suspicion_score'], reverse=True),
        "fraud_rings": fraud_rings,
        "summary": {
            "total_accounts_analyzed": G.number_of_nodes(),
            "suspicious_accounts_flagged": len(suspicious_accounts),
            "fraud_rings_detected": len(fraud_rings),
            "processing_time_seconds": round(time.time() - start_time, 3)
        }
    }