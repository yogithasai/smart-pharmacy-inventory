import pandas as pd

PURCHASES = "backend/data/pharmacy_purchases_noisy.json"
SALES = "backend/data/pharmacy_sales_noisy.json"

def get_inventory():
    purchases = pd.read_json(PURCHASES)
    sales = pd.read_json(SALES)

    purchased = purchases.groupby("Drug_Name")["Qty_Received"].sum()
    sold = sales.groupby("Drug_Name")["Qty_Sold"].sum()

    inventory = (purchased - sold).fillna(0).reset_index()
    inventory.columns = ["Drug_Name", "Current_Stock"]

    return inventory.to_dict(orient="records")
