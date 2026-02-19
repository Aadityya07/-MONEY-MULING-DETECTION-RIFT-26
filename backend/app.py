from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io
import time

# Import our new modularized service
from services.graph_analyzer import build_graph, detect_fraud

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_csv():
    start_time = time.time()
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.endswith('.csv'):
        try:
            # Read CSV into memory
            stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
            df = pd.read_csv(stream)
            
            # 1. Build the graph
            G = build_graph(df)
            
            # 2. Run detection and get exact JSON structure
            results = detect_fraud(G, start_time)
            
            return jsonify(results), 200
            
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except Exception as e:
            return jsonify({"error": f"Server error: {str(e)}"}), 500
            
    return jsonify({"error": "Invalid file type. Only CSV allowed."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)