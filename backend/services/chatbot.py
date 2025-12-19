import os
import pickle
from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder

# =================================================
# PATH FIX
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

    # =================================================
    # SMART INTENT OVERRIDE
    # =================================================
    reorder_keywords = [
        "reorder", "restock", "order again", "low stock",
        "need to order", "how many to reorder", "reorder status"
    ]

    if any(word in msg for word in reorder_keywords):
        intent = "reorder"
    else:
        intent = model.predict(vectorizer.transform([msg]))[0]

    # =================================================
    # INVENTORY
    # =================================================
    if intent == "inventory":
        inventory = get_inventory()

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

        total_stock = sum(i["Current_Stock"] for i in inventory)

        response = (
            "📦 **Inventory Overview**\n\n"
            f"• **Total Stock:** {total_stock:,} units\n\n"
            "• **Top Available Medicines:**\n"
        )

        for item in inventory[:5]:
            response += (
                f"  • {item['Drug_Name']} — "
                f"{item['Current_Stock']:,} units\n"
            )

        response += "\n📊 Source: Live inventory records"

        return {"type": "text", "response": response}

    # =================================================
    # EXPIRY
    # =================================================
    if intent == "expiry":
        expiry = get_expiry_alerts()

        if not expiry:
            return {
                "type": "text",
                "response": "✅ No medicines are nearing expiry currently."
            }

        return {
            "type": "text",
            "response": (
                "⏳ **Expiry Alert Summary**\n\n"
                f"• **{len(expiry)} medicines** are approaching expiry.\n\n"
                "📋 Please check the expiry dashboard for detailed dates."
            )
        }

    # =================================================
    # ✅ REORDER (FORECAST-BASED, REAL DATA)
    # =================================================
    if intent == "reorder":
        reorder = get_reorder()

        if not reorder:
            return {
                "type": "text",
                "response": (
                    "✅ **Reorder Status**\n\n"
                    "All medicines are sufficiently stocked.\n"
                    "No reorders are required at this time."
                )
            }

        response = (
            "📦 **Forecast-Based Reorder Recommendations**\n\n"
            f"• **Medicines requiring reorder:** {len(reorder)}\n\n"
        )

        for item in reorder:
            response += (
                f"• **{item['Drug_Name']}**\n"
                f"  Current Stock: {item['Current_Stock']} units\n"
                f"  Forecast (14 days): {item['Forecast_14_Days']} units\n"
                f"  👉 Reorder Quantity: **{item['Reorder_Qty']} units**\n\n"
            )

        response += (
            "📊 **Reason:** Forecasted demand exceeds current stock.\n"
            "🧠 **Source:** Sales-driven demand forecasting model"
        )

        return {"type": "text", "response": response}

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
                "📉 Recommendation: Improve stock rotation and demand forecasting."
            )
        }

    # =================================================
    # FALLBACK
    # =================================================
    return {
        "type": "text",
        "response": (
            "🤖 **Inventory Assistant Help**\n\n"
            "You can ask me about:\n"
            "• Inventory status\n"
            "• Expiry alerts\n"
            "• Forecast-based reorder requirements\n"
            "• Loss due to expiry\n\n"
            "Please ask a pharmacy-related question."
        )
    }
