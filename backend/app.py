from flask import Flask, jsonify, request
from flask_cors import CORS

# ---------- CREATE APP ----------
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

# ================= DASHBOARD =================
@app.route("/dashboard", methods=["GET"])
def dashboard():
    inventory = get_inventory()
    expiry = get_expiry_alerts()
    reorder = get_reorder()

    total_medicines = len(inventory)
    low_stock = len(reorder)
    expiring_soon = len(expiry)

    # Simple revenue estimate
    revenue = sum(
        item.get("Current_Stock", 0) * 10 for item in inventory
    )

    return jsonify({
        "total": total_medicines,
        "low_stock": low_stock,
        "expiring": expiring_soon,
        "revenue": int(revenue)
    })

# ================= INVENTORY =================
@app.route("/inventory")
def inventory():
    return jsonify(get_inventory())

# ================= EXPIRY =================
@app.route("/expiry")
def expiry():
    return jsonify(get_expiry_alerts())

# ================= FORECAST =================
@app.route("/forecast")
def forecast():
    return jsonify(get_forecast())

# ================= REORDER =================
@app.route("/reorder")
def reorder():
    return jsonify(get_reorder())

# ================= CHATBOT =================
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"answer": "Please ask a valid pharmacy-related question."})

    result = chatbot_response(question)

    # TEXT RESPONSE
    if result["type"] == "text":
        return jsonify({"answer": result["response"]})

    # TABLE RESPONSE → convert to readable text
    if result["type"] == "table":
        rows = result["response"]

        if not rows:
            return jsonify({"answer": "No relevant data found."})

        # INVENTORY TABLE
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

        # EXPIRY TABLE
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

        # REORDER TABLE
        if "Reorder_Quantity" in rows[0]:
            meds = ", ".join(r["Drug_Name"] for r in rows[:5])
            return jsonify({
                "answer": f"The following medicines require reordering: {meds}."
            })

    return jsonify({
        "answer": "I can help with inventory, expiry, reorder, and loss-related queries."
    })

@app.route("/order", methods=["POST"])
def place_order():
    data = request.get_json()
    drug = data.get("medicine")

    if not drug:
        return jsonify({"error": "Medicine name required"}), 400

    # get inventory
    inventory = get_inventory()

    for item in inventory:
        if item["Drug_Name"].lower() == drug.lower():
            # simulate reorder
            item["Current_Stock"] += 100  # assume supplier delivers 100 units
            break

    return jsonify({
        "success": True,
        "message": f"Order placed successfully for {drug}"
    })


# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
