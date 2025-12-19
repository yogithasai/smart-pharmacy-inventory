import pickle
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder

# Load trained NLP model
with open("services/nlp_model.pkl", "rb") as f:
    vectorizer, model = pickle.load(f)


def chatbot_response(message: str):
    msg = message.lower()
    intent = model.predict(vectorizer.transform([msg]))[0]

    # ----- INVENTORY -----
    if intent == "inventory":
        inventory = get_inventory()
        for item in inventory:
            if item["Drug_Name"] in msg:
                return {
                    "type": "text",
                    "response": f"Current stock of {item['Drug_Name']} is {item['Current_Stock']} units."
                }
        return {
            "type": "table",
            "response": inventory[:5]
        }

    # ----- EXPIRY -----
    if intent == "expiry":
        expiry = get_expiry_alerts()
        return {
            "type": "table",
            "response": expiry[:5]
        }

    # ----- REORDER -----
    if intent == "reorder":
        reorder = get_reorder()
        if not reorder:
            return {
                "type": "text",
                "response": "No medicines need reordering currently."
            }
        return {
            "type": "table",
            "response": reorder[:5]
        }

    # ----- LOSS -----
    if intent == "loss":
        expiry = get_expiry_alerts()
        total_loss = sum(item["Potential_Loss"] for item in expiry)
        return {
            "type": "text",
            "response": f"Estimated expiry-related loss is ₹{int(total_loss)}."
        }

    return {
        "type": "text",
        "response": "I can help with inventory, expiry, reorder, and loss queries."
    }
