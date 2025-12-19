import pandas as pd
import os
from datetime import datetime

# ---------- PATH SETUP ----------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

PURCHASES = os.path.join(DATA_DIR, "pharmacy_purchases_noisy.json")


def get_expiry_alerts():
    df = pd.read_json(PURCHASES)

    # Convert expiry date to datetime
    df["Expiry_Date"] = pd.to_datetime(df["Expiry_Date"])

    today = datetime.today()
    df["Days_To_Expiry"] = (df["Expiry_Date"] - today).dt.days

    # Normalize drug names
    df["Drug_Name"] = df["Drug_Name"].str.lower().str.replace("-", " ")

    # Filter medicines expiring in next 30 days
    alerts = df[df["Days_To_Expiry"] <= 30].copy()

    # Calculate potential loss
    alerts["Potential_Loss"] = alerts["Qty_Received"] * alerts["Unit_Cost_Price"]

    result = alerts[[
        "Drug_Name",
        "Batch_Number",
        "Qty_Received",
        "Expiry_Date",
        "Days_To_Expiry",
        "Potential_Loss"
    ]]

    return result.sort_values("Days_To_Expiry").to_dict(orient="records")
