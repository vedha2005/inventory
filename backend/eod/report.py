from prefect import flow
import mysql.connector
from datetime import date
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Vedha2005@",
        database="supermart"
    )

    return connection


# ============================================================
# DRAW PDF HEADER
# ============================================================

def draw_header(pdf, title, subtitle, today):

    pdf.setFillColor(colors.HexColor("#2E7D32"))

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(50, 800, "SUPERMART")

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, 770, title)

    pdf.setFillColor(colors.black)

    pdf.setFont("Helvetica", 11)
    pdf.drawString(50, 745, subtitle)
    pdf.drawString(50, 725, f"Report Date: {today}")

    pdf.line(50, 710, 545, 710)


# ============================================================
# DRAW SECTION TITLE
# ============================================================

def draw_section_title(pdf, title, y):

    pdf.setFillColor(colors.HexColor("#2E7D32"))

    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, title)

    pdf.setFillColor(colors.black)

    return y - 25


# ============================================================
# DRAW KEY VALUE
# ============================================================

def draw_value(pdf, label, value, y):

    pdf.setFont("Helvetica", 11)

    pdf.drawString(60, y, f"{label}:")

    pdf.setFont("Helvetica-Bold", 11)

    pdf.drawRightString(520, y, str(value))

    return y - 22


# ============================================================
# GET BRANCHES
# ============================================================

def get_branches(cursor):

    sql = """
        SELECT
            branch_id,
            branch_name,
            location
        FROM branches
        ORDER BY branch_id
    """

    cursor.execute(sql)

    return cursor.fetchall()


# ============================================================
# GET BRANCH EOD SUMMARY
# ============================================================

def get_branch_summary(cursor, branch_id, today):

    sql = """
        SELECT
            COUNT(*) AS total_bills,

            COUNT(DISTINCT customer_id) AS total_customers,

            COALESCE(SUM(total), 0) AS total_sales,

            COALESCE(SUM(paid_amount), 0) AS total_paid,

            COALESCE(SUM(return_amount), 0) AS total_return

        FROM bills

        WHERE branch_id = %s

        AND DATE(bill_date) = %s
    """

    cursor.execute(
        sql,
        (branch_id, today)
    )

    result = cursor.fetchone()

    if result is None:
        result = {
            "total_bills": 0,
            "total_customers": 0,
            "total_sales": 0,
            "total_paid": 0,
            "total_return": 0
        }

    return result


# ============================================================
# GET PRODUCTS SOLD
# ============================================================

def get_products_sold(cursor, branch_id, today):

    sql = """
        SELECT
            COALESCE(SUM(bi.quantity), 0) AS products_sold

        FROM bill_items bi

        INNER JOIN bills b
            ON bi.bill_id = b.bill_id

        WHERE b.branch_id = %s

        AND DATE(b.bill_date) = %s
    """

    cursor.execute(
        sql,
        (branch_id, today)
    )

    result = cursor.fetchone()

    return int(result["products_sold"] or 0)


# ============================================================
# GET TOP SELLING PRODUCTS
# ============================================================

def get_top_products(cursor, branch_id, today):

    sql = """
        SELECT
            p.product_name,

            SUM(bi.quantity) AS quantity_sold,

            SUM(bi.item_total) AS sales_amount

        FROM bill_items bi

        INNER JOIN bills b
            ON bi.bill_id = b.bill_id

        INNER JOIN products p
            ON bi.product_id = p.id

        WHERE b.branch_id = %s

        AND DATE(b.bill_date) = %s

        GROUP BY
            p.id,
            p.product_name

        ORDER BY
            quantity_sold DESC

        LIMIT 10
    """

    cursor.execute(
        sql,
        (branch_id, today)
    )

    return cursor.fetchall()


# ============================================================
# GET LOW STOCK PRODUCTS
# ============================================================

def get_low_stock_products(cursor, branch_id):

    sql = """
        SELECT
            p.product_name,
            bp.quantity

        FROM branch_products bp

        INNER JOIN products p
            ON bp.product_id = p.id

        WHERE bp.branch_id = %s

        AND p.is_active = TRUE

        AND bp.quantity <= 10

        ORDER BY
            bp.quantity ASC,
            p.product_name ASC

        LIMIT 15
    """

    cursor.execute(
        sql,
        (branch_id,)
    )

    return cursor.fetchall()


# ============================================================
# CREATE BRANCH PDF
# ============================================================

