from datetime import timedelta
import numpy as np
import math

def violates_benfords_law(amounts):
    """USP: Forensic accounting check for fabricated transaction amounts."""
    if len(amounts) < 10:
        return False
        
    first_digits = []
    for a in amounts:
        try:
            # Get the first non-zero digit of the amount
            num_str = str(abs(float(a))).replace('.', '').lstrip('0')
            if num_str and num_str[0].isdigit():
                first_digits.append(int(num_str[0]))
        except:
            continue
            
    if not first_digits:
        return False
        
    counts = {i: 0 for i in range(1, 10)}
    for d in first_digits:
        if d in counts:
            counts[d] += 1
            
    total = len(first_digits)
    # Calculate Mean Absolute Error (MAE) against Benford's ideal distribution
    mae = sum(abs((counts[d]/total) - math.log10(1 + 1/d)) for d in range(1, 10))
    
    return mae > 0.4 # If deviation is high, amounts are likely fabricated

def detect_smurfing(G, df):
    suspicious_nodes = []
    payroll_like = []
    merchant_like = []
    benford_violators = [] # New list to track synthetic amounts

    for node in G.nodes():
        in_edges = list(G.in_edges(node, data=True))
        out_edges = list(G.out_edges(node, data=True))

        in_count = len(in_edges)
        out_count = len(out_edges)

        # --- Candidate Hub ---
        if in_count >= 10 or out_count >= 10:
            in_amounts = [data["amount"] for _, _, data in in_edges]
            out_amounts = [data["amount"] for _, _, data in out_edges]
            in_times = [data["timestamp"] for _, _, data in in_edges]
            out_times = [data["timestamp"] for _, _, data in out_edges]

            # Run Benford's Law check on outbound dispersal amounts
            if out_count >= 10 and violates_benfords_law(out_amounts):
                benford_violators.append(node)

            if in_times and out_times:
                time_window = max(out_times) - min(in_times)

                if time_window <= timedelta(hours=72):
                    total_in = sum(in_amounts)
                    total_out = sum(out_amounts)
                    flow_ratio = abs(total_in - total_out) / total_in if total_in > 0 else 1

                    # --- Mule Aggregator ---
                    if flow_ratio <= 0.25:
                        suspicious_nodes.append(node)

                    # --- Payroll Detection ---
                    if out_count >= 10:
                        variance = np.var(out_amounts)
                        if variance < 1000:  # regular salary pattern
                            payroll_like.append(node)

                    # --- Merchant Detection ---
                    if in_count >= 10 and out_count < 3:
                        merchant_like.append(node)

    return suspicious_nodes, payroll_like, merchant_like, benford_violators