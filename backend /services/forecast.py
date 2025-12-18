import pandas as pd
SALES = "data/pharmacy_sales_noisy.json"

def get_forecast(days=14):
    sales = pd.read_json(SALES)
    avg_sales = sales.groupby("Drug_Name")["Qty_Sold"].mean()
    forecast = (avg_sales * days).reset_index()
    forecast.columns = ["Drug_Name", "Forecast_14_Days"]
    return forecast.to_dict(orient="records")

def get_reorder():
    from services.inventory import get_inventory
    forecast = get_forecast()
    inventory = get_inventory()

    inv_df = pd.DataFrame(inventory)
    fore_df = pd.DataFrame(forecast)

    df = inv_df.merge(fore_df, on="Drug_Name", how="left").fillna(0)
    df["Reorder_Qty"] = df["Forecast_14_Days"] - df["Current_Stock"]
    df = df[df["Reorder_Qty"] > 0]

    return df.to_dict(orient="records")
