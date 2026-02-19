import networkx as nx

def build_graph(df):
    G = nx.MultiDiGraph()

    for _, row in df.iterrows():
        G.add_edge(
            row["sender_id"],
            row["receiver_id"],
            amount=row["amount"],
            timestamp=row["timestamp"],
            transaction_id=row["transaction_id"]
        )

    return G
