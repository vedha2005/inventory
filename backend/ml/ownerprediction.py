import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import date


# =========================================================
# DATABASE CONNECTION
# =========================================================

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Vedha2005@",
    database="supermart"
)

print("MySQL Connected Successfully!")


# =========================================================
# CREATE PREDICTION TABLE
# =========================================================

cursor = db.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS owner_predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    prediction_date DATE NOT NULL UNIQUE,
    predicted_sales DECIMAL(12,2) NOT NULL,
    historical_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

db.commit()


# =========================================================
# GET CLEANED DATA FROM SQLMESH
# =========================================================

query = """
SELECT
    sale_date,
    SUM(total_sales) AS daily_sales
FROM analytics.daily_sales
GROUP BY sale_date
ORDER BY sale_date
"""

df = pd.read_sql(query, db)


# =========================================================
# CHECK DATA
# =========================================================

if df.empty:

    print("\n==========================================")
    print("          NO SALES DATA FOUND")
    print("==========================================")

    cursor.close()
    db.close()
    exit()


historical_days = df["sale_date"].nunique()

print(f"\nHistorical sales days available: {historical_days}")


# =========================================================
# MINIMUM DATA REQUIREMENT
# =========================================================

MINIMUM_DAYS = 30

if historical_days < MINIMUM_DAYS:

    print("\n==========================================")
    print("      NOT ENOUGH HISTORICAL DATA")
    print("==========================================")
    print(
        f"At least {MINIMUM_DAYS} different sales days "
        "are required for the owner prediction."
    )
    print(f"Currently available: {historical_days} days")
    print("==========================================")

    cursor.close()
    db.close()
    exit()


# =========================================================
# PREPARE DATA FOR MACHINE LEARNING
# =========================================================

df["sale_date"] = pd.to_datetime(df["sale_date"])

df = df.sort_values("sale_date").reset_index(drop=True)

# Sequential day number
df["day_number"] = range(1, len(df) + 1)


X = df[["day_number"]]

y = df["daily_sales"]


# =========================================================
# TRAIN MODEL
# =========================================================

print("\nTraining Owner Sales Prediction Model...")

model = LinearRegression()

model.fit(X, y)


# =========================================================
# PREDICT TOMORROW
# =========================================================

next_day_number = len(df) + 1

predicted_sales = model.predict(
    [[next_day_number]]
)[0]


# Never allow negative sales prediction
predicted_sales = max(0, predicted_sales)

predicted_sales = round(predicted_sales, 2)


# =========================================================
# TOMORROW DATE
# =========================================================

tomorrow = date.today()


# =========================================================
# DISPLAY RESULT
# =========================================================

print("\n==========================================")
print("        OWNER SALES PREDICTION")
print("==========================================")

print(f"Historical Days : {historical_days}")
print(f"Prediction Date  : {tomorrow}")
print(f"Predicted Sales  : ₹{predicted_sales:,.2f}")

print("==========================================")


# =========================================================
# SAVE PREDICTION
# =========================================================

insert_query = """
INSERT INTO owner_predictions
(
    prediction_date,
    predicted_sales,
    historical_days
)
VALUES (%s, %s, %s)

ON DUPLICATE KEY UPDATE
predicted_sales = VALUES(predicted_sales),
historical_days = VALUES(historical_days)
"""


values = (
    tomorrow,
    predicted_sales,
    historical_days
)

cursor.execute(insert_query, values)

db.commit()


print("\nPrediction saved successfully!")


# =========================================================
# CLOSE CONNECTION
# =========================================================

cursor.close()
db.close()

print("Database connection closed.")