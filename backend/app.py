from flask import Flask, jsonify, request
from flask_cors import CORS


# ---------- CREATE APP FIRST ----------
app = Flask(__name__)
CORS(app)


# ---------- IMPORT SERVICES ----------
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_forecast, get_reorder
from services.chatbot import chatbot_response


# ---------- ROUTES ----------
@app.route("/")
def home():
    return {"status": "PharmaSense AI Backend Running"}


@app.route("/inventory")
def inventory():
    return jsonify(get_inventory())


@app.route("/expiry-alerts")
def expiry_alerts():
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
    message = data.get("message", "")
    return jsonify(chatbot_response(message))


# ---------- RUN SERVER ----------
if __name__ == "__main__":
    app.run(debug=True)
