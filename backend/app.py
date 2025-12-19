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
    question = data.get("question", "").lower()

    if not question:
        return jsonify({"answer": "Please ask a valid question."})

    # NLP intent
    X = vectorizer.transform([question])
    intent = model.predict(X)[0]

    # ---------------- ENTITY EXTRACTION ----------------
    drug_list = purchases["Drug_Name"].unique().tolist()
    detected_drug = None

    for drug in drug_list:
        if drug in question:
            detected_drug = drug
            break

    # ---------------- INTENT LOGIC ----------------
    if intent == "inventory":
        if detected_drug:
            stock = purchases[purchases["Drug_Name"] == detected_drug]["Quantity"].sum()
            answer = f"Current stock of {detected_drug} is {int(stock)} units."
        else:
            total_stock = purchases["Quantity"].sum()
            answer = f"Total inventory stock is {int(total_stock)} units."

    elif intent == "expiry":
        if detected_drug:
            row = purchases[purchases["Drug_Name"] == detected_drug].sort_values("Days_To_Expire")
            if not row.empty:
                days = int(row.iloc[0]["Days_To_Expire"])
                answer = f"{detected_drug} will expire in {days} days."
            else:
                answer = f"No expiry data found for {detected_drug}."
        else:
            expiring = purchases[purchases["Days_To_Expire"] <= 30]
            answer = f"{len(expiring)} medicines are expiring within 30 days."

    elif intent == "reorder":
        low_stock = purchases[purchases["Quantity"] < 20]
        if detected_drug:
            stock = purchases[purchases["Drug_Name"] == detected_drug]["Quantity"].sum()
            answer = f"{detected_drug} current stock is {stock} units."
        else:
            meds = low_stock["Drug_Name"].unique().tolist()
            answer = "Medicines to reorder: " + ", ".join(meds[:8])

    elif intent == "loss":
        expired = purchases[purchases["Days_To_Expire"] <= 0]
        loss = (expired["Quantity"] * expired["Price"]).sum()
        answer = f"Estimated loss due to expired medicines is ₹{int(loss)}."

    else:
        answer = "I can answer inventory-related questions only."

    return jsonify({"answer": answer})



# ---------- RUN SERVER ----------
if __name__ == "__main__":
    app.run(debug=True)
