from flask import Flask, request, jsonify

# Create Flask app
app = Flask(__name__)

# 🔐 AUTH TOKEN (put your secret here)
AUTH_TOKEN = "snapngodasherlocationelakayla2026"


# 📍 Location Route
@app.post("/location")
def location():

    # 1️⃣ Read Authorization header
    auth_header = request.headers.get("Authorization")

    # 2️⃣ Check if header matches expected token
    if not auth_header or auth_header != f"Bearer {AUTH_TOKEN}":
        return jsonify({"error": "Unauthorized"}), 401

    # 3️⃣ If authorized, read JSON body
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")

    print("Received location:", latitude, longitude)

    # 4️⃣ Return success
    return jsonify({"status": "ok"}), 200


# 🚀 Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2700, debug=True)
