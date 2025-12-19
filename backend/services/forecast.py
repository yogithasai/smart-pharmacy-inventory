import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

SALES = os.path.join(DATA_DIR, "pharmacy_sales_noisy.json")

def get_forecast(days=14):
    sales = pd.read_json(SALES)

    # Normalize drug names
    sales["Drug_Name"] = (
        sales["Drug_Name"]
        .str.lower()
        .str.replace("-", " ")
        .str.strip()
    )

    # Average daily sales
    avg_sales = sales.groupby("Drug_Name")["Qty_Sold"].mean()

    forecast = (avg_sales * days).reset_index()

    # 🔥 CRITICAL: Rename columns for frontend compatibility
    forecast.columns = ["medicine", "predicted_demand"]

    forecast["predicted_demand"] = forecast["predicted_demand"].astype(int)

    return forecast.to_dict(orient="records")


def get_reorder():
    from services.inventory import get_inventory

    inventory = pd.DataFrame(get_inventory())
    forecast = pd.DataFrame(get_forecast())

    inventory["Drug_Name"] = inventory["Drug_Name"].str.lower().str.strip()
    forecast["medicine"] = forecast["medicine"].str.lower().str.strip()

    df = inventory.merge(
        forecast,
        left_on="Drug_Name",
        right_on="medicine",
        how="left"
    ).fillna(0)

    df["Reorder_Qty"] = df["predicted_demand"] - df["Current_Stock"]
    df = df[df["Reorder_Qty"] > 0]

    df["Reorder_Qty"] = df["Reorder_Qty"].astype(int)

    return df[["Drug_Name", "Reorder_Qty"]].to_dict(orient="records")
