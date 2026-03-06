from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Store latest GPS data
latest_data = {
    "lat": 0,
    "lon": 0
}

# 🔹 Route 1: Dashboard (Map Page)
@app.route("/")
def home():
    return render_template("gps.html")

# 🔹 Route 2: API for live GPS (NO MORE 404)
@app.route("/api/gps")
def get_gps():
    return jsonify(latest_data)

# 🔹 Route 3: ESP32 sends GPS here
@app.route("/update", methods=["GET"])
def update():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if lat and lon:
        latest_data["lat"] = lat
        latest_data["lon"] = lon
        print(f"New GPS Received: {lat}, {lon}")

    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)