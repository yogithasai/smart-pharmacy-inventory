import os
import pickle
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder

# =================================================
# PATH FIX (CRITICAL)
# =================================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "services", "nlp_model.pkl")

# =================================================
# LOAD NLP MODEL
# =================================================
with open(MODEL_PATH, "rb") as f:
    vectorizer, model = pickle.load(f)

print("✅ NLP model loaded successfully")

# =================================================
# CHATBOT FUNCTION
# =================================================
def chatbot_response(message: str):
    msg = message.lower().strip()

    # -------------------------------------------------
    # SMART INTENT OVERRIDE (NO RETRAINING REQUIRED)
    # -------------------------------------------------
    if any(word in msg for word in ["reorder", "restock", "order again", "low stock"]):
        intent = "reorder"
    else:
        intent = model.predict(vectorizer.transform([msg]))[0]

    # =================================================
    # INVENTORY
    # =================================================
    if intent == "inventory":
        inventory = get_inventory()  # realtime fetch

        # Drug-specific query
        for item in inventory:
            if item["Drug_Name"].lower() in msg:
                return {
                    "type": "text",
                    "response": (
                        f"📦 **Inventory Status**\n\n"
                        f"• Medicine: **{item['Drug_Name']}**\n"
                        f"• Available Stock: **{item['Current_Stock']:,} units**\n\n"
                        "📊 Source: Live inventory records"
                    )
                }

        # Overall inventory summary
        total_stock = sum(i["Current_Stock"] for i in inventory)
        top_items = inventory[:5]

        response_text = (
            "📦 **Inventory Overview**\n\n"
            f"• **Total Stock:** {total_stock:,} units\n\n"
            "• **Top Available Medicines:**\n"
        )

        for item in top_items:
            response_text += (
                f"  • {item['Drug_Name']} — {item['Current_Stock']:,} units\n"
            )

        response_text += "\n📊 Source: Live inventory records"

        return {
            "type": "text",
            "response": response_text
        }

    # =================================================
    # EXPIRY
    # =================================================
    if intent == "expiry":
        expiry = get_expiry_alerts()  # realtime fetch

        if not expiry:
            return {
                "type": "text",
                "response": "✅ No medicines are nearing expiry currently."
            }

        response_text = (
            "⏳ **Expiry Alert Summary**\n\n"
            f"• **{len(expiry)} medicines** are approaching expiry.\n\n"
            "📋 Please review expiry dashboard for details."
        )

        return {
            "type": "text",
            "response": response_text
        }

    # =================================================
    # REORDER (FIXED & PROFESSIONAL)
    # =================================================
    if intent == "reorder":
        reorder = get_reorder()  # realtime fetch

        if not reorder:
            return {
                "type": "text",
                "response": "✅ All medicines are sufficiently stocked. No reorders required."
            }

        response_text = (
            "📦 **Reorder Recommendations**\n\n"
            "The following medicines are low in stock and require reordering:\n\n"
        )

        for item in reorder[:5]:
            response_text += (
                f"  • {item['Drug_Name']} — {item['Current_Stock']} units remaining\n"
            )

        response_text += "\n📊 Source: Live stock monitoring system"

        return {
            "type": "text",
            "response": response_text
        }

    # =================================================
    # LOSS
    # =================================================
    if intent == "loss":
        expiry = get_expiry_alerts()
        total_loss = sum(item.get("Potential_Loss", 0) for item in expiry)

        return {
            "type": "text",
            "response": (
                "💰 **Expiry Loss Analysis**\n\n"
                f"• Estimated Financial Loss: **₹{int(total_loss):,}**\n\n"
                "📉 Recommendation: Improve stock rotation and forecasting."
            )
        }

    # =================================================
    # FALLBACK
    # =================================================
    return {
        "type": "text",
        "response": (
            "🤖 **Inventory Assistant Help**\n\n"
            "I can assist you with:\n"
            "• Inventory status\n"
            "• Expiry alerts\n"
            "• Reorder recommendations\n"
            "• Expiry-related loss analysis\n\n"
            "Please ask a pharmacy-related question."
        )
    }
