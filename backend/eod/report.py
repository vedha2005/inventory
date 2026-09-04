from prefect import flow
import mysql.connector
from datetime import date
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os


@flow(name="supermart-eod-report", log_prints=True)
def eod_report():

    # MySQL Connection
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="#suganM@3009",
        database="supermart"
    )

    print("MySQL Connected Successfully!")

    cursor = connection.cursor(dictionary=True)

    # Today's date
    today = date.today()

    # Get today's total bills and sales
    sql = """
        SELECT
            COUNT(*) AS total_bills,
            COALESCE(SUM(total), 0) AS total_sales
        FROM bills
        WHERE DATE(bill_date) = %s
    """

    cursor.execute(sql, (today,))
    result = cursor.fetchone()

    # Create reports folder
    reports_folder = os.path.join(os.getcwd(), "reports")
    os.makedirs(reports_folder, exist_ok=True)

    # PDF file name
    pdf_path = os.path.join(
        reports_folder,
        f"EOD_Report_{today}.pdf"
    )

    # Create PDF
    pdf = canvas.Canvas(pdf_path, pagesize=A4)

    pdf.setTitle("SuperMart EOD Report")

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(150, 800, "SUPERMART EOD REPORT")

    pdf.setFont("Helvetica", 12)

    pdf.drawString(50, 750, f"Date: {today}")
    pdf.drawString(
        50,
        720,
        f"Total Bills: {result['total_bills']}"
    )
    pdf.drawString(
        50,
        690,
        f"Total Sales: Rs. {result['total_sales']}"
    )

    pdf.drawString(
        50,
        630,
        "Report generated automatically using Prefect."
    )

    pdf.save()

    print("PDF Created Successfully!")
    print("PDF Location:", pdf_path)

    # Close MySQL
    cursor.close()
    connection.close()

    print("EOD Report Completed Successfully!")


# Prefect deployment - runs every 5 minutes
if __name__ == "__main__":

    eod_report.serve(
        name="supermart-eod-deployment",
        cron="*/5 * * * *"
    )