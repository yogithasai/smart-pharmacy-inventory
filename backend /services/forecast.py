import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

SALES = os.path.join(DATA_DIR, "pharmacy_sales_noisy.json")

def get_forecast(days=14):
    sales = pd.read_json(SALES, lines=True)
    avg_sales = sales.groupby("Drug_Name")["Qty_Sold"].mean()
    forecast = (avg_sales * days).reset_index()
    forecast.columns = ["Drug_Name", "Forecast_14_Days"]
    return forecast.to_dict(orient="records")


def get_reorder():
    from services.inventory import get_inventory

    inventory = pd.DataFrame(get_inventory())
    forecast = pd.DataFrame(get_forecast())

    df = inventory.merge(forecast, on="Drug_Name", how="left").fillna(0)
    df["Reorder_Qty"] = df["Forecast_14_Days"] - df["Current_Stock"]
    df = df[df["Reorder_Qty"] > 0]

    return df.to_dict(orient="records")
