# server/train_model.py
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

def train():
    print("Loading data...")
    # 1. Load the dataset we just created
    df = pd.read_csv('retail_data.csv')
    
    # 2. Separate Features (Inputs) and Target (Output)
    # We drop 'day_id' because the date doesn't cause demand in our simple simulation,
    # and we drop 'demand' from X because that's what we want to predict.
    X = df[['my_price', 'competitor_price', 'is_weekend', 'promotion_active']]
    y = df['demand']
    
    # 3. Split into Training (80%) and Testing (20%)
    # Context: We hide 20% of the data from the AI to test if it actually "learned"
    # or just "memorized" the answers.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 4. Initialize and Train XGBoost
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror', # We are predicting a number (Regression)
        n_estimators=100,             # Number of "trees" in the forest
        learning_rate=0.1,
        max_depth=5
    )
    model.fit(X_train, y_train)
    
    # 5. Evaluate Accuracy
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    
    print(f"Model Training Complete!")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print("interpretation: On average, our prediction is off by only +/- {:.0f} units.".format(mae))
    
    # 6. Save the Brain
    # We save in JSON format so it's lightweight and easy to load in the API
    model.save_model('server/model.json')
    print("Model saved to server/model.json")

if __name__ == "__main__":
    train()