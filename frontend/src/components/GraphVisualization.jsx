import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { ZoomIn, ZoomOut, RefreshCw, Filter } from 'lucide-react';
import { transformGraphData } from '../utils/graphBuilder';
import NodeDetailPanel from './NodeDetailPanel';

export default function GraphVisualization({ graphData }) {
    const containerRef = useRef(null);
    const cyRef = useRef(null);

    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const [hoverData, setHoverData] = useState(null);
    const [filterMode, setFilterMode] = useState('ALL'); // ALL, FRAUD_ONLY

    useEffect(() => {
        if (!containerRef.current || !graphData) return;

        const elements = transformGraphData(graphData);
        const nodeCount = elements.filter(e => !e.data.source).length;
        const layoutName = nodeCount > 500 ? 'grid' : 'cose';

        // Initialize Cytoscape
        const cy = cytoscape({
            container: containerRef.current,
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'font-size': '8px',
                        'color': '#ffffff',
                        'text-valign': 'bottom',
                        'text-margin-y': 4,
                        'background-color': '#1e40af', // default clean
                        'border-color': '#3b82f6',
                        'border-width': 2,
                        'width': 30,
                        'height': 30,
                        'transition-property': 'background-color, border-color, width, height, opacity',
                        'transition-duration': 200
                    }
                },
                {
                    selector: 'node[?is_suspicious]',
                    style: {
                        'background-color': '#991b1b', // dark red
                        'border-color': '#ef4444', // bright red
                        'border-width': 3,
                        'width': (ele) => {
                            const score = ele.data('suspicion_score') || 0;
                            return score >= 80 ? 50 : score >= 50 ? 40 : 35;
                        },
                        'height': (ele) => {
                            const score = ele.data('suspicion_score') || 0;
                            return score >= 80 ? 50 : score >= 50 ? 40 : 35;
                        },
                        'border-style': (ele) => ele.data('suspicion_score') >= 80 ? 'double' : 'solid'
                    }
                },
                {
                    selector: 'node[?is_whitelisted]',
                    style: {
                        'background-color': '#374151', // grey
                        'border-color': '#6b7280',
                        'shape': 'hexagon',
                        'width': 25,
                        'height': 25
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'line-color': '#334155',
                        'target-arrow-color': '#334155',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'width': 1,
                        'opacity': 0.5,
                        'transition-property': 'line-color, width, opacity',
                        'transition-duration': 200
                    }
                },
                // State classes
                {
                    selector: '.dimmed',
                    style: { 'opacity': 0.1 }
                },
                {
                    selector: '.highlighted-node',
                    style: { 'border-color': '#fbbf24', 'border-width': 4 }
                },
                {
                    selector: '.suspicious-edge',
                    style: { 'line-color': '#ef4444', 'target-arrow-color': '#ef4444', 'width': 2, 'opacity': 0.8 }
                },
                {
                    selector: '.active-ring-edge',
                    style: { 'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b', 'width': 3, 'opacity': 1.0, 'z-index': 999 }
                }
            ],
            layout: { name: layoutName, animate: true },
            minZoom: 0.1,
            maxZoom: 3,
        });

        cyRef.current = cy;

        // Apply suspicious edge coloring on load
        cy.edges().forEach(edge => {
            const sourceSus = edge.source().data('is_suspicious');
            const targetSus = edge.target().data('is_suspicious');
            if (sourceSus && targetSus) edge.addClass('suspicious-edge');
        });

        // Hover Events for Tooltip
        cy.on('mouseover', 'node', (evt) => {
            const node = evt.target;
            const pos = evt.renderedPosition; // relative to container viewport
            setHoverData({ data: node.data(), x: pos.x, y: pos.y });
        });
        cy.on('mouseout', 'node', () => setHoverData(null));

        // Click Events
        cy.on('tap', 'node', (evt) => {
            const clickedNode = evt.target;
            setSelectedNodeData(clickedNode.data());

            // Reset logic
            cy.elements().removeClass('dimmed highlighted-node');

            // Highlight direct neighbors
            clickedNode.addClass('highlighted-node');
            const neighborhood = clickedNode.neighborhood().add(clickedNode);
            cy.elements().difference(neighborhood).addClass('dimmed');
        });

        // Click background to reset
        cy.on('tap', (evt) => {
            if (evt.target === cy) {
                cy.elements().removeClass('dimmed highlighted-node');
                setSelectedNodeData(null);
            }
        });

        return () => cy.destroy();
    }, [graphData]);

    // Handle Filtering
    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;

        if (filterMode === 'FRAUD_ONLY') {
            cy.nodes().forEach(node => {
                if (!node.data('is_suspicious')) {
                    node.hide();
                    node.connectedEdges().hide();
                }
            });
            cy.layout({ name: 'cose', animate: true }).run();
        } else {
            cy.elements().show();
            cy.layout({ name: 'cose', animate: true }).run();
        }
    }, [filterMode]);

    // Controls
    const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
    const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
    const handleReset = () => {
        cyRef.current?.fit();
        cyRef.current?.elements().removeClass('dimmed highlighted-node active-ring-edge');
        setSelectedNodeData(null);
    };

    const highlightRing = (ringId) => {
        if (!cyRef.current || !ringId) return;
        const cy = cyRef.current;
        cy.elements().removeClass('dimmed highlighted-node active-ring-edge');

        const ringNodes = cy.nodes().filter(n => n.data('ring_id') === ringId);
        if (ringNodes.length > 0) {
            ringNodes.addClass('highlighted-node');
            ringNodes.edgesWith(ringNodes).addClass('active-ring-edge');
            cy.elements().difference(ringNodes).difference(ringNodes.edgesWith(ringNodes)).addClass('dimmed');
            cy.animate({ fit: { eles: ringNodes, padding: 50 } }, { duration: 500 });
        }
    };

    return (
        <div className="relative w-full h-[600px] border border-border bg-[#0f172a] rounded-xl overflow-hidden mb-8 shadow-lg">

            {/* Controls Bar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="bg-background-card/90 backdrop-blur border border-border rounded flex shadow-md">
                    <button onClick={handleZoomIn} className="p-2 text-text-secondary hover:text-accent-clean border-r border-border" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                    <button onClick={handleZoomOut} className="p-2 text-text-secondary hover:text-accent-clean border-r border-border" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                    <button onClick={handleReset} className="p-2 text-text-secondary hover:text-accent-clean" title="Reset View"><RefreshCw className="w-4 h-4" /></button>
                </div>

                <div className="bg-background-card/90 backdrop-blur border border-border rounded flex shadow-md font-mono text-xs overflow-hidden">
                    <button
                        onClick={() => setFilterMode('ALL')}
                        className={`px-3 py-2 ${filterMode === 'ALL' ? 'bg-accent-clean/20 text-accent-clean' : 'text-text-secondary hover:bg-border'}`}
                    >
                        Show Full Network
                    </button>
                    <button
                        onClick={() => setFilterMode('FRAUD_ONLY')}
                        className={`px-3 py-2 border-l border-border ${filterMode === 'FRAUD_ONLY' ? 'bg-accent-danger/20 text-accent-danger' : 'text-text-secondary hover:bg-border'}`}
                    >
                        Fraud Rings Only
                    </button>
                </div>
            </div>

            {/* Node Count Warning */}
            {graphData?.nodes?.length > 1000 && filterMode === 'ALL' && (
                <div className="absolute top-16 left-4 z-10 bg-accent-warning/20 border border-accent-warning text-accent-warning px-3 py-2 rounded text-xs font-mono shadow-md flex items-center gap-2">
                    <Filter className="w-3 h-3" /> Large graph detected. Filter recommended for performance.
                </div>
            )}

            {/* Cytoscape Container */}
            <div ref={containerRef} className="w-full h-full" />

            {/* Floating Hover Tooltip */}
            {hoverData && (
                <div
                    className="absolute z-30 bg-[#050b14]/95 border border-border text-xs font-mono p-3 rounded shadow-xl pointer-events-none w-56 backdrop-blur-md"
                    style={{ top: hoverData.y + 15, left: hoverData.x + 15 }}
                >
                    <div className="font-bold border-b border-border pb-1 mb-2 truncate">ACC: {hoverData.data.id}</div>
                    <div className="flex justify-between"><span>Risk Score:</span> <span className={hoverData.data.suspicion_score >= 70 ? 'text-accent-danger font-bold' : 'text-accent-success font-bold'}>{hoverData.data.suspicion_score?.toFixed(1) || 0}</span></div>
                    <div className="flex justify-between"><span>Ring ID:</span> <span>{hoverData.data.ring_id || 'N/A'}</span></div>
                    <div className="flex justify-between"><span>Transactions:</span> <span>{hoverData.data.total_transactions}</span></div>
                    <div className="flex justify-between"><span>Sent:</span> <span className="text-accent-warning">₹{hoverData.data.total_sent?.toLocaleString() || 0}</span></div>
                    <div className="flex justify-between"><span>Received:</span> <span className="text-accent-clean">₹{hoverData.data.total_received?.toLocaleString() || 0}</span></div>
                    {hoverData.data.detected_patterns?.length > 0 && (
                        <div className="mt-2 text-[10px] text-accent-danger uppercase">{hoverData.data.detected_patterns.join(', ')}</div>
                    )}
                </div>
            )}

            {/* Slide-out Detail Panel */}
            <NodeDetailPanel
                node={selectedNodeData}
                onClose={() => {
                    setSelectedNodeData(null);
                    cyRef.current?.elements().removeClass('dimmed highlighted-node active-ring-edge');
                }}
                onRingClick={highlightRing}
            />
        </div>
    );
}