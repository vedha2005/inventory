const express = require("express");

const router = express.Router();

const eodReportController = require("../controllers/eodReportController");


// Today's reports
router.get(
    "/today",
    eodReportController.getTodayReports
);


// All previous reports
router.get(
    "/",
    eodReportController.getAllReports
);


// Monthly reports
router.get(
    "/month",
    eodReportController.getMonthlyReports
);


// View PDF
router.get(
    "/view/:id",
    eodReportController.viewReport
);


// Get one report information
router.get(
    "/:id",
    eodReportController.getReportById
);


module.exports = router;