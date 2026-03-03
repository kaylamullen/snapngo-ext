from flask import Flask, request, jsonify
import pymysql
import os

app = Flask(__name__)

AUTH_TOKEN = "snapngodasherlocationelakayla2026"

def get_connection():
    # PyMySQL returns connections similar to mysql.connector but
    # we need to specify 'db' instead of 'database'.
    return pymysql.connect(
        host="localhost",
        user="root",
        password="dqsjgk34",
        db="snapngo_db",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False,
        charset="utf8mb4"
    )

@app.post("/location")
def location():
    auth_header = request.headers.get("Authorization")
    if not auth_header or auth_header != f"Bearer {AUTH_TOKEN}":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    participant_id = data.get("participant_id")  # ✅ was "id"
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    timestamp = data.get("timestamp")

    if not all([participant_id, latitude, longitude, timestamp]):
        return jsonify({"error": "Missing required fields"}), 400

    print("Received location:", latitude, longitude)

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users
            SET latitude = %s, longitude = %s, loc_time = %s
            WHERE id = %s;
        """, (latitude, longitude, timestamp, participant_id))  
        conn.commit()
        print(f"Rows affected: {cursor.rowcount}")
        cursor.close()
        conn.close()
        print(f"Updated location for participant {participant_id} in database.")
    except Exception as e:
        print("Database error:", e)
        return jsonify({"error": "Database error"}), 500

    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    # port 5000 is often reserved by AirPlay/ControlCenter on macOS
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)