import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from training_data import training_data

# Split data
X_text = [q for q, i in training_data]
y = [i for q, i in training_data]

# Vectorizer
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    stop_words="english"
)

X = vectorizer.fit_transform(X_text)

# Model
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X, y)

# Save model
with open("nlp_model.pkl", "wb") as f:
    pickle.dump((vectorizer, model), f)

print("✅ NLP model trained & saved successfully")
