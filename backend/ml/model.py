import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import date


# -----------------------------
# 1. Connect to MySQL
# -----------------------------

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Vedha2005@",
    database="supermart"
)

print("MySQL Connected Successfully!")


# -----------------------------
# 2. Read SQLMesh data
# -----------------------------

query = """
SELECT
    product_id,
    product_name,
    sale_date,
    quantity_sold
FROM analytics.daily_sales
ORDER BY product_id, sale_date
"""

df = pd.read_sql(query, db)

print("\nSales Data:")
print(df)


# -----------------------------
# 3. Check data
# -----------------------------

if df.empty:
    print("No sales data found!")
    db.close()
    exit()


# -----------------------------
# 4. Train ML model
# -----------------------------

predictions = []

for product_id in df["product_id"].unique():

    product_data = df[
        df["product_id"] == product_id
    ].copy()

    product_data = product_data.sort_values(
        "sale_date"
    )

    # Need at least 2 sales records
    if len(product_data) < 2:
        print(
            f"Skipping {product_data['product_name'].iloc[0]} "
            f"- not enough data"
        )
        continue

    # Convert dates to numbers
    product_data["day_number"] = range(
        1,
        len(product_data) + 1
    )

    X = product_data[["day_number"]]

    y = product_data["quantity_sold"]

    model = LinearRegression()

    model.fit(X, y)


    # -----------------------------
    # 5. Predict next day
    # -----------------------------

    next_day = len(product_data) + 1

    predicted_quantity = model.predict(
        [[next_day]]
    )[0]

    # Don't allow negative prediction
    predicted_quantity = max(
        0,
        predicted_quantity
    )

    predictions.append({
        "product_id": int(product_id),
        "product_name": product_data[
            "product_name"
        ].iloc[0],
        "predicted_quantity": round(
            predicted_quantity,
            2
        )
    })


# -----------------------------
# 6. Display predictions
# -----------------------------

print("\nML Predictions:")

for prediction in predictions:

    print(
        prediction["product_name"],
        "→",
        prediction["predicted_quantity"],
        "units"
    )


# -----------------------------
# 7. Save predictions
# -----------------------------

cursor = db.cursor()

for prediction in predictions:

    sql = """
    INSERT INTO ml_predictions
    (
        product_id,
        product_name,
        predicted_quantity,
        prediction_date
    )
    VALUES (%s, %s, %s, %s)
    """

    values = (
        prediction["product_id"],
        prediction["product_name"],
        prediction["predicted_quantity"],
        date.today()
    )

    cursor.execute(sql, values)


db.commit()

cursor.close()
db.close()

print("\nPredictions saved successfully!")