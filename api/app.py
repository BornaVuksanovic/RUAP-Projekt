from flask import Flask, request, jsonify
import pickle
import numpy as np
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open("RandomForest_best_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("club_map.json") as f:
    club_map = json.load(f)
with open("league_map.json") as f:
    league_map = json.load(f)
with open("nation_map.json") as f:
    nation_map = json.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    
    features = [
        data['age'], data['league_id'], data['club_team_id'],
        data['nationality_id'], data['preferred_foot'], data['club_jersey_number'],
        data['Goalkeeper'], data['Defense'], data['Midfield'], data['Attack']
    ]
    
    X = np.array(features).reshape(1, -1)
    
   
    y_pred_log = model.predict(X)
    y_pred = np.expm1(y_pred_log)  
    
    return jsonify({"predicted_value_eur": round(float(y_pred[0]), 2)})

if __name__ == "__main__":
    app.run(debug=True)
