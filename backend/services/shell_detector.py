def detect_shells(G, cycles):
    shell_chains = []
    cycle_nodes = set()

    # Collect cycle nodes
    for cycle in cycles:
        for node in cycle:
            cycle_nodes.add(node)

    degree_map = {n: G.in_degree(n) + G.out_degree(n) for n in G.nodes()}

    # Low-degree nodes (potential shells)
    candidates = [
        n for n, d in degree_map.items()
        if d <= 3 and n not in cycle_nodes
    ]

    # Detect 3-hop chains: start -> shell -> end
    for start in G.nodes():
        for mid in G.successors(start):
            if mid in candidates:
                for end in G.successors(mid):
                    if end != start:
                        shell_chains.append(tuple([start, mid, end]))

    # 🔥 Deduplicate chains
    unique_chains = list(set(shell_chains))

    # Convert back to list format
    return [list(chain) for chain in unique_chains]