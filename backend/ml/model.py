import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import date, timedelta


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Vedha2005@",
        database="supermart"
    )


# ============================================================
# 1. PREDICT TOTAL SALES FOR NEXT 7 DAYS
# ============================================================

def predict_weekly_sales():

    db = get_db_connection()

    try:

        query = """
            SELECT
                sale_date,
                SUM(total_sales) AS daily_sales
            FROM analytics.daily_sales
            GROUP BY sale_date
            ORDER BY sale_date
        """

        df = pd.read_sql(query, db)

    finally:
        db.close()

    # --------------------------------------------------------
    # Check historical data
    # --------------------------------------------------------

    if df.empty or len(df) < 2:
        print("Not enough historical sales data.")
        return None

    # --------------------------------------------------------
    # Convert date
    # --------------------------------------------------------

    df["sale_date"] = pd.to_datetime(df["sale_date"])

    # --------------------------------------------------------
    # Create sequential day number
    # --------------------------------------------------------

    df["day_number"] = range(len(df))

    # --------------------------------------------------------
    # Train Linear Regression model
    # --------------------------------------------------------

    model = LinearRegression()

    model.fit(
        df[["day_number"]],
        df["daily_sales"]
    )

    # --------------------------------------------------------
    # Predict next 7 days
    # --------------------------------------------------------

    last_day_number = df["day_number"].iloc[-1]

    future_days = [
        last_day_number + i
        for i in range(1, 8)
    ]

    future_predictions = model.predict(
        pd.DataFrame({
            "day_number": future_days
        })
    )

    # --------------------------------------------------------
    # Prevent negative predictions
    # --------------------------------------------------------

    future_predictions = [
        max(0, float(value))
        for value in future_predictions
    ]

    # --------------------------------------------------------
    # Calculate total expected sales
    # --------------------------------------------------------

    predicted_weekly_sales = sum(
        future_predictions
    )

    # --------------------------------------------------------
    # Prediction period
    # --------------------------------------------------------

    today = date.today()

    week_start = today + timedelta(days=1)
    week_end = today + timedelta(days=7)

    # --------------------------------------------------------
    # Save sales prediction
    # --------------------------------------------------------

    db = get_db_connection()

    try:

        cursor = db.cursor()

        # Remove previous prediction for same period
        delete_query = """
            DELETE FROM weekly_sales_predictions
            WHERE week_start_date = %s
              AND week_end_date = %s
        """

        cursor.execute(
            delete_query,
            (
                week_start,
                week_end
            )
        )

        insert_query = """
            INSERT INTO weekly_sales_predictions
            (
                week_start_date,
                week_end_date,
                predicted_sales,
                historical_days
            )
            VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            insert_query,
            (
                week_start,
                week_end,
                predicted_weekly_sales,
                len(df)
            )
        )

        db.commit()

        cursor.close()

    finally:
        db.close()

    # --------------------------------------------------------
    # Display sales prediction
    # --------------------------------------------------------

    print("----------------------------------------")
    print("WEEKLY SALES PREDICTION")
    print("----------------------------------------")
    print("Week Start:", week_start)
    print("Week End:", week_end)
    print(
        "Expected Sales:",
        round(predicted_weekly_sales, 2)
    )
    print("Historical Days:", len(df))
    print("----------------------------------------")

    return {
        "week_start": week_start,
        "week_end": week_end,
        "predicted_sales": round(
            predicted_weekly_sales,
            2
        ),
        "historical_days": len(df)
    }


# ============================================================
# 2. PREDICT WHICH PRODUCTS WILL SELL THE MOST
# ============================================================

def predict_top_products():

    db = get_db_connection()

    try:

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

    finally:
        db.close()

    # --------------------------------------------------------
    # Check product data
    # --------------------------------------------------------

    if df.empty:
        print("No product sales data available.")
        return []

    predictions = []

    # --------------------------------------------------------
    # Process each product separately
    # --------------------------------------------------------

    for product_id in df["product_id"].unique():

        product_df = df[
            df["product_id"] == product_id
        ].copy()

        product_df = product_df.sort_values(
            "sale_date"
        )

        # ----------------------------------------------------
        # Need at least 2 historical records
        # ----------------------------------------------------

        if len(product_df) < 2:
            continue

        # ----------------------------------------------------
        # Create sequential day number
        # ----------------------------------------------------

        product_df["day_number"] = range(
            len(product_df)
        )

        # ----------------------------------------------------
        # Train model
        # ----------------------------------------------------

        model = LinearRegression()

        model.fit(
            product_df[["day_number"]],
            product_df["quantity_sold"]
        )

        # ----------------------------------------------------
        # Predict next 7 days
        # ----------------------------------------------------

        last_day_number = product_df[
            "day_number"
        ].iloc[-1]

        future_days = [
            last_day_number + i
            for i in range(1, 8)
        ]

        future_predictions = model.predict(
            pd.DataFrame({
                "day_number": future_days
            })
        )

        # ----------------------------------------------------
        # Prevent negative quantities
        # ----------------------------------------------------

        future_predictions = [
            max(0, float(value))
            for value in future_predictions
        ]

        # ----------------------------------------------------
        # Total expected quantity for next 7 days
        # ----------------------------------------------------

        predicted_quantity = sum(
            future_predictions
        )

        predictions.append({
            "product_id": int(product_id),
            "product_name": product_df[
                "product_name"
            ].iloc[0],
            "predicted_quantity": round(
                predicted_quantity,
                2
            )
        })

    # --------------------------------------------------------
    # Check predictions
    # --------------------------------------------------------

    if not predictions:

        print(
            "Not enough historical data for product prediction."
        )

        return []

    # --------------------------------------------------------
    # Sort highest predicted quantity first
    # --------------------------------------------------------

    predictions.sort(
        key=lambda x: x["predicted_quantity"],
        reverse=True
    )

    # --------------------------------------------------------
    # Prediction period
    # --------------------------------------------------------

    today = date.today()

    week_start = today + timedelta(days=1)
    week_end = today + timedelta(days=7)

    # --------------------------------------------------------
    # Save product predictions
    # --------------------------------------------------------

    db = get_db_connection()

    try:

        cursor = db.cursor()

        # Remove previous predictions for same week
        delete_query = """
            DELETE FROM weekly_product_predictions
            WHERE week_start_date = %s
              AND week_end_date = %s
        """

        cursor.execute(
            delete_query,
            (
                week_start,
                week_end
            )
        )

        # ----------------------------------------------------
        # Insert new predictions
        # ----------------------------------------------------

        insert_query = """
            INSERT INTO weekly_product_predictions
            (
                product_id,
                product_name,
                week_start_date,
                week_end_date,
                predicted_quantity
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        for prediction in predictions:

            cursor.execute(
                insert_query,
                (
                    prediction["product_id"],
                    prediction["product_name"],
                    week_start,
                    week_end,
                    prediction["predicted_quantity"]
                )
            )

        db.commit()

        cursor.close()

    finally:
        db.close()

    # --------------------------------------------------------
    # Display TOP 5 predicted products
    # --------------------------------------------------------

    print("\n----------------------------------------")
    print("TOP 5 PRODUCTS EXPECTED TO SELL")
    print("----------------------------------------")

    for index, product in enumerate(
        predictions[:5],
        start=1
    ):

        print(
            index,
            ".",
            product["product_name"],
            "->",
            product["predicted_quantity"],
            "units"
        )

    print("----------------------------------------")

    return predictions


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    print("\n========================================")
    print("SUPERMART WEEKLY SALES PREDICTION")
    print("========================================\n")

    # --------------------------------------------------------
    # Predict total sales
    # --------------------------------------------------------

    sales_prediction = predict_weekly_sales()

    # --------------------------------------------------------
    # Predict top-selling products
    # --------------------------------------------------------

    product_predictions = predict_top_products()

    # --------------------------------------------------------
    # Final status
    # --------------------------------------------------------

    if sales_prediction is not None:

        print("\n========================================")
        print("PREDICTION COMPLETED SUCCESSFULLY")
        print("========================================")

        print(
            "Expected Sales:",
            sales_prediction["predicted_sales"]
        )

        print(
            "Prediction Period:",
            sales_prediction["week_start"],
            "to",
            sales_prediction["week_end"]
        )

        print(
            "Historical Days:",
            sales_prediction["historical_days"]
        )

        print(
            "Products Predicted:",
            len(product_predictions)
        )

        print("========================================\n")

    else:

        print(
            "\nPrediction could not be generated."
        )