import os


def detect_cycles(G):
    max_path_len = int(os.getenv("MAX_CYCLE_PATH_LEN", "5"))
    max_cycles = int(os.getenv("MAX_CYCLES", "1000"))
    max_expansions = int(os.getenv("MAX_CYCLE_EXPANSIONS", "250000"))

    cycles = []
    nodes = list(G.nodes())
    expansions = 0

    for start in nodes:
        if len(cycles) >= max_cycles or expansions >= max_expansions:
            break

        stack = [(start, [start])]

        while stack:
            if len(cycles) >= max_cycles or expansions >= max_expansions:
                break

            current, path = stack.pop()

            if len(path) > max_path_len:
                continue

            for neighbor in G.successors(current):
                expansions += 1
                if expansions >= max_expansions:
                    break

                if neighbor == start and 3 <= len(path) <= max_path_len:
                    if start == min(path):
                        cycles.append(path.copy())
                        if len(cycles) >= max_cycles:
                            break
                elif neighbor not in path:
                    stack.append((neighbor, path + [neighbor]))

    return cycles
