import os
import pickle
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder

# ---------------- PATH FIX (CRITICAL) ----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "services", "nlp_model.pkl")

# ---------------- LOAD NLP MODEL ----------------
with open(MODEL_PATH, "rb") as f:
    vectorizer, model = pickle.load(f)

print("✅ NLP model loaded successfully")

# ---------------- CHATBOT FUNCTION ----------------
def chatbot_response(message: str):
    msg = message.lower().strip()

    # Predict intent
    intent = model.predict(vectorizer.transform([msg]))[0]

    # ---------------- INVENTORY ----------------
    if intent == "inventory":
        inventory = get_inventory()  # realtime fetch

        for item in inventory:
            if item["Drug_Name"].lower() in msg:
                return {
                    "type": "text",
                    "response": f"Current stock of {item['Drug_Name']} is {item['Current_Stock']} units."
                }

        return {
            "type": "table",
            "response": inventory[:5]
        }

    # ---------------- EXPIRY ----------------
    if intent == "expiry":
        expiry = get_expiry_alerts()  # realtime fetch
        return {
            "type": "table",
            "response": expiry[:5]
        }

    # ---------------- REORDER ----------------
    if intent == "reorder":
        reorder = get_reorder()  # realtime fetch

        if not reorder:
            return {
                "type": "text",
                "response": "No medicines need reordering currently."
            }

        return {
            "type": "table",
            "response": reorder[:5]
        }

    # ---------------- LOSS ----------------
    if intent == "loss":
        expiry = get_expiry_alerts()
        total_loss = sum(item.get("Potential_Loss", 0) for item in expiry)

        return {
            "type": "text",
            "response": f"Estimated expiry-related loss is ₹{int(total_loss)}."
        }

    # ---------------- FALLBACK ----------------
    return {
        "type": "text",
        "response": "I can help with inventory, expiry, reorder, and loss queries."
    }