def create_branch_pdf(
    branch,
    summary,
    products_sold,
    top_products,
    low_stock_products,
    today,
    reports_folder
):

    branch_id = branch["branch_id"]
    branch_name = branch["branch_name"]
    location = branch["location"]

    safe_branch_name = (
        branch_name
        .replace(" ", "_")
        .replace("/", "_")
        .replace("\\", "_")
    )

    pdf_path = os.path.join(
        reports_folder,
        f"EOD_{safe_branch_name}_{today}.pdf"
    )

    pdf = canvas.Canvas(
        pdf_path,
        pagesize=A4
    )

    pdf.setTitle(
        f"SuperMart EOD Report - {branch_name}"
    )

    # --------------------------------------------------------
    # HEADER
    # --------------------------------------------------------

    draw_header(
        pdf,
        "END OF DAY REPORT",
        f"Branch: {branch_name}",
        today
    )

    y = 680

    # --------------------------------------------------------
    # BRANCH INFORMATION
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Branch Information",
        y
    )

    y = draw_value(
        pdf,
        "Branch ID",
        branch_id,
        y
    )

    y = draw_value(
        pdf,
        "Branch Name",
        branch_name,
        y
    )

    y = draw_value(
        pdf,
        "Location",
        location or "N/A",
        y
    )

    y -= 15

    # --------------------------------------------------------
    # SALES SUMMARY
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Daily Sales Summary",
        y
    )

    total_bills = int(
        summary["total_bills"] or 0
    )

    total_customers = int(
        summary["total_customers"] or 0
    )

    total_sales = float(
        summary["total_sales"] or 0
    )

    total_paid = float(
        summary["total_paid"] or 0
    )

    total_return = float(
        summary["total_return"] or 0
    )

    if total_bills > 0:
        average_bill = (
            total_sales / total_bills
        )
    else:
        average_bill = 0

    y = draw_value(
        pdf,
        "Total Bills",
        total_bills,
        y
    )

    y = draw_value(
        pdf,
        "Customers Served",
        total_customers,
        y
    )

    y = draw_value(
        pdf,
        "Products Sold",
        products_sold,
        y
    )

    y = draw_value(
        pdf,
        "Total Sales",
        f"Rs. {total_sales:.2f}",
        y
    )

    y = draw_value(
        pdf,
        "Paid Amount",
        f"Rs. {total_paid:.2f}",
        y
    )

    y = draw_value(
        pdf,
        "Return Amount",
        f"Rs. {total_return:.2f}",
        y
    )

    y = draw_value(
        pdf,
        "Average Bill Value",
        f"Rs. {average_bill:.2f}",
        y
    )

    y -= 15

    # --------------------------------------------------------
    # TOP SELLING PRODUCTS
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Top Selling Products",
        y
    )

    if len(top_products) == 0:

        pdf.setFont(
            "Helvetica",
            10
        )

        pdf.drawString(
            60,
            y,
            "No products sold today."
        )

        y -= 25

    else:

        pdf.setFont(
            "Helvetica-Bold",
            10
        )

        pdf.drawString(
            60,
            y,
            "Product"
        )

        pdf.drawString(
            300,
            y,
            "Quantity"
        )

        pdf.drawString(
            400,
            y,
            "Sales"
        )

        y -= 18

        pdf.setFont(
            "Helvetica",
            10
        )

        for product in top_products:

            if y < 80:

                pdf.showPage()

                draw_header(
                    pdf,
                    "END OF DAY REPORT",
                    f"Branch: {branch_name}",
                    today
                )

                y = 680

                pdf.setFont(
                    "Helvetica",
                    10
                )

            pdf.drawString(
                60,
                y,
                str(product["product_name"])
            )

            pdf.drawString(
                300,
                y,
                str(product["quantity_sold"])
            )

            pdf.drawString(
                400,
                y,
                f"Rs. {float(product['sales_amount']):.2f}"
            )

            y -= 18

    y -= 15

    # --------------------------------------------------------
    # LOW STOCK
    # --------------------------------------------------------

    if y < 180:

        pdf.showPage()

        draw_header(
            pdf,
            "END OF DAY REPORT",
            f"Branch: {branch_name}",
            today
        )

        y = 680

    y = draw_section_title(
        pdf,
        "Low Stock Products",
        y
    )

    if len(low_stock_products) == 0:

        pdf.setFont(
            "Helvetica",
            10
        )

        pdf.drawString(
            60,
            y,
            "No low-stock products."
        )

    else:

        pdf.setFont(
            "Helvetica-Bold",
            10
        )

        pdf.drawString(
            60,
            y,
            "Product"
        )

        pdf.drawString(
            400,
            y,
            "Quantity Left"
        )

        y -= 18

        pdf.setFont(
            "Helvetica",
            10
        )

        for product in low_stock_products:

            if y < 60:

                pdf.showPage()

                draw_header(
                    pdf,
                    "END OF DAY REPORT",
                    f"Branch: {branch_name}",
                    today
                )

                y = 680

                pdf.setFont(
                    "Helvetica",
                    10
                )

            pdf.drawString(
                60,
                y,
                str(product["product_name"])
            )

            pdf.drawString(
                400,
                y,
                str(product["quantity"])
            )

            y -= 18

    # --------------------------------------------------------
    # FOOTER
    # --------------------------------------------------------

    pdf.setFont(
        "Helvetica-Oblique",
        9
    )

    pdf.drawString(
        50,
        30,
        "Report generated automatically using Prefect."
    )

    pdf.save()

    print(
        f"Branch EOD PDF created: {pdf_path}"
    )

    return pdf_path


