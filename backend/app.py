from flask import Flask, jsonify, request
from flask_cors import CORS

# ---------- CREATE APP ----------
app = Flask(__name__)
CORS(app)

# ---------- IMPORT SERVICES ----------
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_forecast, get_reorder
from services.chatbot import chatbot_response   # ✅ ONLY THIS

# ---------- ROUTES ----------
@app.route("/")
def home():
    return {"status": "PharmaSense AI Backend Running"}

@app.route("/dashboard-stats")
def dashboard_stats():
    return jsonify(get_dashboard_stats())


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
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"answer": "Please ask a valid pharmacy-related question."})

    # Call NLP chatbot service
    result = chatbot_response(question)

    # ALWAYS return text to frontend
    if result["type"] == "text":
        return jsonify({"answer": result["response"]})

    if result["type"] == "table":
        rows = result["response"]

        if not rows:
            return jsonify({"answer": "No relevant data found."})

        # INVENTORY
        if "Current_Stock" in rows[0]:
            total = sum(r["Current_Stock"] for r in rows)
            examples = ", ".join(
                f"{r['Drug_Name']} ({r['Current_Stock']} units)"
                for r in rows[:5]
            )
            return jsonify({
                "answer": (
                    f"The current inventory contains {total} units in total. "
                    f"Some available medicines include {examples}."
                )
            })

        # EXPIRY
        if "Days_To_Expire" in rows[0]:
            soon = [r for r in rows if r["Days_To_Expire"] <= 30]
            if not soon:
                return jsonify({
                    "answer": "No medicines are expiring within the next 30 days."
                })
            example = ", ".join(
                f"{r['Drug_Name']} ({r['Days_To_Expire']} days)"
                for r in soon[:5]
            )
            return jsonify({
                "answer": (
                    f"{len(soon)} medicines are expiring soon. "
                    f"Examples include {example}."
                )
            })

        # REORDER
        if "Reorder_Quantity" in rows[0]:
            meds = ", ".join(r["Drug_Name"] for r in rows[:5])
            return jsonify({
                "answer": f"The following medicines require reordering: {meds}."
            })

    return jsonify({
        "answer": "I can help with inventory, expiry, reorder, and loss-related queries."
    })



# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
