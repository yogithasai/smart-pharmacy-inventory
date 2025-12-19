from services.inventory import get_inventory
from services.expiry import get_expiry_alerts
from services.forecast import get_reorder

def get_dashboard_stats():
    inventory = get_inventory()
    expiry = get_expiry_alerts()
    reorder = get_reorder()

    total_medicines = len(inventory)
    low_stock_count = len(reorder)
    expiring_soon = len(expiry)

    # Example revenue calculation (replace with sales table later)
    revenue_estimate = sum(
        item["Current_Stock"] * 5 for item in inventory
    )

    return {
        "total_medicines": total_medicines,
        "low_stock": low_stock_count,
        "expiring_soon": expiring_soon,
        "revenue": int(revenue_estimate)
    }
