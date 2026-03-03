from flask import Flask, request, jsonify
import mysql.connector
import os

# Create Flask app
app = Flask(__name__)

# AUTH TOKEN (put your secret here)
AUTH_TOKEN = "snapngodasherlocationelakayla2026"

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="dqsjgk34",
        database="snapngo_db"
    )
    
        

# Location Route
@app.post("/location")
def location():

    # Read Authorization header
    auth_header = request.headers.get("Authorization")

    # Check if header matches expected token
    if not auth_header or auth_header != f"Bearer {AUTH_TOKEN}":
        return jsonify({"error": "Unauthorized"}), 401

    # If authorized, read JSON body
    data = request.get_json()
    participant_id = data.get("id")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    timestamp = data.get("timestamp")
    
    if not all([participant_id, latitude, longitude, timestamp]):
        return jsonify({"error": "Missing required fields"}), 400

    print("Received location:", latitude, longitude)
    
    # now update database
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (latitude, longiture, timestamp)
            WHERE id = %s
            VALUES (%s, %s, %s);
        """, (participant_id, latitude, longitude, timestamp))
        conn.commit()
        
        print(f"Updated location for participant {participant_id} in database.")
        
    except Exception as e:
        print("Database error:", e)
        return jsonify({"error": "Database error"}), 500
    
    

    # Return success
    return jsonify({"status": "ok"}), 200


# Start server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2700, debug=True)
