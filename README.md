# RIFT Forensics — Money Muling Detection Platform

RIFT Forensics is a full-stack fraud analysis system that detects suspicious money-flow behavior from transaction CSV files.  
It combines graph analytics and pattern detection to identify:

- **Fraud rings (cycles)**
- **Smurfing / mule aggregation patterns**
- **Layered shell chains**
- **Benford’s Law anomalies**

The backend exposes an analysis API, and the frontend provides an interactive forensic dashboard with graph visualization and ring summaries.

## Project Structure

- Backend API: [backend/app.py](backend/app.py)
- Analysis route: [backend/routes/analyze.py](backend/routes/analyze.py)
- Detection services:
  - [backend/services/cycle_detector.py](backend/services/cycle_detector.py)
  - [backend/services/smurfing_detector.py](backend/services/smurfing_detector.py)
  - [backend/services/shell_detector.py](backend/services/shell_detector.py)
  - [backend/services/suspicion_engine.py](backend/services/suspicion_engine.py)
  - [backend/services/json_formatter.py](backend/services/json_formatter.py)
- Frontend app entry:
  - [frontend/src/main.jsx](frontend/src/main.jsx)
  - [frontend/src/App.jsx](frontend/src/App.jsx)

## Core Features

- Upload transaction CSV datasets from the frontend
- Strict CSV validation and timestamp parsing
- Directed graph construction from transaction flow
- Multi-pattern fraud detection:
  - Cycle ring detection
  - Smurfing behavior detection
  - Shell-chain identification
  - Benford deviation scoring
- Suspicion scoring with centrality-based weighting
- JSON export of analysis results
- Interactive Cytoscape-based network graph and ring summary dashboard

## Input CSV Format

Expected columns (exact order):

1. `transaction_id`
2. `sender_id`
3. `receiver_id`
4. `amount`
5. `timestamp`

Validation logic is implemented in [backend/utils/validators.py](backend/utils/validators.py).

## API

### `POST /analyze`

Accepts `multipart/form-data` with key:

- `file`: CSV file

Implemented in [`analyze_transactions`](backend/routes/analyze.py).

Returns JSON containing:

- `suspicious_accounts`
- `fraud_rings`
- `summary`
- `graph_data`

---

## Installation & Run Guide

> Run backend and frontend in separate terminals.

### 1) Windows (PowerShell)

#### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

#### Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend runs at `http://127.0.0.1:5000`.

#### Frontend setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

---

### 2) macOS (zsh/bash)

#### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

#### Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

### 3) Linux (bash)

#### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

#### Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

1. Open the frontend URL shown by Vite.
2. Upload a valid transaction `.csv` file.
3. Wait for backend analysis to complete.
4. Review:
   - Metrics cards
   - Graph topology view
   - Fraud ring table
5. Export JSON report from dashboard.

## Tech Stack

### Backend

- Flask + Flask-CORS
- pandas
- networkx
- numpy

Dependencies: [backend/requirements.txt](backend/requirements.txt)

### Frontend

- React + Vite
- Tailwind CSS
- axios
- react-cytoscapejs + cytoscape
- lucide-react

Dependencies: [frontend/package.json](frontend/package.json)

## Notes

- Frontend now uses `VITE_API_BASE_URL` for API requests (falls back to relative `/analyze` if unset).
- Set `VITE_API_BASE_URL` in frontend deployment to your backend origin (example: `https://your-backend.onrender.com`).
- Backend CORS allowlist is configurable via `FRONTEND_ORIGIN` (single) or `FRONTEND_ORIGINS` (comma-separated).
- On Render backend, set `FRONTEND_ORIGIN` to your frontend URL (example: `https://your-frontend.onrender.com`).
- For large CSVs, run backend with a higher worker timeout (Render start command example): `gunicorn "app:create_app()" --bind 0.0.0.0:$PORT --timeout 180 --workers 1 --threads 4`.
- Optional performance env vars for cycle search on large datasets: `MAX_CYCLES=1000`, `MAX_CYCLE_EXPANSIONS=250000`, `MAX_CYCLE_PATH_LEN=5`.
- Ensure backend is running before uploading a CSV.
- For production, consider:
  - stricter error handling and logging
  - containerized deployment
