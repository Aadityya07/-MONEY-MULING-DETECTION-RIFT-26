export const transformGraphData = (graphData) => {
    if (!graphData || !graphData.nodes || !graphData.edges) return [];

    const elements = [];

    // Transform Nodes
    graphData.nodes.forEach(node => {
        elements.push({
            data: {
                id: node.id,
                label: node.label,
                suspicion_score: node.suspicion_score || 0,
                is_suspicious: node.is_suspicious || false,
                is_whitelisted: node.is_whitelisted || false,
                ring_id: node.ring_id || null,
                detected_patterns: node.detected_patterns || [],
                total_transactions: node.total_transactions || 0,
                total_sent: node.total_sent || 0,
                total_received: node.total_received || 0
            }
        });
    });

    // Transform Edges
    graphData.edges.forEach(edge => {
        elements.push({
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                amount: edge.amount,
                timestamp: edge.timestamp
            }
        });
    });

    return elements;
};