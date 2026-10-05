import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";
import "../css/eodreports.css";

const EODReports = () => {

    const [todayReports, setTodayReports] = useState([]);
    const [allReports, setAllReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const branchId = localStorage.getItem("branch_id");

    const isSuperAdmin = role === "SUPER_ADMIN";


    // GET BRANCH NAME
    const getBranchName = (report) => {

        if (report.branch_id === 1) {
            return "Chennai Branch";
        }

        if (report.branch_id === 2) {
            return "Madurai Branch";
        }

        if (report.branch_id === 3) {
            return "Trichy Branch";
        }

        return "All Branches";
    };


    // FORMAT DATE
    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        return new Date(dateValue).toLocaleDateString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata"
            }
        );
    };


    // GET YYYY-MM-DD
    const getDateString = (dateValue) => {

        const date = new Date(dateValue);

        return date.toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        );
    };


    // TODAY
    const getTodayDate = () => {

        return new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        );
    };


    // YESTERDAY
    const getYesterdayDate = () => {

        const today = new Date();

        today.setDate(
            today.getDate() - 1
        );

        return today.toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        );
    };


    // DAY BEFORE YESTERDAY
    const getDayBeforeYesterdayDate = () => {

        const today = new Date();

        today.setDate(
            today.getDate() - 2
        );

        return today.toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        );
    };


    // FETCH EOD REPORTS
    const fetchReports = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");


                const params = {
                    role: isSuperAdmin
                        ? "SUPER_ADMIN"
                        : "BRANCH_USER"
                };


                if (!isSuperAdmin) {

                    params.branch_id =
                        branchId;
                }


                // TODAY REPORTS
                const todayResponse =
                    await axios.get(
                        "http://localhost:5000/api/eod-reports/today",
                        {
                            params
                        }
                    );


                // ALL PREVIOUS REPORTS
                const allResponse =
                    await axios.get(
                        "http://localhost:5000/api/eod-reports",
                        {
                            params
                        }
                    );


                setTodayReports(
                    todayResponse.data || []
                );

                setAllReports(
                    allResponse.data || []
                );

            } catch (err) {

                console.error(
                    "Error fetching EOD reports:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load EOD reports."
                );

            } finally {

                setLoading(false);
            }

        },
        [
            isSuperAdmin,
            branchId
        ]
    );


    // LOAD REPORTS
    useEffect(() => {

        fetchReports();

    }, [fetchReports]);


    // OPEN PDF
    const openReport = (report) => {

        if (!report.report_id) {

            alert(
                "Report ID is not available."
            );

            return;
        }


        const params =
            new URLSearchParams();


        params.append(
            "role",
            isSuperAdmin
                ? "SUPER_ADMIN"
                : "BRANCH_USER"
        );


        if (!isSuperAdmin) {

            params.append(
                "branch_id",
                branchId
            );
        }


        window.open(
            `http://localhost:5000/api/eod-reports/view/${report.report_id}?${params.toString()}`,
            "_blank"
        );
    };


    // FORMAT REPORT TYPE
    const formatReportType = (type) => {

        if (!type) {
            return "-";
        }

        return type.replace(
            /_/g,
            " "
        );
    };


    // GROUP REPORTS BY DATE
    const groupReportsByDate = () => {

        const grouped = {};


        allReports.forEach(
            (report) => {

                const date =
                    getDateString(
                        report.report_date
                    );


                if (!grouped[date]) {

                    grouped[date] = [];
                }


                grouped[date].push(
                    report
                );
            }
        );


        return grouped;
    };


    // LOADING
    if (loading) {

        return (
            <div className="eod-reports-container">

                <div className="eod-loading">

                    Loading EOD reports...

                </div>

            </div>
        );
    }


    const groupedReports =
        groupReportsByDate();


    // SORT DATES NEWEST FIRST
    const sortedDates =
        Object.keys(
            groupedReports
        ).sort(
            (a, b) =>
                new Date(b) -
                new Date(a)
        );


    // REMOVE TODAY FROM PREVIOUS REPORTS
    const previousDates =
        sortedDates.filter(
            (date) =>
                date !== getTodayDate()
        );


    return (

        <div className="eod-reports-container">


            {/* HEADER */}

            <div className="eod-header">

                <div>

                    <h1>
                        📄 EOD Reports
                    </h1>

                    <p>

                        {isSuperAdmin
                            ? "Daily reports from all branches"
                            : `${getBranchName({
                                branch_id:
                                    Number(branchId)
                            })} daily reports`
                        }

                    </p>

                </div>


                <div className="eod-user-info">

                    <strong>
                        {username}
                    </strong>

                    <span>

                        {isSuperAdmin
                            ? "Super Admin"
                            : getBranchName({
                                branch_id:
                                    Number(branchId)
                            })
                        }

                    </span>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="eod-error">

                    {error}

                </div>

            )}


            {/* TODAY */}

            <div className="eod-card">

                <div className="eod-card-header">

                    <div>

                        <h2>
                            📅 TODAY
                        </h2>

                        <p>
                            Today's EOD report
                        </p>

                    </div>

                </div>


                {todayReports.length === 0 ? (

                    <div className="eod-empty">

                        Today's report is not
                        available yet.

                    </div>

                ) : (

                    <div className="today-reports-list">

                        {todayReports.map(
                            (report) => (

                                <div
                                    className="today-report-item"
                                    key={
                                        report.report_id
                                    }
                                >

                                    <div className="report-icon">
                                        📄
                                    </div>


                                    <div className="report-info">

                                        <h3>
                                            {
                                                report.report_name
                                            }
                                        </h3>


                                        {isSuperAdmin && (

                                            <p>

                                                Branch:{" "}

                                                {
                                                    getBranchName(
                                                        report
                                                    )
                                                }

                                            </p>

                                        )}


                                        <p>

                                            Date:{" "}

                                            {
                                                formatDate(
                                                    report.report_date
                                                )
                                            }

                                        </p>


                                        <span className="report-type-badge">

                                            {
                                                formatReportType(
                                                    report.report_type
                                                )
                                            }

                                        </span>

                                    </div>


                                    <button
                                        className="view-report-button"
                                        onClick={() =>
                                            openReport(
                                                report
                                            )
                                        }
                                    >

                                        👁 View PDF

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* PREVIOUS REPORTS */}

            {previousDates.length > 0 && (

                <div className="eod-card">

                    <div className="eod-card-header">

                        <div>

                            <h2>
                                📚 PREVIOUS REPORTS
                            </h2>

                            <p>
                                Daily EOD reports
                            </p>

                        </div>

                    </div>


                    {previousDates.map(
                        (date) => (

                            <div
                                key={date}
                                className="eod-date-section"
                            >

                                <div className="eod-date-heading">

                                    <h2>

                                        {date ===
                                            getYesterdayDate()
                                            ? "📅 YESTERDAY"

                                            : date ===
                                                getDayBeforeYesterdayDate()
                                                ? "📅 DAY BEFORE YESTERDAY"

                                                : `📅 ${formatDate(
                                                    date
                                                )}`
                                        }

                                    </h2>

                                </div>


                                <div className="today-reports-list">

                                    {groupedReports[
                                        date
                                    ].map(
                                        (report) => (

                                            <div
                                                className="today-report-item"
                                                key={
                                                    report.report_id
                                                }
                                            >

                                                <div className="report-icon">
                                                    📄
                                                </div>


                                                <div className="report-info">

                                                    <h3>
                                                        {
                                                            report.report_name
                                                        }
                                                    </h3>


                                                    {isSuperAdmin && (

                                                        <p>

                                                            Branch:{" "}

                                                            {
                                                                getBranchName(
                                                                    report
                                                                )
                                                            }

                                                        </p>

                                                    )}


                                                    <p>

                                                        Date:{" "}

                                                        {
                                                            formatDate(
                                                                report.report_date
                                                            )
                                                        }

                                                    </p>


                                                    <span className="report-type-badge">

                                                        {
                                                            formatReportType(
                                                                report.report_type
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                <button
                                                    className="view-report-button"
                                                    onClick={() =>
                                                        openReport(
                                                            report
                                                        )
                                                    }
                                                >

                                                    👁 View PDF

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* AUTOMATION */}

            <div className="eod-automation-card">

                <div className="automation-icon">
                    ⚙️
                </div>


                <div>

                    <h3>
                        Automated EOD Processing
                    </h3>


                    <p>

                        EOD reports are generated
                        automatically by Prefect every
                        day at{" "}

                        <strong>
                            11:00 PM IST
                        </strong>.

                    </p>


                    <p>

                        This dashboard only retrieves
                        generated reports. It does not
                        generate reports manually.

                    </p>

                </div>

            </div>

        </div>
    );
};


export default EODReports;