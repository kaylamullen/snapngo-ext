from flask import Flask, request
import connections  # to access your database

app = Flask(__name__)

@app.route('/location', methods=['POST'])
def location():
    data = request.json
    # Extract: user_id, latitude, longitude, timestamp, etc.
    # Store in database via connections module
    return {"status": "success"}

if __name__ == '__main__':
    app.run(port=5000)