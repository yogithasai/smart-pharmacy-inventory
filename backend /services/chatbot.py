from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder


def chatbot_response(message: str):
    msg = message.lower()

    # ----- INVENTORY QUERIES -----
    if "stock" in msg:
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

    # ----- EXPIRY QUERIES -----
    if "expire" in msg or "expiry" in msg:
        expiry = get_expiry_alerts()

        if not expiry:
            return {
                "type": "text",
                "response": "No medicines are expiring soon."
            }

        return {
            "type": "table",
            "response": expiry[:5]
        }

    # ----- REORDER QUERIES -----
    if "reorder" in msg or "order" in msg:
        reorder = get_reorder()

        if not reorder:
            return {
                "type": "text",
                "response": "No medicines need reordering at the moment."
            }

        return {
            "type": "table",
            "response": reorder[:5]
        }

    # ----- LOSS QUERIES -----
    if "loss" in msg or "waste" in msg:
        expiry = get_expiry_alerts()
        total_loss = sum(item["Potential_Loss"] for item in expiry)

        return {
            "type": "text",
            "response": f"Estimated potential loss due to expiry is ₹{int(total_loss)}."
        }

    # ----- FALLBACK -----
    return {
        "type": "text",
        "response": "I can help with stock, expiry, reorder, and loss-related queries."
    }
