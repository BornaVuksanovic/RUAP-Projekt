from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "RandomForest_best_model.pkl"), "rb") as f:
    model = pickle.load(f)

with open(os.path.join(BASE_DIR, "club_map.json")) as f:
    club_map = json.load(f)
with open(os.path.join(BASE_DIR, "league_map.json")) as f:
    league_map = json.load(f)
with open(os.path.join(BASE_DIR, "nation_map.json")) as f:
    nation_map = json.load(f)
with open(os.path.join(BASE_DIR, "league_clubs.json")) as f:
    league_clubs = json.load(f)

@app.route("/leagues", methods=["GET"])
def get_leagues():
    return jsonify(league_map)

@app.route("/clubs", methods=["GET"])
def get_clubs():
    return jsonify(club_map)

@app.route("/nations", methods=["GET"])
def get_nations():
    return jsonify(nation_map)



@app.route("/league_clubs/<league_id>", methods=["GET"])
def get_league_clubs(league_id):
    league_id = str(league_id)
    if league_id in league_clubs:
        clubs_in_league = {cid: club_map[str(cid)] for cid in league_clubs[league_id]}
        return jsonify(clubs_in_league)
    return jsonify({})

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

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

