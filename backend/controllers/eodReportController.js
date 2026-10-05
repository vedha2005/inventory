const path = require("path");
const fs = require("fs");

const eodReportModel = require("../models/eodReportModel");


// Get today's EOD reports
const getTodayReports = (req, res) => {
    const today = new Date().toISOString().split("T")[0];

    const role = req.query.role || req.headers["x-user-role"];
    const branchId = req.query.branch_id || req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            message: "Branch information is required"
        });
    }

    eodReportModel.getTodayReports(
        today,
        branchId,
        isSuperAdmin,
        (err, results) => {
            if (err) {
                console.error(
                    "Error fetching today's EOD reports:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch today's EOD reports"
                });
            }

            return res.status(200).json(results);
        }
    );
};


// Get all previous EOD reports
const getAllReports = (req, res) => {
    const role = req.query.role || req.headers["x-user-role"];
    const branchId = req.query.branch_id || req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            message: "Branch information is required"
        });
    }

    eodReportModel.getAllReports(
        branchId,
        isSuperAdmin,
        (err, results) => {
            if (err) {
                console.error(
                    "Error fetching EOD reports:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch EOD reports"
                });
            }

            return res.status(200).json(results);
        }
    );
};


// Get monthly reports
const getMonthlyReports = (req, res) => {
    const { year, month } = req.query;

    const role = req.query.role || req.headers["x-user-role"];
    const branchId = req.query.branch_id || req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!year || !month) {
        return res.status(400).json({
            message: "Year and month are required"
        });
    }

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            message: "Branch information is required"
        });
    }

    eodReportModel.getMonthlyReports(
        year,
        month,
        branchId,
        isSuperAdmin,
        (err, results) => {
            if (err) {
                console.error(
                    "Error fetching monthly EOD reports:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch monthly EOD reports"
                });
            }

            return res.status(200).json(results);
        }
    );
};


// Get one report by ID
const getReportById = (req, res) => {
    const { id } = req.params;

    const role = req.query.role || req.headers["x-user-role"];
    const branchId = req.query.branch_id || req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!id) {
        return res.status(400).json({
            message: "Report ID is required"
        });
    }

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            message: "Branch information is required"
        });
    }

    eodReportModel.getReportById(
        id,
        branchId,
        isSuperAdmin,
        (err, results) => {
            if (err) {
                console.error(
                    "Error fetching EOD report:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch EOD report"
                });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({
                    message: "EOD report not found"
                });
            }

            return res.status(200).json(results[0]);
        }
    );
};


// View PDF
const viewReport = (req, res) => {
    const { id } = req.params;

    const role = req.query.role || req.headers["x-user-role"];
    const branchId = req.query.branch_id || req.headers["x-branch-id"];

    const isSuperAdmin = role === "SUPER_ADMIN";

    if (!id) {
        return res.status(400).json({
            message: "Report ID is required"
        });
    }

    if (!isSuperAdmin && !branchId) {
        return res.status(403).json({
            message: "Branch information is required"
        });
    }

    // First check that the user is allowed to access this report
    eodReportModel.getReportById(
        id,
        branchId,
        isSuperAdmin,
        (err, results) => {
            if (err) {
                console.error(
                    "Error finding report:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to find EOD report"
                });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({
                    message: "EOD report not found or access denied"
                });
            }

            const report = results[0];

            if (!report.file_path) {
                return res.status(404).json({
                    message: "PDF file path is not available"
                });
            }

            /*
             * The Python EOD script stores the actual local
             * filesystem path in file_path.
             *
             * We resolve that path on the backend server.
             */
            let pdfPath = report.file_path;

            if (!path.isAbsolute(pdfPath)) {
                pdfPath = path.resolve(
                    __dirname,
                    "..",
                    pdfPath
                );
            } else {
                pdfPath = path.resolve(pdfPath);
            }

            // Make sure the file exists
            if (!fs.existsSync(pdfPath)) {
                console.error(
                    "EOD PDF not found:",
                    pdfPath
                );

                return res.status(404).json({
                    message: "EOD PDF file not found on server"
                });
            }

            // Only allow PDF files
            if (path.extname(pdfPath).toLowerCase() !== ".pdf") {
                return res.status(400).json({
                    message: "Invalid report file"
                });
            }

            // Tell browser to display the PDF
            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                `inline; filename="${path.basename(pdfPath)}"`
            );

            return res.sendFile(pdfPath);
        }
    );
};


module.exports = {
    getTodayReports,
    getAllReports,
    getMonthlyReports,
    getReportById,
    viewReport
};