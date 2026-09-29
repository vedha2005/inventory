import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import date, timedelta


# ============================================================
# 1. CONNECT TO MYSQL
# ============================================================

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Vedha2005@",
    database="supermart"
)

print("MySQL Connected Successfully!")


# ============================================================
# 2. READ DAILY SALES FROM SQLMESH
# ============================================================

query = """
SELECT
    sale_date,
    SUM(total_sales) AS daily_total_sales
FROM analytics.daily_sales
GROUP BY sale_date
ORDER BY sale_date
"""

df = pd.read_sql(query, db)


print("\nDaily Sales Data:")
print(df)


# ============================================================
# 3. CHECK WHETHER DATA EXISTS
# ============================================================

if df.empty:

    print("\nNo sales data found!")

    db.close()
    exit()


# ============================================================
# 4. CHECK NUMBER OF SALES DAYS
# ============================================================

number_of_days = df["sale_date"].nunique()

print(
    f"\nNumber of sales days available: {number_of_days}"
)


# ============================================================
# 5. REQUIRE MINIMUM 30 DAYS
# ============================================================

MINIMUM_DAYS = 30


if number_of_days < MINIMUM_DAYS:

    print("\nInsufficient historical data!")
    print(
        f"At least {MINIMUM_DAYS} different sales days "
        f"are required for prediction."
    )

    print(
        f"Currently available: {number_of_days} days"
    )

    print(
        f"Need {MINIMUM_DAYS - number_of_days} "
        f"more sales days."
    )

    db.close()
    exit()


# ============================================================
# 6. PREPARE DATA FOR MACHINE LEARNING
# ============================================================

df["sale_date"] = pd.to_datetime(
    df["sale_date"]
)

df = df.sort_values(
    "sale_date"
).reset_index(drop=True)


# Create sequential day number

df["day_number"] = range(
    1,
    len(df) + 1
)


# ============================================================
# 7. CREATE TRAINING DATA
# ============================================================

X = df[
    ["day_number"]
]

y = df[
    "daily_total_sales"
]


# ============================================================
# 8. TRAIN LINEAR REGRESSION MODEL
# ============================================================

model = LinearRegression()

model.fit(
    X,
    y
)


print("\nML Model trained successfully!")


# ============================================================
# 9. PREDICT TOMORROW'S SALES
# ============================================================

next_day_number = len(df) + 1


predicted_sales = model.predict(
    [[next_day_number]]
)[0]


# Don't allow negative sales

predicted_sales = max(
    0,
    predicted_sales
)


tomorrow = date.today() + timedelta(days=1)


# ============================================================
# 10. DISPLAY PREDICTION
# ============================================================

print("\n======================================")
print("      TOMORROW SALES PREDICTION")
print("======================================")

print(
    f"Prediction Date : {tomorrow}"
)

print(
    f"Predicted Sales : Rs. {predicted_sales:,.2f}"
)

print("======================================")


# ============================================================
# 11. CLOSE DATABASE
# ============================================================

db.close()

print(
    "\nPrediction completed successfully!"
)