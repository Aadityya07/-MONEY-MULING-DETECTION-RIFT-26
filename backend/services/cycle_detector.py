def detect_cycles(G):
    cycles = []
    nodes = list(G.nodes())

    for start in nodes:
        stack = [(start, [start])]

        while stack:
            current, path = stack.pop()

            if len(path) > 5:
                continue

            for neighbor in G.successors(current):

                if neighbor == start and 3 <= len(path) <= 5:
                    if start == min(path):   # canonical pruning
                        cycles.append(path.copy())

                elif neighbor not in path:
                    stack.append((neighbor, path + [neighbor]))

    return cycles
