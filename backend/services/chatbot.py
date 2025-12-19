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
    # SMART INTENT OVERRIDE (CRITICAL)
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

        # Specific medicine query
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

        response = (
            "📦 **Inventory Overview**\n\n"
            f"• **Total Stock:** {total_stock:,} units\n\n"
            "• **Top Available Medicines:**\n"
        )

        for item in top_items:
            response += f"  • {item['Drug_Name']} — {item['Current_Stock']:,} units\n"

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
    # REORDER (FULLY FIXED)
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

        total_reorder_items = len(reorder)

        response = (
            "📦 **Reorder Summary**\n\n"
            f"• **Medicines requiring reorder:** {total_reorder_items}\n\n"
            "• **Low Stock Medicines:**\n"
        )

        for item in reorder:
            response += (
                f"  • {item['Drug_Name']} — "
                f"{item['Current_Stock']} units remaining\n"
            )

        response += (
            "\n📌 **Action Required:**\n"
            "Please reorder the above medicines to avoid stock shortages.\n\n"
            "📊 Source: Live stock monitoring system"
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
            "• Reorder requirements\n"
            "• Loss due to expiry\n\n"
            "Please ask a pharmacy-related question."
        )
    }
