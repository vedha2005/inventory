const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const productRoutes = require("./routes/productRoutes");

const customerRoutes = require("./routes/customerRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const billingRoutes = require("./routes/billingRoutes");

const ownerPredictionRoutes = require(
    "./routes/ownerPredictionRoutes"
);

const analyticsRoutes = require(
    "./routes/analyticsRoutes"
);

// Weekly Sales Prediction
const salesPredictionRoutes = require(
    "./routes/salesPredictionRoutes"
);

// EOD Reports
const eodReportRoutes = require(
    "./routes/eodReportRoutes"
);


const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// ROUTES
// ============================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/customers",
    customerRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/billing",
    billingRoutes
);

app.use(
    "/api/owner-prediction",
    ownerPredictionRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);


// ============================================================
// WEEKLY SALES PREDICTION
// ============================================================

app.use(
    "/api/sales-prediction",
    salesPredictionRoutes
);


// ============================================================
// EOD REPORTS
// ============================================================

app.use(
    "/api/eod-reports",
    eodReportRoutes
);


// ============================================================
// TEST ROUTE
// ============================================================

app.get("/", (req, res) => {

    res.send("Backend Running...");

});


// ============================================================
// START SERVER
// ============================================================

app.listen(5000, () => {

    console.log("Server running on port 5000");

});