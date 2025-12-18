import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

PURCHASES = os.path.join(DATA_DIR, "pharmacy_purchases_noisy.json")
SALES = os.path.join(DATA_DIR, "pharmacy_sales_noisy.json")


def get_inventory():
    purchases = pd.read_json(PURCHASES)
    sales = pd.read_json(SALES)

    # Normalize drug names (VERY IMPORTANT)
    purchases["Drug_Name"] = purchases["Drug_Name"].str.lower().str.replace("-", " ")
    sales["Drug_Name"] = sales["Drug_Name"].str.lower().str.replace("-", " ")

    purchased = purchases.groupby("Drug_Name")["Qty_Received"].sum()
    sold = sales.groupby("Drug_Name")["Qty_Sold"].sum()

    inventory = (purchased - sold).fillna(0).reset_index()
    inventory.columns = ["Drug_Name", "Current_Stock"]

    return inventory.to_dict(orient="records")
