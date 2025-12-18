from flask import Flask, jsonify, request
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_forecast, get_reorder
from services.chatbot import chatbot_response

app = Flask(__name__)

@app.route("/inventory")
def inventory():
    return jsonify(get_inventory())

@app.route("/expiry-alerts")
def expiry():
    return jsonify(get_expiry_alerts())

@app.route("/forecast")
def forecast():
    return jsonify(get_forecast())

@app.route("/reorder")
def reorder():
    return jsonify(get_reorder())

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", "")
    return chatbot_response(user_message)

@app.route("/")
def home():
    return {"status": "PharmaSense AI Backend Running"}


if __name__ == "__main__":
    app.run(debug=True)
