import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# ---------- PATH SETUP ----------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

PURCHASES = os.path.join(DATA_DIR, "pharmacy_purchases_noisy.json")
SALES = os.path.join(DATA_DIR, "pharmacy_sales_noisy.json")

# ---------- LOAD DATA ----------
purchases = pd.read_json(PURCHASES)
sales = pd.read_json(SALES)

# Normalize
purchases["Drug_Name"] = purchases["Drug_Name"].str.lower()
sales["Drug_Name"] = sales["Drug_Name"].str.lower()

questions = []
labels = []

# ----- INVENTORY INTENT -----
for drug in purchases["Drug_Name"].unique()[:20]:
    questions += [
        f"what is stock of {drug}",
        f"how much {drug} available",
        f"inventory of {drug}"
    ]
    labels += ["inventory"] * 3

# ----- EXPIRY INTENT -----
questions += [
    "which medicines expire soon",
    "show expiry alerts",
    "what drugs are expiring",
    "expired medicines list"
]
labels += ["expiry"] * 4

# ----- REORDER INTENT -----
questions += [
    "what should i reorder",
    "suggest medicines to order",
    "restock medicines",
    "low stock medicines"
]
labels += ["reorder"] * 4

# ----- LOSS INTENT -----
questions += [
    "how much loss due to expiry",
    "wastage report",
    "expired stock loss"
]
labels += ["loss"] * 3

# ----- TRAIN MODEL -----
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)

model = LogisticRegression()
model.fit(X, labels)

# Save model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "nlp_model.pkl")
with open(MODEL_PATH, "wb") as f:
    pickle.dump((vectorizer, model), f)

print("✅ NLP Chatbot model trained successfully")
print(f"📁 Model saved at: {MODEL_PATH}")
