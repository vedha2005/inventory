const db = require("../config/db");

// GET TODAY'S REPORTS
// Returns only the latest report for each branch/report type
const getTodayReports = (
    reportDate,
    branchId,
    isSuperAdmin,
    callback
) => {
    let query = `
        SELECT
            report_id,
            report_date,
            report_type,
            branch_id,
            report_name,
            file_path,
            created_at
        FROM (
            SELECT
                report_id,
                report_date,
                report_type,
                branch_id,
                report_name,
                file_path,
                created_at,

                ROW_NUMBER() OVER (
                    PARTITION BY
                        report_date,
                        report_type,
                        branch_id
                    ORDER BY
                        created_at DESC,
                        report_id DESC
                ) AS row_num

            FROM eod_reports

            WHERE report_date = ?
        ) AS reports

        WHERE row_num = 1
    `;

    const params = [reportDate];

    if (!isSuperAdmin) {
        query += `
            AND branch_id = ?
            AND report_type = 'DAILY'
        `;

        params.push(branchId);
    }

    query += `
        ORDER BY
            report_date DESC,
            report_type,
            branch_id
    `;

    db.query(query, params, callback);
};


// GET PREVIOUS REPORTS
// Removes duplicate reports generated on the same date
const getAllReports = (
    branchId,
    isSuperAdmin,
    callback
) => {

    let query;
    let params = [];

    if (!isSuperAdmin) {

        query = `
            SELECT
                report_id,
                report_date,
                report_type,
                branch_id,
                report_name,
                file_path,
                created_at
            FROM (
                SELECT
                    report_id,
                    report_date,
                    report_type,
                    branch_id,
                    report_name,
                    file_path,
                    created_at,

                    ROW_NUMBER() OVER (
                        PARTITION BY
                            report_date
                        ORDER BY
                            created_at DESC,
                            report_id DESC
                    ) AS row_num

                FROM eod_reports

                WHERE branch_id = ?
                  AND report_type = 'DAILY'
            ) AS reports

            WHERE row_num = 1

            ORDER BY
                report_date DESC
        `;

        params = [branchId];

    } else {

        query = `
            SELECT
                report_id,
                report_date,
                report_type,
                branch_id,
                report_name,
                file_path,
                created_at
            FROM (
                SELECT
                    report_id,
                    report_date,
                    report_type,
                    branch_id,
                    report_name,
                    file_path,
                    created_at,

                    ROW_NUMBER() OVER (
                        PARTITION BY
                            report_date,
                            report_type,
                            branch_id
                        ORDER BY
                            created_at DESC,
                            report_id DESC
                    ) AS row_num

                FROM eod_reports
            ) AS reports

            WHERE row_num = 1

            ORDER BY
                report_date DESC,
                report_type,
                branch_id
        `;
    }

    db.query(query, params, callback);
};


// GET MONTHLY REPORTS
// Returns only one report per date/branch/type
const getMonthlyReports = (
    year,
    month,
    branchId,
    isSuperAdmin,
    callback
) => {

    let query;
    let params;

    if (!isSuperAdmin) {

        query = `
            SELECT
                report_id,
                report_date,
                report_type,
                branch_id,
                report_name,
                file_path,
                created_at
            FROM (
                SELECT
                    report_id,
                    report_date,
                    report_type,
                    branch_id,
                    report_name,
                    file_path,
                    created_at,

                    ROW_NUMBER() OVER (
                        PARTITION BY
                            report_date
                        ORDER BY
                            created_at DESC,
                            report_id DESC
                    ) AS row_num

                FROM eod_reports

                WHERE YEAR(report_date) = ?
                  AND MONTH(report_date) = ?
                  AND branch_id = ?
                  AND report_type = 'DAILY'
            ) AS reports

            WHERE row_num = 1

            ORDER BY
                report_date DESC
        `;

        params = [year, month, branchId];

    } else {

        query = `
            SELECT
                report_id,
                report_date,
                report_type,
                branch_id,
                report_name,
                file_path,
                created_at
            FROM (
                SELECT
                    report_id,
                    report_date,
                    report_type,
                    branch_id,
                    report_name,
                    file_path,
                    created_at,

                    ROW_NUMBER() OVER (
                        PARTITION BY
                            report_date,
                            report_type,
                            branch_id
                        ORDER BY
                            created_at DESC,
                            report_id DESC
                    ) AS row_num

                FROM eod_reports

                WHERE YEAR(report_date) = ?
                  AND MONTH(report_date) = ?
            ) AS reports

            WHERE row_num = 1

            ORDER BY
                report_date DESC,
                report_type,
                branch_id
        `;

        params = [year, month];
    }

    db.query(query, params, callback);
};


// GET ONE REPORT BY ID
const getReportById = (
    reportId,
    branchId,
    isSuperAdmin,
    callback
) => {

    let query = `
        SELECT
            report_id,
            report_date,
            report_type,
            branch_id,
            report_name,
            file_path,
            created_at
        FROM eod_reports

        WHERE report_id = ?
    `;

    const params = [reportId];

    if (!isSuperAdmin) {

        query += `
            AND branch_id = ?
            AND report_type = 'DAILY'
        `;

        params.push(branchId);
    }

    query += `
        LIMIT 1
    `;

    db.query(query, params, callback);
};


module.exports = {
    getTodayReports,
    getAllReports,
    getMonthlyReports,
    getReportById
};