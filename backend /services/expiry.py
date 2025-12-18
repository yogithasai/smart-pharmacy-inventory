import pandas as pd
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

PURCHASES = os.path.join(DATA_DIR, "pharmacy_purchases_noisy.json")

def get_expiry_alerts():
    df = pd.read_json(PURCHASES, lines=True)
    df["Expiry_Date"] = pd.to_datetime(df["Expiry_Date"])

    today = datetime.today()
    df["Days_To_Expiry"] = (df["Expiry_Date"] - today).dt.days

    alerts = df[df["Days_To_Expiry"] <= 30][
        ["Drug_Name", "Batch_Number", "Qty_Received", "Days_To_Expiry"]
    ]

    return alerts.to_dict(orient="records")
