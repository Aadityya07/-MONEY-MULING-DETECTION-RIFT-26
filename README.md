RIFT Forensics Engine
Track: Graph Theory / Financial Crime Detection Track
Challenge: Money Muling Detection Challenge

Live Links
Live Web Application: https://money-muling-detection-rift-26-1-avbo.onrender.com/

Demo Video: https://www.linkedin.com/posts/yash-tongale-551b01297_rifthackathon-moneymulingdetection-financialcrime-activity-7430423429234966528-XNxn?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEfjfc0BRDYo2xGY4dFPoNq38UJjpxrAqVs

1. Project Overview
The RIFT Forensics Engine is a high-performance, graph-theoretic web application designed to ingest raw financial transaction logs and expose sophisticated money muling networks. It bypasses traditional relational database limitations by reconstructing the latent topologies of fraud, specifically targeting circular routing, temporal smurfing, and layered shell networks, while actively mitigating false positives from legitimate high-volume accounts.

2. Tech Stack
Frontend: React.js, Tailwind CSS

Graph Visualization: Cytoscape.js (Bifurcated rendering engine for 10k+ scalability)

Backend: Python, Flask, Flask-CORS

Graph Processing Core: NetworkX, Pandas, NumPy

Deployment: Render (Backend), Vercel/Netlify (Frontend)

3. System Architecture
The system utilizes a stateless, event-driven architecture to ensure sub-second processing and rendering.


Complete Data Flow Diagram
Plaintext
USER                    FRONTEND                 BACKEND
 |                          |                       |
 |-- Uploads CSV ---------->|                       |
 |                          |-- Validate format --->|
 |                          |                       |
 |                          |-- POST /analyze ----->|
 |                          |   (multipart/form)    |
 |                          |                       |-- Parse CSV (Pandas)
 |<-- Loading Screen -------|                       |-- Build Graph (NetworkX)
 |                          |                       |-- Module A: Detect Cycles
 |                          |                       |-- Module B: Detect Smurfing
 |                          |                       |-- Module C: Detect Shells
 |                          |                       |-- Apply False Positive Filters
 |                          |                       |-- Calculate Suspicion Scores
 |                          |                       |-- Assign Ring IDs
 |                          |                       |-- Serialize JSON Output
 |                          |                       |
 |                          |<-- JSON response -----|
 |                          |                       |
 |-- View Dashboard <-------|-- Render Cytoscape    |
 |                          |-- Render Table        |
 |                          |-- Render Metrics      |
 |                          |                       |
 |-- Hover Node ----------->|                       |
 |<-- Display Tooltip ------|                       |
 |                          |                       |
 |-- Click Export JSON ---->|                       |
 |<-- Download .json file --|                       |


4. Algorithm Approach & Complexity Analysis
Module A: Depth-Limited Cycle Detection (Circular Routing)
Traditional algorithms for finding all cycles (like Johnson's) possess a time complexity of O((V+E)(C+1)), which is computationally unviable for dense financial graphs. We implemented a customized Depth-Limited DFS strictly constrained to a maximum recursion depth of 5 (matching the 3-5 hop problem constraint).

Optimization: Canonical pruning ensures a cycle is only recorded if the starting node has the minimum lexicographical ID in the path, preventing redundant permutations.

Complexity: O(V * d^k) where d is the average out-degree and k is the maximum depth (5). On sparse financial graphs, this executes in sub-second timeframes.

Module B: Temporal Motif Mining (Smurfing)
Smurfing is identified through temporal flow imbalances. The algorithm filters for high-degree hubs (In/Out Degree >= 10). It then applies a 72-hour sliding window across the node's edge timestamps.

Optimization: Evaluates the Flow Imbalance Ratio within the temporal window. If inbound volume matches outbound dispersion within 72 hours, it is flagged as an aggregator.

Complexity: O(E log(d_max)) per candidate node, dominated by the temporal sorting of edges.

Module C: Layered Shell Scanner (Constrained Pathfinding)
Detects paths of 3+ hops where intermediate nodes act as passive conduits.

Optimization: Pre-calculates global degree centrality to identify nodes with a total degree <= 3, isolating the search space exclusively to paths passing through these restricted nodes.

5. Suspicion Score Methodology & Innovation
The engine generates a 0-100 Suspicion Score utilizing a weighted, centrality-boosted formula combined with aggressive false-positive reduction heuristics.

Base Scoring Weights:

Cycle Participation: +60 points

Temporal Smurfing Pattern: +60 points

Shell Intermediary Role: +50 points

Innovation & Heuristics (Score Modifiers):

Betweenness Centrality Boost: Adds up to +10 points based on the node's mathematical importance as a bridge between separate illicit clusters.

Benford's Law Forensic Module (USP): Analyzes the leading digits of outbound smurfing amounts against Benford's logarithmic distribution. High Mean Absolute Error indicates fabricated transaction amounts, triggering an additional +30 point penalty.

Payroll Trap Filter (False Positive Control): Evaluates outbound flow variance for fan-out hubs. Regular disbursements trigger a -50 point deduction, classifying the node as a legitimate payroll account.

Merchant Trap Filter (False Positive Control): Evaluates flow symmetry for fan-in hubs. High fan-in without subsequent rapid fan-out triggers a -50 point deduction, classifying the node as a legitimate merchant.

6. Installation & Setup
Backend Setup
Navigate to the backend directory: cd backend

Create a virtual environment: python -m venv venv

Activate the environment:

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Install dependencies: pip install -r requirements.txt

Start the server: python app.py (Runs on port 5000)

Frontend Setup
Navigate to the frontend directory: cd frontend

Install dependencies: npm install

Start the development server: npm run dev

Access the UI at http://localhost:5173/

7. Usage Instructions
Access the live URL or local instance.

Drag and drop a valid transaction_log.csv file into the upload zone. Ensure headers match the exact specifications: transaction_id, sender_id, receiver_id, amount, timestamp.

The engine will process the topology and redirect to the Dashboard.

Interact with the graph: Zoom, pan, and click on nodes (highlighted in red) to view granular forensic details and associated Ring IDs.

Click "Export JSON" in the top right corner to download the compliance-ready schema required for the hackathon evaluation.

8. Known Limitations
Hardware Memory Limits on Massive Graphs: The Cytoscape frontend implements a bifurcated rendering engine (shifting to a grid layout with disabled physics for datasets > 2,000 nodes). However, attempting to render graphs exceeding 50,000 raw nodes in a browser may cause client-side memory exhaustion. Pagination or server-side graph tiling would be required for extreme scale.

Temporal Parsing Assumptions: The backend utilizes Pandas mixed-format parsing. Highly irregular or corrupted timestamp strings may default to Pandas NaT and bypass the 72-hour sliding window check.

9. Team Members
[Your Name] - Backend Algorithms & Graph Architecture

[Team Member 2 Name] - Frontend Integration & Visualization

[Team Member 3 Name] - Data Preprocessing & Validation