import networkx as nx


def _compute_centrality(G):
    node_count = G.number_of_nodes()

    if node_count == 0:
        return {}

    simple_graph = nx.DiGraph(G)

    if node_count > 4000:
        return {}

    if node_count > 1200:
        sample_k = min(200, node_count)
        return nx.betweenness_centrality(simple_graph, k=sample_k, seed=42)

    return nx.betweenness_centrality(simple_graph)


def calculate_scores(G, cycles, smurfing_data, shell_chains):
    # Unpack the updated smurfing data
    suspicious_nodes, payroll_like, merchant_like, benford_violators = smurfing_data

    scores = {}
    node_patterns = {}
    node_ring_map = {}
    rings = []
    ring_counter = 1

    centrality = _compute_centrality(G)

    # ---------------------------
    # CYCLE RINGS
    # ---------------------------
    for cycle in cycles:
        ring_id = f"RING_{ring_counter:03}"
        ring_counter += 1
        cycle_length = len(cycle)

        for node in cycle:
            scores[node] = scores.get(node, 0) + 60  # Bumped to 60 to pass threshold
            node_patterns.setdefault(node, []).append(f"cycle_length_{cycle_length}")
            node_ring_map[node] = ring_id

        rings.append({
            "ring_id": ring_id,
            "member_accounts": cycle,
            "pattern_type": "cycle",
            "risk_score": 90.0
        })

    # ---------------------------
    # SHELL CHAINS → RINGS
    # ---------------------------
    for chain in shell_chains:
        ring_id = f"RING_{ring_counter:03}"
        ring_counter += 1
        start, mid, end = chain

        scores[mid] = scores.get(mid, 0) + 50  # Bumped to 50
        node_patterns.setdefault(mid, []).append("layered_shell_chain")

        for node in chain:
            node_ring_map[node] = ring_id

        rings.append({
            "ring_id": ring_id,
            "member_accounts": chain,
            "pattern_type": "layered_shell",
            "risk_score": 70.0
        })

    # ---------------------------
    # SMURFING RINGS
    # ---------------------------
    for node in suspicious_nodes:
        ring_id = f"RING_{ring_counter:03}"
        ring_counter += 1
        
        scores[node] = scores.get(node, 0) + 60 # Bumped to 60
        node_patterns.setdefault(node, []).append("smurfing_pattern")
        node_ring_map[node] = ring_id
        
        neighbors = list(G.predecessors(node)) + list(G.successors(node))
        member_accounts = list(set([node] + neighbors))

        rings.append({
            "ring_id": ring_id,
            "member_accounts": member_accounts,
            "pattern_type": "smurfing",
            "risk_score": 85.0
        })

    # ---------------------------
    # BENFORD'S LAW USP BOOST
    # ---------------------------
    for node in benford_violators:
        scores[node] = scores.get(node, 0) + 30
        node_patterns.setdefault(node, []).append("benfords_law_violation")

    # ---------------------------
    # CENTRALITY BOOST
    # ---------------------------
    for node in scores:
        scores[node] += centrality.get(node, 0) * 10

    # ---------------------------
    # PAYROLL & MERCHANT PENALTY
    # ---------------------------
    for node in payroll_like:
        scores[node] = max(0, scores.get(node, 0) - 50)
        node_patterns.setdefault(node, []).append("payroll_like")

    for node in merchant_like:
        scores[node] = max(0, scores.get(node, 0) - 50)
        node_patterns.setdefault(node, []).append("merchant_like")

    return scores, rings, node_patterns, node_ring_map