# ============================================================
# CREATE SUPER ADMIN PDF
# ============================================================

def create_all_branches_pdf(
    branch_reports,
    today,
    reports_folder
):

    pdf_path = os.path.join(
        reports_folder,
        f"EOD_All_Branches_{today}.pdf"
    )

    pdf = canvas.Canvas(
        pdf_path,
        pagesize=A4
    )

    pdf.setTitle(
        "SuperMart All Branches EOD Report"
    )

    # --------------------------------------------------------
    # HEADER
    # --------------------------------------------------------

    draw_header(
        pdf,
        "ALL BRANCHES EOD REPORT",
        "Super Admin Report",
        today
    )

    y = 680

    # --------------------------------------------------------
    # BRANCH-WISE SALES
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Branch-wise Daily Performance",
        y
    )

    pdf.setFont(
        "Helvetica-Bold",
        9
    )

    pdf.drawString(
        50,
        y,
        "Branch"
    )

    pdf.drawString(
        200,
        y,
        "Bills"
    )

    pdf.drawString(
        260,
        y,
        "Customers"
    )

    pdf.drawString(
        340,
        y,
        "Products"
    )

    pdf.drawString(
        410,
        y,
        "Sales"
    )

    y -= 20

    pdf.setFont(
        "Helvetica",
        9
    )

    grand_bills = 0
    grand_customers = 0
    grand_products = 0
    grand_sales = 0
    grand_paid = 0
    grand_return = 0

    best_branch = None
    best_sales = -1

    for report in branch_reports:

        branch_name = report["branch_name"]

        bills = report["total_bills"]
        customers = report["total_customers"]
        products = report["products_sold"]
        sales = report["total_sales"]

        pdf.drawString(
            50,
            y,
            str(branch_name)[:24]
        )

        pdf.drawString(
            200,
            y,
            str(bills)
        )

        pdf.drawString(
            260,
            y,
            str(customers)
        )

        pdf.drawString(
            340,
            y,
            str(products)
        )

        pdf.drawString(
            410,
            y,
            f"Rs. {sales:.2f}"
        )

        grand_bills += bills
        grand_customers += customers
        grand_products += products
        grand_sales += sales

        grand_paid += report["total_paid"]
        grand_return += report["total_return"]

        if sales > best_sales:

            best_sales = sales
            best_branch = branch_name

        y -= 20

        if y < 100:

            pdf.showPage()

            draw_header(
                pdf,
                "ALL BRANCHES EOD REPORT",
                "Super Admin Report",
                today
            )

            y = 680

            pdf.setFont(
                "Helvetica",
                9
            )

    y -= 15

    # --------------------------------------------------------
    # GRAND TOTAL
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Overall SuperMart Summary",
        y
    )

    y = draw_value(
        pdf,
        "Total Bills",
        grand_bills,
        y
    )

    y = draw_value(
        pdf,
        "Total Customers Served",
        grand_customers,
        y
    )

    y = draw_value(
        pdf,
        "Total Products Sold",
        grand_products,
        y
    )

    y = draw_value(
        pdf,
        "Total Sales",
        f"Rs. {grand_sales:.2f}",
        y
    )

    y = draw_value(
        pdf,
        "Total Paid Amount",
        f"Rs. {grand_paid:.2f}",
        y
    )

    y = draw_value(
        pdf,
        "Total Return Amount",
        f"Rs. {grand_return:.2f}",
        y
    )

    y -= 15

    # --------------------------------------------------------
    # BEST BRANCH
    # --------------------------------------------------------

    y = draw_section_title(
        pdf,
        "Best Performing Branch",
        y
    )

    if best_branch:

        pdf.setFont(
            "Helvetica-Bold",
            13
        )

        pdf.drawString(
            60,
            y,
            str(best_branch)
        )

        pdf.setFont(
            "Helvetica",
            10
        )

        pdf.drawString(
            60,
            y - 20,
            f"Sales: Rs. {best_sales:.2f}"
        )

    else:

        pdf.setFont(
            "Helvetica",
            10
        )

        pdf.drawString(
            60,
            y,
            "No sales recorded today."
        )

    # --------------------------------------------------------
    # FOOTER
    # --------------------------------------------------------

    pdf.setFont(
        "Helvetica-Oblique",
        9
    )

    pdf.drawString(
        50,
        30,
        "Report generated automatically using Prefect."
    )

    pdf.save()

    print(
        f"All Branches EOD PDF created: {pdf_path}"
    )

    return pdf_path


# ============================================================
# PREFECT EOD FLOW
# ============================================================

@flow(
    name="supermart-eod-report",
    log_prints=True
)
def eod_report():

    print("=" * 60)
    print("SUPERMART EOD REPORT STARTED")
    print("=" * 60)

    # --------------------------------------------------------
    # CONNECT MYSQL
    # --------------------------------------------------------

    connection = get_connection()

    print(
        "MySQL Connected Successfully!"
    )

    cursor = connection.cursor(
        dictionary=True
    )

    # --------------------------------------------------------
    # TODAY
    # --------------------------------------------------------

    today = date.today()

    print(
        f"Generating EOD reports for: {today}"
    )

    # --------------------------------------------------------
    # CREATE REPORTS FOLDER
    # --------------------------------------------------------

    reports_folder = os.path.join(
        os.getcwd(),
        "reports"
    )

    os.makedirs(
        reports_folder,
        exist_ok=True
    )

    # --------------------------------------------------------
    # GET ALL BRANCHES
    # --------------------------------------------------------

    branches = get_branches(cursor)

    print(
        f"Branches found: {len(branches)}"
    )

    if len(branches) == 0:

        print(
            "No branches found in database."
        )

        cursor.close()
        connection.close()

        return

    # --------------------------------------------------------
    # STORE ALL BRANCH DATA
    # --------------------------------------------------------

    branch_reports = []

    # --------------------------------------------------------
    # GENERATE EACH BRANCH REPORT
    # --------------------------------------------------------

    for branch in branches:

        branch_id = branch["branch_id"]
        branch_name = branch["branch_name"]

        print(
            f"Generating report for: {branch_name}"
        )

        # Get sales summary

        summary = get_branch_summary(
            cursor,
            branch_id,
            today
        )

        # Get products sold

        products_sold = get_products_sold(
            cursor,
            branch_id,
            today
        )

        # Get top products

        top_products = get_top_products(
            cursor,
            branch_id,
            today
        )

        # Get low stock

        low_stock_products = get_low_stock_products(
            cursor,
            branch_id
        )

        # Convert values safely

        total_bills = int(
            summary["total_bills"] or 0
        )

        total_customers = int(
            summary["total_customers"] or 0
        )

        total_sales = float(
            summary["total_sales"] or 0
        )

        total_paid = float(
            summary["total_paid"] or 0
        )

        total_return = float(
            summary["total_return"] or 0
        )

        # Create branch PDF

        create_branch_pdf(
            branch,
            summary,
            products_sold,
            top_products,
            low_stock_products,
            today,
            reports_folder
        )

        # Store branch summary

        branch_reports.append(
            {
                "branch_id": branch_id,
                "branch_name": branch_name,
                "total_bills": total_bills,
                "total_customers": total_customers,
                "products_sold": products_sold,
                "total_sales": total_sales,
                "total_paid": total_paid,
                "total_return": total_return
            }
        )

    # --------------------------------------------------------
    # GENERATE SUPER ADMIN REPORT
    # --------------------------------------------------------

    print(
        "Generating Super Admin All Branches report..."
    )

    create_all_branches_pdf(
        branch_reports,
        today,
        reports_folder
    )

    # --------------------------------------------------------
    # CLOSE DATABASE
    # --------------------------------------------------------

    cursor.close()
    connection.close()

    print("=" * 60)
    print("EOD REPORT COMPLETED SUCCESSFULLY")
    print("=" * 60)

    print(
        f"Reports location: {reports_folder}"
    )


# ============================================================
# PREFECT DEPLOYMENT
# ============================================================

if __name__ == "__main__":

    eod_report.serve(
        name="supermart-eod-deployment",
        cron="*/5 * * * *"
    )